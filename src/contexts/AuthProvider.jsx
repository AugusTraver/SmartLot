import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { AuthContext } from './authContext';
import { haySuperadminBackup, obtenerUsuarioImpersonado, eliminarUsuarioImpersonado, eliminarSuperadminBackup } from '../helpers/superadminSession';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleTransition, setRoleTransition] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    apiClient.get('/api/usuario/me', { _skipAuthRedirect: true, signal: controller.signal })
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
      .finally(() => { clearTimeout(timeout); setLoading(false); });

    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading, setUsuario, roleTransition, setRoleTransition }}>
      {children}
    </AuthContext.Provider>
  );
}

