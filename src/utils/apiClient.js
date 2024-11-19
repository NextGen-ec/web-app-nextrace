import axios from 'axios';
const { VITE_API_BASE_URL } = import.meta.env

export const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});
