// src/api/client.js
// Central axios instance for talking to the FastAPI backend.
// Every page imports this instead of using axios directly.
// Has two interceptors:
//   1. Request interceptor : attaches JWT token to every request
//   2. Response interceptor : redirects to login if token expires (401)

import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000",
});

// REQUEST INTERCEPTOR
// Runs before every request is sent.
// Automatically attaches the JWT token to the Authorization header.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  RESPONSE INTERCEPTOR
// Runs after every response is received.
// If the backend returns 401 (Unauthorized) : meaning the token
// is expired or invalid, we:
//   1. Remove the token from localStorage
//   2. Redirect the user to the login page automatically
client.interceptors.response.use(
  (response) => response,
  // first function = runs on successful response, just return it

  (error) => {
    // second function = runs on error response
    if (error.response?.status === 401) {
      // token is expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
    // reject the error so individual pages can still catch it
  },
);

export default client;
