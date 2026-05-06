const express = require("express");
const router = express.Router();
const { triggerScrape } = require("../controllers/storyController");

router.post("/", triggerScrape);

module.exports = router;
