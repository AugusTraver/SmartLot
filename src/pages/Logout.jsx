import { useEffect } from 'react';
import { clearToken } from '../api/token';

export default function Logout() {
  useEffect(() => {
    clearToken();
    window.location.href = '/login';
  }, []);

  return null;
}
