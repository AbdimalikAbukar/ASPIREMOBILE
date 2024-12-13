const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth");

// Login Route
router.post("/login", loginUser);

// Registration Route
router.post("/register", registerUser);

module.exports = router;
