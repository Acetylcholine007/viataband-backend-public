const { validationResult } = require("express-validator/check");
const { DateTime } = require("luxon");
const Reading = require("../models/Reading");
const io = require("../socket");

exports.getReading = async (req, res, next) => {
  res.status(201).json({ success: true });
};

exports.postReading = async (req, res, next) => {
  const coughProb = +req.body.cough;
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

    let datetime = DateTime.local({
      year: dateParts[2],
      day: dateParts[1],
      month: dateParts[0],
      hour: timeParts[0],
      minute: timeParts[1],
      second: timeParts[2],
    }).setZone("Asia/Singapore");

    const reading = new Reading({
      nodeSerial: req.body.nodeSerial,
      temperature: req.body.temperature,
      spo2: req.body.spo2,
      heartRate: req.body.heartRate,
      cough: req.body.cough,
      lat: req.body.lat,
      lng: req.body.lng,
      datetime,
      cough: coughProb,
      ir: req.body.ir,
      irBuffer: [],
      battery: req.body.battery,
    });
    await reading.save();
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
