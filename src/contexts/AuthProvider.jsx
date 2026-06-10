import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/usuario/me', { _skipAuthRedirect: true })
      .then((res) => setUsuario(res.data.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

