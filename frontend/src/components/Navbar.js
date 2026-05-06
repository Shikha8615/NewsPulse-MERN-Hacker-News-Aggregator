import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span>News<span style={styles.logoAccent}>Pulse</span></span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive("/") ? styles.linkActive : {}) }}>
            Feed
          </Link>
          {user && (
            <Link
              to="/bookmarks"
              style={{ ...styles.link, ...(isActive("/bookmarks") ? styles.linkActive : {}) }}
            >
              Bookmarks
              {user.bookmarks?.length > 0 && (
                <span style={styles.badge}>{user.bookmarks.length}</span>
              )}
            </Link>
          )}
        </div>

        <div style={styles.actions}>
          {user ? (
            <div style={styles.userMenu}>
              <button
                style={styles.avatarBtn}
                onClick={() => setMenuOpen(!menuOpen)}
                title={user.name}
              >
                <span style={styles.avatar}>{user.name[0].toUpperCase()}</span>
                <span style={styles.userName}>{user.name.split(" ")[0]}</span>
                <span style={{ color: "var(--text-3)", fontSize: 10 }}>▼</span>
              </button>
              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownInfo}>
                    <div style={styles.dropdownName}>{user.name}</div>
                    <div style={styles.dropdownEmail}>{user.email}</div>
                  </div>
                  <div style={styles.dropdownDivider} />
                  <button onClick={handleLogout} style={styles.dropdownItem}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.btnGhost}>Sign in</Link>
              <Link to="/register" style={styles.btnPrimary}>Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "rgba(10,10,15,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 18,
    color: "var(--text-1)",
    letterSpacing: "-0.5px",
  },
  logoIcon: { color: "var(--accent)", fontSize: 20 },
  logoAccent: { color: "var(--accent)" },
  links: { display: "flex", alignItems: "center", gap: 8 },
  link: {
    padding: "6px 12px",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-2)",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  linkActive: {
    color: "var(--text-1)",
    background: "var(--bg-3)",
  },
  badge: {
    background: "var(--accent)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 5px",
    borderRadius: 99,
    fontFamily: "'Syne', sans-serif",
  },
  actions: { display: "flex", alignItems: "center", gap: 8 },
  btnGhost: {
    padding: "6px 14px",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-2)",
    fontSize: 13,
    fontWeight: 500,
    border: "1px solid var(--border)",
    background: "transparent",
    transition: "all 0.2s",
  },
  btnPrimary: {
    padding: "6px 14px",
    borderRadius: "var(--radius-sm)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    background: "var(--accent)",
    border: "none",
    transition: "all 0.2s",
    fontFamily: "'Syne', sans-serif",
  },
  userMenu: { position: "relative" },
  avatarBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "5px 10px",
    color: "var(--text-1)",
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.2s",
  },
  avatar: {
    width: 24,
    height: 24,
    background: "var(--accent)",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
  },
  userName: { fontSize: 13, fontWeight: 500 },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 4,
    minWidth: 180,
    boxShadow: "var(--shadow)",
    animation: "fadeIn 0.15s ease",
  },
  dropdownInfo: { padding: "8px 10px 6px" },
  dropdownName: { fontWeight: 600, fontSize: 13, color: "var(--text-1)", fontFamily: "'Syne', sans-serif" },
  dropdownEmail: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
  dropdownDivider: { height: 1, background: "var(--border)", margin: "4px 0" },
  dropdownItem: {
    width: "100%",
    padding: "8px 10px",
    background: "none",
    border: "none",
    color: "var(--text-2)",
    fontSize: 13,
    textAlign: "left",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default Navbar;
