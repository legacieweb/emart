import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (credentials) => api.post('/auth/admin-login', credentials),
  getProfile: () => api.get('/auth/profile')
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/add', data),
  updateItem: (data) => api.put('/cart/update', data),
  removeItem: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear')
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  checkout: (data) => api.post('/orders/checkout', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllOrders: () => api.get('/admin/orders'),
  getAllProducts: () => api.get('/admin/products'),
  getAllUsers: () => api.get('/admin/users'),
  updateOrderStatus: (id, data) => api.put(`/admin/order/${id}/status`, data)
};

export default api;
