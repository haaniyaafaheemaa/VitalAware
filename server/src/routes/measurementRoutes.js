const express = require("express");

const {
  createMeasurement,
  getMeasurements,
  getMeasurementsByUser,
} = require("../controllers/measurementController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a measurement
router.post("/", protect, createMeasurement);

// Get all measurements
router.get("/", protect, getMeasurements);

// Get measurements for the authenticated user
router.get("/user/:userId", protect, getMeasurementsByUser);

module.exports = router;