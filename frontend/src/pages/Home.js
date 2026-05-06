import React, { useState, useEffect, useCallback } from "react";
import { fetchStories, triggerScrape } from "../services/api";
import StoryCard from "../components/StoryCard";
import toast from "react-hot-toast";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadStories = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await fetchStories(pageNum, 10);
      setStories(data.stories);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories(page);
  }, [page, loadStories]);

  const handleScrape = async () => {
    setScraping(true);
    const toastId = toast.loading("Scraping Hacker News...");
    try {
      const { data } = await triggerScrape();
      toast.success(data.message, { id: toastId });
      await loadStories(1);
      setPage(1);
    } catch (err) {
      toast.error("Scrape failed. Try again.", { id: toastId });
    } finally {
      setScraping(false);
    }
  };

  return (
    <main className="container" style={styles.main}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <span style={styles.titleAccent}>Top</span> Stories
          </h1>
          <p style={styles.subtitle}>
            {total > 0 ? `${total} stories from Hacker News, sorted by points` : "Loading stories..."}
          </p>
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping || loading}
          style={styles.scrapeBtn}
        >
          {scraping ? (
            <>
              <span style={styles.spinner} />
              Scraping...
            </>
          ) : (
            <>
              <span>↻</span> Refresh
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div style={styles.skeletonList}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={styles.skeletonCard}>
              <div className="skeleton" style={{ width: 24, height: 14, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 16, width: "80%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 11, width: "50%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>◈</div>
          <h3 style={styles.emptyTitle}>No stories yet</h3>
          <p style={styles.emptyText}>Click Refresh to scrape the latest from Hacker News</p>
          <button onClick={handleScrape} style={styles.emptyBtn} disabled={scraping}>
            {scraping ? "Scraping..." : "Scrape Now"}
          </button>
        </div>
      ) : (
        <>
          <div style={styles.list}>
            {stories.map((story, i) => (
              <StoryCard key={story._id} story={story} index={(page - 1) * 10 + i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ ...styles.pageBtn, ...(page === 1 ? styles.pageBtnDisabled : {}) }}
              >
                ← Prev
              </button>
              <span style={styles.pageInfo}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ ...styles.pageBtn, ...(page === totalPages ? styles.pageBtnDisabled : {}) }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

const styles = {
  main: { paddingTop: 40, paddingBottom: 80 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 36,
    fontWeight: 800,
    color: "var(--text-1)",
    letterSpacing: "-1px",
    lineHeight: 1,
    marginBottom: 8,
  },
  titleAccent: { color: "var(--accent)" },
  subtitle: { fontSize: 13, color: "var(--text-3)" },
  scrapeBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 18px",
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-2)",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.2s",
    cursor: "pointer",
  },
  spinner: {
    width: 12,
    height: 12,
    border: "2px solid var(--border-hover)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  skeletonList: { display: "flex", flexDirection: "column", gap: 8 },
  skeletonCard: {
    display: "flex",
    gap: 16,
    padding: "16px 20px",
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: { fontSize: 48, color: "var(--border-hover)", marginBottom: 16 },
  emptyTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text-2)",
    marginBottom: 8,
  },
  emptyText: { color: "var(--text-3)", fontSize: 13, marginBottom: 24 },
  emptyBtn: {
    padding: "10px 24px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 32,
  },
  pageBtn: {
    padding: "8px 16px",
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-2)",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  pageInfo: { fontSize: 13, color: "var(--text-3)", fontFamily: "'DM Mono', monospace" },
};

export default Home;
