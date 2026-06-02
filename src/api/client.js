import axios from 'axios';
import Swal from 'sweetalert2';
import { getToken, clearToken, isTokenExpired } from './token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  });
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token && isTokenExpired(token)) {
    clearToken();
    window.location.href = '/login';
    return Promise.reject(new Error('Token expirado'));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const status = data?.statusCode ?? error.response?.status ?? 0;
    const message = data?.message ?? 'Error de conexión con el servidor.';

    switch (status) {
      case 401:
        clearToken();
        window.location.href = '/login';
        break;
      case 403:
        showToast(message, 'warning');
        break;
      case 429:
        showToast(message, 'warning');
        break;
      case 413:
        showToast('El archivo o datos enviados son demasiado grandes.', 'error');
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
