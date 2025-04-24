import axios from 'axios';

// Create instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, // Make sure this is defined in your .env file
});

// Add auth token to all requests (if exists)
api.interceptors.request.use(
  (config) => {
    const profile = localStorage.getItem('profile');

    if (profile) {
      const { token } = JSON.parse(profile);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Optionally show error messages, redirect, etc.
    return Promise.reject(error);
  }
);

export default api;
