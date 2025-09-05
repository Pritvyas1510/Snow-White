const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");
require("dotenv").config();

// Cookie settings for secure auth
const COOKIE_OPTIONS = {
  sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
  httpOnly: true,
  secure: process.env.PRODUCTION === "true",
  maxAge: parseInt(process.env.COOKIE_EXPIRATION_DAYS || 7) * 24 * 60 * 60 * 1000,
};

// @route   POST /api/auth/signup
// @desc    Register a new user
exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      isAdmin: false,
    });

    const sanitized = sanitizeUser(newUser);
    const token = generateToken(sanitized);

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json(sanitized);
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Signup failed: " + error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Login user and return token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const sanitized = sanitizeUser(user);
    const token = generateToken(sanitized);


    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({success:true,message:"Login succesfully",sanitized});
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed: " + error.message });
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user and clear token cookie
exports.logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out successfully" });
};

// @route   GET /api/auth/check-auth
// @desc    Check if user is authenticated (requires authMiddleware)
exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error("Auth check error:", error.message);
    res.status(500).json({ message: "Auth check failed" });
  }
};
