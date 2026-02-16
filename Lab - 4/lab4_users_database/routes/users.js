const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Validation failed",
        errors: ["email must be unique (duplicate email found)"],
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
