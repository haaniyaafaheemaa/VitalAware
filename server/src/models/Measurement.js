const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    heartRate: {
      type: Number,
      required: true,
      min: 0,
    },

    ppi: {
      type: Number,
      required: true,
      min: 0,
    },

    signalQuality: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    measurementAttempt: {
      type: Number,
      default: 1,
    },

    source: {
      type: String,
      enum: ["mock", "esp32", "thingspeak"],
      default: "mock",
    },

    measuredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Measurement", measurementSchema);