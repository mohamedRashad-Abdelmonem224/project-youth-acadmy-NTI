const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
const register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "This email address has been used before." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "This username is already taken." });
    }

    const user = await User.create({ name, username, email, password, role });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      status: "success",
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: " error occurred during recording.", error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "The login data is incorrect" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "The login data is incorrect" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: "success",
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "error occurred while logging in", error: err.message });
  }
};
const getMe = async (req, res) => {
  res.status(200).json({ status: "success", user: req.user });
};
module.exports = {
  register,
  login,
  getMe
};
