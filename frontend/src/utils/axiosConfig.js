import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001', // Ensure baseURL is correct
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // Attach Authorization header
  }
  return req;
});

export default API;
