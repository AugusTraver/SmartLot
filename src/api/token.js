import apiClient from './client';
import { navigateTo } from './navigation';

export async function clearToken() {
  try {
    await apiClient.post('/api/usuario/logout');
  } catch {
    // backend clears the cookie either way
  }
  navigateTo('/login');
}
