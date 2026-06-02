import apiClient from './client';

export async function clearToken() {
  try {
    await apiClient.post('/api/usuario/logout');
  } catch {
    // backend clears the cookie either way
  }
  window.location.href = '/login';
}
