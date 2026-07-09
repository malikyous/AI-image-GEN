import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-image-gen-523n.vercel.app/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const imageAPI = {
  generate: (prompt) => api.post('/images/generate', { prompt }),
  getHistory: (page = 1) => api.get(`/images/history?page=${page}`),
  deleteImage: (id) => api.delete(`/images/history/${id}`),
};

export default api;
