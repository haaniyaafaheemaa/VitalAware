const mongoose = require("mongoose");

const verificationSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symptoms: {
      type: [String],
      default: [],
    },

    context: {
      type: String,
      required: true,
    },

    additionalDetails: {
      type: String,
      default: "",
      maxlength: 300,
    },

    activity: {
      type: String,
      default: "",
    },

    sleep: {
      type: String,
      default: "",
    },

    stress: {
      type: String,
      default: "",
    },

    measurementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Measurement",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "started",
        "measuring",
        "accepted",
        "failed",
      ],
      default: "started",
    },

    result: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "VerificationSession",
  verificationSessionSchema
);