const Measurement = require("../models/Measurement");

// ============================================================
// CREATE MEASUREMENT
// ============================================================

const createMeasurement = async (req, res) => {
  try {
    const {
      heartRate,
      ppi,
      signalQuality,
      measurementAttempt,
      source,
    } = req.body;

    // User identity comes from the verified JWT.
    const userId = req.user.userId;

    if (
      heartRate === undefined ||
      ppi === undefined ||
      signalQuality === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "heartRate, ppi and signalQuality are required",
      });
    }

    const measurement = await Measurement.create({
      userId,
      heartRate,
      ppi,
      signalQuality,
      measurementAttempt,
      source,
    });

    res.status(201).json({
      success: true,
      message: "Measurement saved successfully",
      data: measurement,
    });
  } catch (error) {
    console.error("Create measurement error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save measurement",
      error: error.message,
    });
  }
};

// ============================================================
// GET MEASUREMENTS FOR CURRENT USER
// ============================================================

const getMeasurements = async (req, res) => {
  try {
    // Only fetch measurements belonging to
    // the currently authenticated user.
    const userId = req.user.userId;

    const measurements = await Measurement.find({
      userId,
    }).sort({ measuredAt: -1 });

    res.json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    console.error("Get measurements error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch measurements",
      error: error.message,
    });
  }
};

// ============================================================
// GET MEASUREMENTS FOR USER
// ============================================================

const getMeasurementsByUser = async (req, res) => {
  try {
    // Ignore the userId in the URL.
    // Always use the authenticated user's ID.
    const userId = req.user.userId;

    const measurements = await Measurement.find({
      userId,
    }).sort({ measuredAt: -1 });

    res.json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    console.error(
      "Get user measurements error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user measurements",
      error: error.message,
    });
  }
};

module.exports = {
  createMeasurement,
  getMeasurements,
  getMeasurementsByUser,
};