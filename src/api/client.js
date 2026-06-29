import axios from 'axios';
import Swal from 'sweetalert2';
import { Z_INDEX } from '../helpers/zIndex';
import { mensajeToast } from '../helpers/erroresMensajes';
import { navigateTo } from './navigation';
import { clearCache, invalidateByPrefix } from '../cache/cacheStore';

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
    title: mensajeToast(message),
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

function shouldClearCacheForAuthUrl(url = '') {
  return url.includes('/api/usuario/login')
    || url.includes('/api/usuario/logout')
    || url.includes('/api/usuario/impersonate');
}

function invalidateCacheForMutation(config = {}) {
  const method = config.method?.toLowerCase();
  const url = config.url || '';

  if (!['post', 'put', 'patch', 'delete'].includes(method)) {
    return;
  }

  if (url.includes('/api/usuario/refresh')) {
    return;
  }

  if (url.includes('/api/usuario')) {
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
    invalidateByPrefix('vehiculos:');
  }

  if (url.includes('/api/empresa')) {
    invalidateByPrefix('empresas:');
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('sedes:');
    invalidateByPrefix('garages:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
  }

  if (url.includes('/api/sede')) {
    invalidateByPrefix('sedes:');
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('garages:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
  }

  if (url.includes('/api/garage')) {
    invalidateByPrefix('garages:');
    invalidateByPrefix('usuarios:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('conflictos:');
    invalidateByPrefix('reservas:disponibilidad:');
  }

  if (url.includes('/api/reserva')) {
    invalidateByPrefix('reservas:');
    invalidateByPrefix('garages:');
    invalidateByPrefix('garages:ocupacion-');
    invalidateByPrefix('conflictos:');
    invalidateByPrefix('reservas:disponibilidad:');
  }

  if (url.includes('/api/conflicto')) {
    invalidateByPrefix('conflictos:');
    invalidateByPrefix('reservas:');
    invalidateByPrefix('garages:');
    invalidateByPrefix('garages:ocupacion-');
    invalidateByPrefix('reservas:disponibilidad:');
  }

  if (url.includes('/api/vehiculo')) {
    invalidateByPrefix('vehiculos:');
    invalidateByPrefix('reservas:');
  }

  if (url.includes('/api/marca')) {
    invalidateByPrefix('marcas:');
    invalidateByPrefix('modelos:');
    invalidateByPrefix('vehiculos:');
  }

  if (url.includes('/api/modelo')) {
    invalidateByPrefix('modelos:');
    invalidateByPrefix('vehiculos:');
  }

  if (url.includes('/api/rol')) {
    invalidateByPrefix('roles:');
    invalidateByPrefix('usuarios:');
  }
}

apiClient.interceptors.response.use(
  (response) => {
    if (shouldClearCacheForAuthUrl(response.config?.url)) {
      clearCache();
    }

    invalidateCacheForMutation(response.config);

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const data = error.response?.data;
    const status = data?.statusCode ?? error.response?.status ?? 0;
    const message = data?.message ?? 'Error de conexión con el servidor.';

    if (originalRequest._skipToast) {
      return Promise.reject(error);
    }

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
          clearCache();
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
          clearCache();
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
