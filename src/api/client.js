import axios from 'axios';
import Swal from 'sweetalert2';

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
  });
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const status = data?.statusCode ?? error.response?.status ?? 0;
    const message = data?.message ?? 'Error de conexión con el servidor.';

    switch (status) {
      case 401:
        if (!error.config?._skipAuthRedirect) {
          window.location.href = '/login';
        }
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
