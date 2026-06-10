import apiClient from './client';

export async function clearToken() {
  try {
    const res = await apiClient.post('/api/usuario/logout');
    return res.data;
  } catch {
    return null;
  }
}
