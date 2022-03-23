const { validationResult } = require("express-validator/check");
const Patient = require("../models/Patient");

exports.getPatients = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 12;
  try {
    const totalItems = await Patient.find().countDocuments();
    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Patients fetched successfully.",
      patients,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      const error = new Error("Could not find patient.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Patient fetched.", patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      const error = new Error("Could not find patient.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Patient fetched.", patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putPatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);

    patient.firstname = req.body.firstname;
    patient.lastname = req.body.lastname;
    patient.address = req.body.address;
    patient.age = req.body.age;
    patient.contactNo = req.body.contactNo;
    patient.sex = req.body.sex;
    await patient.save();
    res.status(201).json({
      message: "Patient updated",
      // node: node,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
