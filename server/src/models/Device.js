const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      default: "VitalAware ESP32",
    },

    controller: {
      type: String,
      default: "ESP32",
    },

    sensor: {
      type: String,
      default: "MAX30102",
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    wifiStatus: {
      type: String,
      enum: ["connected", "disconnected"],
      default: "disconnected",
    },

    cloudStatus: {
      type: String,
      enum: ["connected", "disconnected"],
      default: "disconnected",
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    pendingReadings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Device", deviceSchema);