import { useEffect } from 'react';
import { clearToken } from '../api/token';

export default function Logout() {
  useEffect(() => {
    clearToken();
  }, []);

  return null;
}
