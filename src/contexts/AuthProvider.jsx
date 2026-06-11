import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { AuthContext } from './authContext';
import { haySuperadminBackup, obtenerUsuarioImpersonado, eliminarUsuarioImpersonado, eliminarSuperadminBackup } from '../helpers/superadminSession';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleTransition, setRoleTransition] = useState(false);

  useEffect(() => {
    apiClient.get('/api/usuario/me', { _skipAuthRedirect: true })
      .then((res) => {
        const impersonado = obtenerUsuarioImpersonado();
        if (impersonado && haySuperadminBackup()) {
          setUsuario(impersonado);
        } else {
          setUsuario(res.data.usuario);
          if (!haySuperadminBackup()) {
            eliminarUsuarioImpersonado();
          }
        }
      })
      .catch(() => {
        setUsuario(null);
        eliminarUsuarioImpersonado();
        eliminarSuperadminBackup();
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading, setUsuario, roleTransition, setRoleTransition }}>
      {children}
    </AuthContext.Provider>
  );
}

