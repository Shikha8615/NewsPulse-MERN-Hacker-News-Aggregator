require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { scrapeHackerNews } = require("./scraper/hnScraper");

const authRoutes = require("./routes/auth");
const storyRoutes = require("./routes/stories");
const scrapeRoutes = require("./routes/scrape");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/scrape", scrapeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "NewsPulse API is running 🚀", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 NewsPulse server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}\n`);

  // Auto-run scraper on server start
  try {
    await scrapeHackerNews();
  } catch (err) {
    console.error("⚠️  Initial scrape failed (server still running):", err.message);
  }
});

module.exports = app;
