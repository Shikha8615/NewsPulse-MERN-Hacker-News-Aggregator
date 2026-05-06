import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../services/api";
import StoryCard from "../components/StoryCard";
import toast from "react-hot-toast";

const Bookmarks = () => {
  const { user, updateBookmarks } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const { data } = await getMe();
        setStories(data.user.bookmarks || []);
        updateBookmarks(data.user.bookmarks.map((s) => s._id || s));
      } catch {
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);  // eslint-disable-line

  return (
    <main className="container" style={styles.main}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <span style={styles.accent}>Saved</span> Stories
          </h1>
          <p style={styles.sub}>
            {loading ? "Loading..." : `${stories.length} bookmarked ${stories.length === 1 ? "story" : "stories"}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={styles.skeletonList}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeletonCard}>
              <div className="skeleton" style={{ width: 24, height: 14, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 16, width: "75%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 11, width: "45%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--border-hover)" }}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No bookmarks yet</h3>
          <p style={styles.emptyText}>
            Browse the feed and click the bookmark icon to save stories here
          </p>
          <a href="/" style={styles.emptyLink}>Browse stories →</a>
        </div>
      ) : (
        <div style={styles.list}>
          {stories.map((story, i) => (
            <StoryCard key={story._id} story={story} index={i} />
          ))}
        </div>
      )}
    </main>
  );
};

const styles = {
  main: { paddingTop: 40, paddingBottom: 80 },
  header: { marginBottom: 32 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1, marginBottom: 8 },
  accent: { color: "var(--accent)" },
  sub: { fontSize: 13, color: "var(--text-3)" },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  skeletonList: { display: "flex", flexDirection: "column", gap: 8 },
  skeletonCard: { display: "flex", gap: 16, padding: "16px 20px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", alignItems: "center" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { display: "flex", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 },
  emptyText: { color: "var(--text-3)", fontSize: 13, marginBottom: 24, maxWidth: 300, margin: "0 auto 24px" },
  emptyLink: { color: "var(--accent)", fontSize: 14, fontWeight: 600, textDecoration: "none" },
};

export default Bookmarks;
