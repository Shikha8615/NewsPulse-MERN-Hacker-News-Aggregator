const express = require("express");
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
  triggerScrape,
} = require("../controllers/storyController");
const { protect } = require("../middleware/auth");

router.get("/", getAllStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;
