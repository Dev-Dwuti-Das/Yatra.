import axios from 'axios';
import { getToken } from '../utils/token';

const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (isLocalHost
    ? 'http://localhost:4000/api/v1'
    : 'https://5ben64rbp4.execute-api.ap-south-1.amazonaws.com/api/v1')
).replace(/\/+$/, '');

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
