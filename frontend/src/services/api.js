import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request Interceptor: Attach token
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't trigger a hard redirect if the user is just typing bad credentials on the login page!
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      
      if (!isAuthRoute) {
        // Clear local storage and redirect to login for expired/invalid tokens
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getMyEvents: () => api.get('/events/my'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`)
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getForEvent: (eventId) => api.get(`/bookings/event/${eventId}`),
  getMyBookings: () => api.get('/bookings/my')
};

export const paymentService = {
  mockPayment: (data) => api.post('/payments/mock', data)
};

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getSalesTrend: () => api.get('/analytics/sales-trend'),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
  getTopEvents: () => api.get('/analytics/top-events'),
  getEventAnalytics: (eventId) => api.get(`/analytics/event/${eventId}`)
};

export default api;
