import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>News<span style={styles.accent}>Pulse</span></span>
        </div>

        <h1 style={styles.heading}>Sign in</h1>
        <p style={styles.sub}>Welcome back — your bookmarks await</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              "Sign in →"
            )}
          </button>
        </form>

        <p style={styles.footer}>
          No account?{" "}
          <Link to="/register" style={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "40px 36px",
    animation: "fadeUp 0.4s ease forwards",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 16,
    color: "var(--text-1)",
  },
  logoIcon: { color: "var(--accent)", fontSize: 18 },
  logoText: {},
  accent: { color: "var(--accent)" },
  heading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "var(--text-1)",
    marginBottom: 6,
    letterSpacing: "-0.5px",
  },
  sub: { fontSize: 13, color: "var(--text-3)", marginBottom: 28 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "var(--text-2)", fontWeight: 500, letterSpacing: "0.05em" },
  input: {
    background: "var(--bg-3)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    color: "var(--text-1)",
    fontSize: 14,
    fontFamily: "'DM Mono', monospace",
    transition: "border-color 0.2s",
    outline: "none",
  },
  inputError: { borderColor: "#ef4444" },
  errorMsg: { fontSize: 11, color: "#ef4444" },
  submitBtn: {
    marginTop: 8,
    padding: "12px 24px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "opacity 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 44,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "block",
  },
  footer: { marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-3)" },
  footerLink: { color: "var(--accent)", fontWeight: 600 },
};

export default Login;
