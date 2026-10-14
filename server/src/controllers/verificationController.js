const VerificationSession = require("../models/VerificationSession");

// ============================================================
// CREATE VERIFICATION SESSION
// ============================================================

const createVerification = async (req, res) => {
  try {
    const {
      symptoms,
      context,
      additionalDetails,
      activity,
      sleep,
      stress,
    } = req.body;

    // Get the user from the verified JWT.
    // Do NOT trust userId sent by the frontend.
    const userId = req.user.userId;

    if (!context) {
      return res.status(400).json({
        success: false,
        message: "context is required",
      });
    }

    const session = await VerificationSession.create({
      userId,
      symptoms: symptoms || [],
      context,
      additionalDetails: additionalDetails || "",
      activity: activity || "",
      sleep: sleep || "",
      stress: stress || "",
      status: "started",
    });

    res.status(201).json({
      success: true,
      message: "Verification session created",
      data: session,
    });
  } catch (error) {
    console.error("Create verification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create verification session",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE VERIFICATION SESSION
// ============================================================

const updateVerification = async (req, res) => {
  try {
    const { measurementId, status, result } = req.body;

    const session = await VerificationSession.findById(
      req.params.id
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Verification session not found",
      });
    }

    // Security check:
    // Only the owner of the session can update it.
    if (session.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this verification session",
      });
    }

    if (measurementId !== undefined) {
      session.measurementId = measurementId;
    }

    if (status !== undefined) {
      session.status = status;
    }

    if (result !== undefined) {
      session.result = result;
    }

    await session.save();

    res.json({
      success: true,
      message: "Verification session updated",
      data: session,
    });
  } catch (error) {
    console.error("Update verification error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update verification session",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL VERIFICATION SESSIONS
// ============================================================

const getVerifications = async (req, res) => {
  try {
    const sessions = await VerificationSession.find()
      .populate("userId", "name email")
      .populate("measurementId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error("Get verifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch verification sessions",
      error: error.message,
    });
  }
};

// ============================================================
// GET VERIFICATION SESSIONS FOR CURRENT USER
// ============================================================

const getVerificationsByUser = async (req, res) => {
  try {
    // Ignore req.params.userId.
    // Always use the authenticated user's ID.
    const userId = req.user.userId;

    const sessions = await VerificationSession.find({
      userId,
    })
      .populate("measurementId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error(
      "Get user verification sessions error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user verification sessions",
      error: error.message,
    });
  }
};

module.exports = {
  createVerification,
  updateVerification,
  getVerifications,
  getVerificationsByUser,
};