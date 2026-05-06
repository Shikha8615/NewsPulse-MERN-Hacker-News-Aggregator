import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("np_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Stories
export const fetchStories = (page = 1, limit = 10) =>
  API.get(`/stories?page=${page}&limit=${limit}`);
export const fetchStoryById = (id) => API.get(`/stories/${id}`);
export const toggleBookmark = (id) => API.post(`/stories/${id}/bookmark`);

// Scraper
export const triggerScrape = () => API.post("/scrape");

export default API;
