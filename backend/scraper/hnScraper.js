const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const scrapeHackerNews = async () => {
  try {
    console.log("🔍 Starting Hacker News scrape...");

    const { data } = await axios.get("https://news.ycombinator.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const stories = [];

    $(".athing").each((i, el) => {
      if (i >= 10) return false;

      const id = $(el).attr("id");
      const titleEl = $(el).find(".titleline > a").first();
      const title = titleEl.text().trim();
      const url = titleEl.attr("href") || "";

      const subtext = $(el).next(".spacer").length
        ? $(el).next().next()
        : $(el).next();

      const pointsText = subtext.find(".score").text().trim();
      const points = parseInt(pointsText) || 0;

      const author = subtext.find(".hnuser").text().trim() || "unknown";
      const postedAt = subtext.find(".age").attr("title") || subtext.find(".age").text().trim();

      if (title) {
        stories.push({ title, url, points, author, postedAt, hnId: id });
      }
    });

    if (stories.length === 0) {
      throw new Error("No stories found — HN structure may have changed");
    }

    let saved = 0;
    let updated = 0;

    for (const story of stories) {
      const result = await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (result) {
        saved++;
      }
    }

    console.log(`✅ Scrape complete: ${saved} stories saved/updated`);
    return {
      success: true,
      message: `Scraped ${stories.length} stories, saved/updated ${saved}`,
      count: stories.length,
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Scraper error:", error.message);
    throw new Error(`Scraping failed: ${error.message}`);
  }
};

module.exports = { scrapeHackerNews };
