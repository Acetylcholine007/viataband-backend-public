const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    isMale: {
      type: Boolean,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
