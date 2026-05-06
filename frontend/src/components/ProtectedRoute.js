import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={styles.loader}>
        <span style={styles.dot} />
        <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
        <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const styles = {
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: "40vh",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "inline-block",
    animation: "pulse-ring 1.2s ease-in-out infinite",
  },
};

export default ProtectedRoute;
