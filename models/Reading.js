const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readingSchema = Schema(
  {
    nodeSerial: String,
    temperature: Number,
    spo2: Number,
    heartRate: Number,
    cough: Boolean,
    lat: Number,
    lng: Number,
    datetime: Date,
    ir: Number,
    irBuffer: Array,
    battery: Number,
  },
  {
    timeseries: {
      timeField: "datetime",
      metaField: "nodeSerial",
      granularity: "seconds",
    },
    autoCreate: false,
    expireAfterSeconds: 86400,
  }
);

module.exports = mongoose.model("Reading", readingSchema);
