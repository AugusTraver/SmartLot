import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { getToken, clearToken } from '../api/token';
import { AuthContext } from './authContext';

const TOKEN_EXISTS = !!getToken();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(TOKEN_EXISTS);

  useEffect(() => {
    if (!TOKEN_EXISTS) return;

    apiClient.get('/api/usuario/me')
      .then((res) => setUsuario(res.data.usuario))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}
