import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const Login = async (userData) => {
  const response = await api.post('/login', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/get-me');
  return response.data;
};

export const Logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

