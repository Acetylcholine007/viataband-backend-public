const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gatewaySchema = new Schema({
  gatewaySerial: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ssid: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Gateway", gatewaySchema);
