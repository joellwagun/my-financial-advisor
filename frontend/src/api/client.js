// src/api/client.js
// Central axios instance for talking to the FastAPI backend.
// Every page imports this instead of using axios directly.

import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000",
});

// This runs before EVERY request made with "client".
// It automatically attaches the JWT token (if we have one) to the
// Authorization header, so we don't have to do it manually on every page.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
