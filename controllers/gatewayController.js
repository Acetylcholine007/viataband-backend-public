const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Gateway = require("../models/Gateway");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const serialNumber = req.body.serialNumber;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new Gateway({
      serialNumber,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({ message: "Gateway created", gatewayId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const serialNumber = req.body.serialNumber;
    const password = req.body.password;
    
    let loadedGateway;
    const gateway = await Gateway.findOne({ serialNumber });
    if (!gateway) {
      const error = new Error("Gateway serial does not exist");
      error.statusCode = 401;
      throw error;
    }
    loadedGateway = gateway;
    const isEqual = await bcrypt.compare(password, gateway.password);
    if (!isEqual) {
      const error = new Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedGateway.email,
        userId: loadedGateway._id.toString(),
      },
      "TeamVitaband"
    );
    res
      .status(200)
      .json({ token: token, userId: loadedGateway._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getGateways = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 12;
    const totalItems = await Gateway.find().countDocuments();
    const gateways = await Gateway.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Gateways fetched successfully.",
      gateways,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getGateway = async (req, res, next) => {
  try {
    const gatewayId = req.params.gatewayId;
    const gateway = await Gateway.findById(gatewayId);
    if (!gateway) {
      const error = new Error("Could not find gateway.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Gateway fetched.", gateway });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putGateway = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const gatewayId = req.params.gatewayId;
    const gateway = await Gateway.findById(gatewayId);

    gateway.serialNumber = req.body.serialNumber;
    gateway.password = req.body.password;
    gateway.isVerified = req.body.isVerified;
    await gateway.save();
    res.status(201).json({
      message: "Gateway updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteGateway = async (req, res, next) => {
  try {
    const gatewayId = req.params.gatewayId;
    if (gatewayId === undefined) {
      const error = new Error("No gatewayId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    await Gateway.findByIdAndRemove(gatewayId);

    res.status(201).json({
      message: "Gateway Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
