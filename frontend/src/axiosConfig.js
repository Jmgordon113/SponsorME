import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001', // Ensure this matches the backend port
});

instance.interceptors.request.use((config) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODA4YmE5MGZjZjJiYmM0MjkwNGE2YzQiLCJyb2xlIjoic3BvbnNvciIsImlhdCI6MTc0NTQwMjgwNCwiZXhwIjoxNzQ1NDA2NDA0fQ.EOx5_7S9j8qQvZzWrL3CJ3WhgeWYWbIn8sOS2l7Gtws'; // Use the provided token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;