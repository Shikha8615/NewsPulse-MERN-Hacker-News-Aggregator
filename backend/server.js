require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { scrapeHackerNews } = require("./scraper/hnScraper");

const authRoutes = require("./routes/auth");
const storyRoutes = require("./routes/stories");
const scrapeRoutes = require("./routes/scrape");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 NewsPulse Backend API Running Successfully",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/scrape", scrapeRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NewsPulse API is healthy 🚀",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 NewsPulse server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);

  try {
    console.log("🔍 Starting Hacker News scrape...");
    await scrapeHackerNews();
    console.log("✅ Initial scrape completed");
  } catch (err) {
    console.error(
      "⚠️ Initial scrape failed (server still running):",
      err.message
    );
  }
});

module.exports = app;
