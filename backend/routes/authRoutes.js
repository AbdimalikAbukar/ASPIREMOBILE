const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  resetPassword,
} = require("../controllers/auth");

// Login Route
router.post("/login", loginUser);

// Registration Route
router.post("/register", registerUser);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
