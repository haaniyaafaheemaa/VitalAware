const express = require("express");

const {
  createVerification,
  updateVerification,
  getVerifications,
  getVerificationsByUser,
} = require("../controllers/verificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createVerification);

router.patch("/:id", protect, updateVerification);

router.get("/", protect, getVerifications);

router.get("/user/:userId", protect, getVerificationsByUser);

module.exports = router;