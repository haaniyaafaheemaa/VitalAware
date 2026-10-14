const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());


// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VitalAware API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "VitalAware Backend",
    status: "healthy",
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`VitalAware server running on port ${PORT}`);
});