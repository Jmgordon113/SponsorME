import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001', // Ensure this matches the backend port
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Dynamically fetch token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach Bearer token
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Handle request errors
});

// Function to update user profile
export const updateUserProfile = async (data) => {
  return await instance.put('/api/users/update', data);
};

export default instance;
