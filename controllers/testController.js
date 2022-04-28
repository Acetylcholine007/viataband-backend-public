const { validationResult } = require("express-validator/check");
const Reading = require("../models/Reading");
const io = require("../socket");

exports.testPostReading = async (req, res, next) => {
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
    let datetime = new Date(
      dateParts[2],
      parseInt(dateParts[0]) - 1,
      dateParts[1],
      ...timeParts
    );
    datetime = new Date(datetime - 3600000)

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
    console.log(datetime.toLocaleString());
    console.log(reading);
    io.getIO().emit(req.body.nodeSerial, {
      nodeSerial: req.body.nodeSerial,
      reading,
    });

    res.status(201).json(reading);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
