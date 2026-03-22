import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Tasks ──────────────────────────────────────────
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`),
};

// ── Habits ─────────────────────────────────────────
export const habitAPI = {
  getAll: () => api.get('/habits'),
  getOne: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  complete: (id) => api.patch(`/habits/${id}/complete`),
};

// ── Focus ──────────────────────────────────────────
export const focusAPI = {
  getSessions: () => api.get('/focus'),
  getStats: () => api.get('/focus/stats'),
  saveSession: (data) => api.post('/focus', data),
  deleteSession: (id) => api.delete(`/focus/${id}`),
};

// ── Goals ──────────────────────────────────────────
export const goalAPI = {
  getAll: () => api.get('/goals'),
  getOne: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// ── Notes ──────────────────────────────────────────
export const noteAPI = {
  getAll: (params) => api.get('/notes', { params }),
  getOne: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// ── Dashboard ──────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;
