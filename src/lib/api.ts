import axios from 'axios';
import { getToken } from './auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Token dibaca setiap request supaya tetap update setelah login/logout.
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (Array.isArray(data?.errors)) {
      return data.errors.join(', ');
    }

    if (data?.message) {
      return data.message;
    }
  }

  return 'Terjadi kesalahan. Coba lagi sebentar.';
}
