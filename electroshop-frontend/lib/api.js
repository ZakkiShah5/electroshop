import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401: clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ─── Products ────────────────────────────────────────────────────────────────
export const productAPI = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProduct: (id) => api.get(`/api/products/${id}`),
  createProduct: (data) => api.post('/api/products', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userAPI = {
  login: (email, password) => api.post('/api/users/login', { email, password }),
  register: (name, email, password) => api.post('/api/users/register', { name, email, password }),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getAllUsers: () => api.get('/api/users'),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderAPI = {
  createOrder: (data) => api.post('/api/orders', data),
  getMyOrders: () => api.get('/api/orders/mine'),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  payOrder: (id, paymentResult) => api.put(`/api/orders/${id}/pay`, paymentResult),
  getAllOrders: () => api.get('/api/orders'),
  deliverOrder: (id) => api.put(`/api/orders/${id}/deliver`),
};

// ─── Payments ────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createPaymentIntent: (amount) => api.post('/api/payments/create-intent', { amount }),
};

export default api;
