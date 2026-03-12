const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /login — Authenticate admin and return JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // const user = await User.findOne({ email: email.toLowerCase().trim() });
    // if (!user) {
    //   return res.status(401).json({ message: "Invalid credentials." });
    // }

    const originalEmail = process.env.ADMIN_EMAIL;
    const originalPassword = process.env.ADMIN_PASSWORD;
    if (email.toLowerCase().trim() !== originalEmail) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (password !== originalPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if(email.toLowerCase().trim() !== originalEmail || password !== originalPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid credentials." });
    // }

    const token = jwt.sign({ email: originalEmail }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, email: originalEmail });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { login };
