import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookmarks from "./pages/Bookmarks";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--bg-2)",
              color: "var(--text-1)",
              border: "1px solid var(--border)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
            },
            success: { iconTheme: { primary: "var(--green)", secondary: "var(--bg-2)" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "var(--bg-2)" } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
