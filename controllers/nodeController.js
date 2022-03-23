const { validationResult } = require("express-validator/check");

const Node = require("../models/Node");
const Reading = require("../models/Reading");
const Patient = require("../models/Patient");

exports.getNodes = async (req, res, next) => {
  const perPage = 12;
  const query = req.query.query || "";
  const currentPage = req.query.page || 1;
  let queryTarget;
  switch (req.query.target) {
    case "nodeSerial":
      queryTarget = "nodeSerial";
      break;
    case "name":
      queryTarget = "name";
      break;
    case "location":
      queryTarget = "location";
      break;
    default:
      queryTarget = null;
  }
  try {
    const totalItems = await Node.find(
      queryTarget ? { [queryTarget]: query } : {}
    ).countDocuments();
    const nodes = await Node.find(queryTarget ? { [queryTarget]: query } : {})
      .populate("patient")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Nodes fetched successfully.",
      data: {
        nodes,
        totalItems,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNode = async (req, res, next) => {
  try {
    const nodeId = req.params.nodeId;
    const node = await Node.findById(nodeId).populate("patient");
    const readings = await Reading.find({
      source: { nodeSerial: node.nodeSerial },
    })
      .sort({ createdAt: -1 })
      .skip((1 - 1) * 5)
      .limit(5);

    res.status(200).json({
      message: "Node fetched.",
      data: {
        node,
        readings,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postNode = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const patient = req.body.patient;
    const nodeSerial = req.body.nodeSerial;
    const node = new Node({
      patient,
      nodeSerial,
    });
    await node.save();
    res.status(201).json({
      message: "Node added",
      data: {
        node,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putNode = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const patientData = req.body.patient || null;
    const nodeSerial = req.body.nodeSerial;
    let patient;

    const node = await Node.findOne({ nodeSerial });

    if (patientData !== null) {
      if (node.patient !== null) {
        patient = await Patient.findById(node.patient);
        patient.firstname = patientData.firstname;
        patient.lastname = patientData.lastname;
        patient.address = patientData.address;
        patient.age = patientData.age;
        patient.contactNo = patientData.contactNo;
        patient.sex = patientData.sex;
      } else {
        patient = await Patient.findOne({
          firstname: patientData.firstname,
          lastname: patientData.lastname,
        });
        if (patient) {
          const error = new Error("Patient already exists");
          error.statusCode = 422;
          throw error;
        }
        patient = new Patient(patientData);
      }
      await patient.save();
      node.patient = patient;
    } else {
      if (node.patient !== null) {
        await Patient.findByIdAndRemove(node.patient);
        node.patient = null;
      }
    }
    await node.save();
    res.status(201).json({
      message: "Node updated",
      data: { node },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNode = async (req, res, next) => {
  try {
    const nodeId = req.params.nodeId;
    if (nodeId === undefined) {
      const error = new Error("No nodeId params attached in URL");
      error.statusCode = 422;
      throw error;
    }
    const node = await Node.findById(nodeId);
    if (node.patient != null) {
      await Patient.findByIdAndRemove(node.patient);
    }

    await Node.findByIdAndRemove(nodeId);

    res.status(201).json({
      message: "Node Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
