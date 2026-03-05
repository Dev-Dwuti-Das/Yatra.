import axiosClient from './axiosClient';

export async function register(payload) {
  const { data } = await axiosClient.post('/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await axiosClient.post('/auth/login', payload);
  return data;
}
