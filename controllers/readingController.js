const { validationResult } = require("express-validator/check");
const Reading = require("../models/Reading");
const io = require("../socket");

exports.getReading = async (req, res, next) => {
  res.status(201).json({ success: true });
};

exports.postReading = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const dateParts = req.body.date.split("/");
    const timeParts = req.body.time.split(":");
    const datetime = new Date(
      dateParts[2],
      parseInt(dateParts[0]) - 1,
      dateParts[1],
      ...timeParts
    );

    const reading = new Reading({
      nodeSerial: req.body.nodeSerial,
      temperature: req.body.temperature,
      spo2: req.body.spo2,
      heartRate: req.body.heartRate,
      cough: req.body.cough,
      lat: req.body.lat,
      lng: req.body.lng,
      datetime,
      cough: parseInt(req.body.cough),
      ir: req.body.ir,
      irBuffer: [],
      battery: req.body.battery,
    });
    await reading.save();
    console.log(datetime.toTimeString());
    console.log(reading);
    io.getIO().emit(req.body.nodeSerial, {
      nodeSerial: req.body.nodeSerial,
      reading,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
