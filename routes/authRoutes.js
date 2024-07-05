const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateAccessToken = require("../middleware/generateAccessToken");
const authenticateRefreshToken = require("../middleware/authenticateRefreshToken");
const generateRefreshToken = require("../middleware/generateRefreshToken");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const jwt = require("jsonwebtoken");

// http://localhost:4000/auth/register

// Registration route
router.post("/register", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      nickname,
      profilePicture,
      email,
      link,
      password,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstname,
      lastname,
      nickname,
      profilePicture,
      email,
      link,
      passwordHash,
    });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
});

// Refresh route
router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

// Export the router
module.exports = router;
