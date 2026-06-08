import axios from 'axios';
import Swal from 'sweetalert2';
import { Z_INDEX } from '../helpers/zIndex';
import { navigateTo } from './navigation';

const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

if (import.meta.env.PROD) {
  if (!API_BASE_URL.startsWith('https://')) {
    console.error('VITE_API_URL debe usar HTTPS en producción');
  }
}

function showToast(message, icon = 'error') {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    zIndex: Z_INDEX.SWAL_TOAST,
  });
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const data = error.response?.data;
    const status = data?.statusCode ?? error.response?.status ?? 0;
    const message = data?.message ?? 'Error de conexión con el servidor.';

    // 401 → intentar refresh automático (excepto refresh y auth endpoints)
    if (status === 401 && !originalRequest._isRetry && !originalRequest.url?.includes('/refresh') && !originalRequest.url?.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/api/usuario/refresh', {}, { _skipAuthRedirect: true, _isRetry: true });
        processQueue(null);
        return apiClient(originalRequest);
      } catch {
        processQueue(error);
        if (!originalRequest._skipAuthRedirect) {
          navigateTo('/login');
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    switch (status) {
      case 401:
        if (!originalRequest._skipAuthRedirect) {
          navigateTo('/login');
        }
        break;
      case 403:
        showToast(message, 'warning');
        break;
      case 429:
        showToast(message, 'warning');
        break;
      case 413:
        showToast('El archivo o datos enviados son demasiados grandes.', 'error');
        break;
      case 500:
        showToast('Error interno del servidor. Intente nuevamente.', 'error');
        break;
      default:
        showToast(message, 'error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
