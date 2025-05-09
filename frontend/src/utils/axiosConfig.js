import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // Updated baseURL to avoid doubling /api
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
