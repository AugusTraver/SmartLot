import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../api/token';
import { useAuth } from '../contexts/useAuth';

export default function Logout() {
  const { setUsuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearToken().then((data) => {
      if (data?.isReverted && data?.usuario) {
        setUsuario(data.usuario);
        navigate('/superadmin_dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [setUsuario, navigate]);

  return null;
}
