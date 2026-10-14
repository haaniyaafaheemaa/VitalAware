const Device = require("../models/Device");

// Register a device
const createDevice = async (req, res) => {
  try {
    const {
      deviceId,
      name,
      controller,
      sensor,
    } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    const existingDevice = await Device.findOne({ deviceId });

    if (existingDevice) {
      return res.status(409).json({
        success: false,
        message: "Device already registered",
      });
    }

    const device = await Device.create({
      deviceId,
      name,
      controller,
      sensor,
      status: "offline",
      wifiStatus: "disconnected",
      cloudStatus: "disconnected",
    });

    res.status(201).json({
      success: true,
      message: "Device registered successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register device",
      error: error.message,
    });
  }
};

// Get all devices
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
      error: error.message,
    });
  }
};

// Get device by ID
const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch device",
      error: error.message,
    });
  }
};


const Measurement = require("../models/Measurement");

// Receive a measurement from the physical ESP32.
const receiveDeviceMeasurement = async (req, res) => {
  try {
    const { heartRate, ppi, signalQuality, measurementAttempt } =
      req.body;

    const deviceId = req.deviceId;

    if (
      !Number.isFinite(heartRate) ||
      !Number.isFinite(ppi) ||
      !Number.isFinite(signalQuality)
    ) {
      return res.status(400).json({
        success: false,
        message: "heartRate, ppi and signalQuality must be numbers",
      });
    }

    if (
      heartRate < 45 || heartRate > 180 ||
      ppi < 333 || ppi > 1333 ||
      signalQuality < 0 || signalQuality > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Measurement is outside configured prototype limits",
      });
    }

    // Associate the reading with the configured owner of this device.
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device is not registered",
      });
    }

    // The registered owner must be configured before saving.
    // This prevents assigning a reading to an arbitrary user.
    const userId = process.env.DEVICE_USER_ID;

    if (!userId) {
      return res.status(500).json({
        success: false,
        message: "Device owner is not configured on the server",
      });
    }

    const measurement = await Measurement.create({
      userId,
      heartRate,
      ppi,
      signalQuality,
      measurementAttempt: Number.isInteger(measurementAttempt)
        ? measurementAttempt
        : 1,
      source: "esp32",
    });

    device.status = "online";
    device.wifiStatus = "connected";
    device.cloudStatus = "connected";
    device.lastSeen = new Date();

    await device.save();

    return res.status(201).json({
      success: true,
      message: "ESP32 measurement saved",
      data: {
        id: measurement._id,
        heartRate: measurement.heartRate,
        ppi: measurement.ppi,
        signalQuality: measurement.signalQuality,
        measuredAt: measurement.measuredAt,
      },
    });
  } catch (error) {
    console.error("ESP32 measurement error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save ESP32 measurement",
    });
  }
};


module.exports = {
  createDevice,
  getDevices,
  getDeviceById,
  receiveDeviceMeasurement,
};