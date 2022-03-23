const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readingSchema = Schema(
  {
    source: Object,
    temperature: Number,
    spo2: Number,
    heartReate: Number,
    cough: Boolean,
    lat: Number,
    lng: Number,
    datetime: Date,
    cough: Boolean,
    ir: Number,
    irBuffer: Array,
    battery: Number,
  },
  {
    timeseries: {
      timeField: "datetime",
      metaField: "source",
      granularity: "seconds",
    },
    autoCreate: false,
    expireAfterSeconds: 86400,
  }
);

module.exports = mongoose.model("Reading", readingSchema);
