import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- Auth ----
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ---- Products ----
export const productService = {
  getAll: () => api.get('/products'),
  getFeatured: () => api.get('/products/featured'),
  add: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/admin/products/${id}`),
};

// ---- Cart ----
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCart: (id, quantity) => api.put(`/cart/${id}?quantity=${quantity}`),
  deleteItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

// ---- Orders ----
export const orderService = {
  getMyOrders: () => api.get('/orders'),
  placeOrder: (data) => api.post('/orders', data),
  getAllOrders: () => api.get('/admin/orders'),
  updateStatus: (id, status) => api.put(`/admin/orders/${id}/status?status=${status}`),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
};

// ---- Messages ----
export const messageService = {
  send: (data) => api.post('/messages', data),
  getAll: () => api.get('/admin/messages'),
  delete: (id) => api.delete(`/admin/messages/${id}`),
};
