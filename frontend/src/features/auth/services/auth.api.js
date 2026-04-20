import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const Login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/get-me');
  return response.data;
};
