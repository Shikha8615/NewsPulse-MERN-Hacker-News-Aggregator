const Story = require("../models/Story");
const User = require("../models/User");
const { scrapeHackerNews } = require("../scraper/hnScraper");

const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Story.countDocuments();
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: stories.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stories." });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found." });
    }

    res.status(200).json({ success: true, story });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ success: false, message: "Invalid story ID." });
    }
    res.status(500).json({ success: false, message: "Failed to fetch story." });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found." });
    }

    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Bookmark removed.",
        bookmarked: false,
        bookmarks: user.bookmarks,
      });
    } else {
      user.bookmarks.push(storyId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Story bookmarked.",
        bookmarked: true,
        bookmarks: user.bookmarks,
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ success: false, message: "Invalid story ID." });
    }
    res.status(500).json({ success: false, message: "Failed to toggle bookmark." });
  }
};

const triggerScrape = async (req, res) => {
  try {
    const result = await scrapeHackerNews();
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllStories, getStoryById, toggleBookmark, triggerScrape };
