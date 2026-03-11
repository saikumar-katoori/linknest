require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const { startTelegramBot } = require("./telegram/bot");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 LinkNest server running on port ${PORT}`);
  });

  // Start Telegram bot
  try {
    startTelegramBot();
  } catch (error) {
    console.error("Telegram bot failed to start:", error.message);
    console.log("Server continues running without Telegram bot.");
  }
};

start();
