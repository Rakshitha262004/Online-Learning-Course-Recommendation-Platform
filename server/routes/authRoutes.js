const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { name, email, password, interests } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Normalise interests — trim whitespace, remove empty strings
    const normalisedInterests = Array.isArray(interests)
      ? interests.map((i) => i.trim()).filter(Boolean)
      : typeof interests === "string"
        ? interests.split(",").map((i) => i.trim()).filter(Boolean)
        : [];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      interests: normalisedInterests,
    });

    await user.save();

    res.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return user without password hash
    res.json({
      message: "Login Successful",
      token,
      user: {
        _id:       user._id,
        name:      user.name,
        email:     user.email,
        interests: user.interests,
      },
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// GET USER PROFILE
router.get("/profile/:userId", async (req, res) => {

  try {

    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


// UPDATE INTERESTS
router.put("/interests/:userId", async (req, res) => {

  try {

    const { interests } = req.body;

    if (!interests) {
      return res.status(400).json({
        message: "Interests are required"
      });
    }

    // Normalise interests — same logic as register
    const normalisedInterests = Array.isArray(interests)
      ? interests.map((i) => i.trim()).filter(Boolean)
      : typeof interests === "string"
        ? interests.split(",").map((i) => i.trim()).filter(Boolean)
        : [];

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { interests: normalisedInterests },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Interests updated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;