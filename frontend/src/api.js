import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
    'Content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default api;
