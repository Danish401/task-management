const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");

// Register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Since JWT is stateless, you can send a client-side instruction to delete the token from storage
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

// Forgot Password (optional email-based)
const forgotPassword = async (req, res) => {
  // Implement logic for password reset with email utility
  res.status(200).json({ message: "Forgot password functionality not implemented" });
};

 


module.exports = { registerUser,logoutUser, loginUser, forgotPassword };
