import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getMe } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("np_token") || null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem("np_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem("np_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    localStorage.setItem("np_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("np_token");
    setToken(null);
    setUser(null);
  };

  const updateBookmarks = (bookmarks) => {
    setUser((prev) => ({ ...prev, bookmarks }));
  };

  const isBookmarked = (storyId) => {
    return user?.bookmarks?.some((b) => b === storyId || b?._id === storyId) || false;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateBookmarks, isBookmarked }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
