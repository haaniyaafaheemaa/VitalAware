
const express = require("express");

const {
  createDevice,
  getDevices,
  getDeviceById,
  receiveDeviceMeasurement,
} = require("../controllers/deviceController");

const router = express.Router();

// Existing device management routes
router.post("/", createDevice);
router.get("/", getDevices);
router.get("/:id", getDeviceById);

// ESP32 measurement endpoint
router.post("/measurement", (req, res, next) => {
  const expectedKey = process.env.DEVICE_API_KEY;
  const receivedKey = req.get("x-device-key");

  if (!expectedKey || receivedKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized device",
    });
  }

  req.deviceId = req.get("x-device-id");

  if (!req.deviceId) {
    return res.status(400).json({
      success: false,
      message: "x-device-id header is required",
    });
  }

  next();
}, receiveDeviceMeasurement);

module.exports = router;
