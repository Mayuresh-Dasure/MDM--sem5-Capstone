import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: Attach JWT token & demo scenario header if active
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('suntrack_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const demoScenario = localStorage.getItem('suntrack_demo_scenario');
  if (demoScenario && config.headers) {
    config.headers['X-Demo-Scenario'] = demoScenario;
  }

  return config;
});

// Response interceptor: Handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('suntrack_token');
        localStorage.removeItem('suntrack_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);
