import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001', // Ensure this matches the backend port
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to update user profile
export const updateUserProfile = async (data) => {
  return await instance.put('/api/users/update', data);
};

export default instance;
