import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toggleBookmark } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StoryCard = ({ story, index }) => {
  const { user, isBookmarked, updateBookmarks } = useAuth();
  const navigate = useNavigate();
  const [bookmarking, setBookmarking] = useState(false);

  const bookmarked = isBookmarked(story._id);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to bookmark stories");
      navigate("/login");
      return;
    }
    if (bookmarking) return;
    setBookmarking(true);
    try {
      const { data } = await toggleBookmark(story._id);
      updateBookmarks(data.bookmarks);
      toast.success(data.bookmarked ? "Bookmarked!" : "Removed bookmark");
    } catch (err) {
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarking(false);
    }
  };

  const getDomain = (url) => {
    try {
      if (!url || url.startsWith("item?")) return "news.ycombinator.com";
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "news.ycombinator.com";
    }
  };

  const getStoryUrl = (story) => {
    if (!story.url || story.url.startsWith("item?")) {
      return `https://news.ycombinator.com/${story.url || ""}`;
    }
    return story.url;
  };

  return (
    <div
      style={{
        ...styles.card,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        animation: `fadeUp 0.4s ease forwards ${index * 0.05}s`,
      }}
    >
      <div style={styles.rank}>
        <span style={styles.rankNum}>{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div style={styles.content}>
        <a
          href={getStoryUrl(story)}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.title}
        >
          {story.title}
        </a>

        <div style={styles.meta}>
          <span style={styles.domain}>⌁ {getDomain(story.url)}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.metaItem}>
            <span style={styles.pointsIcon}>▲</span>
            {story.points} pts
          </span>
          <span style={styles.dot}>·</span>
          <span style={styles.metaItem}>by {story.author}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.metaItem}>{story.postedAt}</span>
        </div>
      </div>

      <button
        onClick={handleBookmark}
        disabled={bookmarking}
        style={{
          ...styles.bookmarkBtn,
          ...(bookmarked ? styles.bookmarkActive : {}),
        }}
        title={bookmarked ? "Remove bookmark" : "Bookmark this story"}
      >
        {bookmarking ? (
          <span style={styles.spinner} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    padding: "16px 20px",
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    transition: "border-color 0.2s, background 0.2s",
    position: "relative",
  },
  rank: {
    flexShrink: 0,
    paddingTop: 2,
  },
  rankNum: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    color: "var(--text-3)",
    fontWeight: 400,
  },
  content: { flex: 1, minWidth: 0 },
  title: {
    display: "block",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    color: "var(--text-1)",
    lineHeight: 1.4,
    marginBottom: 8,
    transition: "color 0.15s",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  domain: {
    fontSize: 11,
    color: "var(--accent)",
    background: "var(--accent-dim)",
    padding: "2px 7px",
    borderRadius: 4,
    fontFamily: "'DM Mono', monospace",
  },
  dot: { color: "var(--text-3)", fontSize: 10 },
  metaItem: { fontSize: 12, color: "var(--text-3)" },
  pointsIcon: { color: "var(--accent)", marginRight: 2, fontSize: 10 },
  bookmarkBtn: {
    flexShrink: 0,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-3)",
    transition: "all 0.2s",
    marginTop: 2,
  },
  bookmarkActive: {
    background: "var(--accent-dim)",
    borderColor: "var(--accent)",
    color: "var(--accent)",
  },
  spinner: {
    width: 12,
    height: 12,
    border: "2px solid var(--border)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
    display: "block",
  },
};

export default StoryCard;
