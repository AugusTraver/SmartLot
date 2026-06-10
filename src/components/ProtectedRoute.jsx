import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../helpers/toast';

export default function ProtectedRoute({ allowedRoles, children, usuario }) {
  const navigate = useNavigate();
  const toastShown = useRef(false);
  const userRole = Number(usuario?.id_rol);

  useEffect(() => {
    if (!usuario) {
      navigate('/login', { replace: true });
      return;
    }
    if (!allowedRoles.includes(userRole) && userRole !== 4) {
      if (!toastShown.current) {
        showToast('No tenés permisos para acceder a esta URL con tu rol.', 'warning');
        toastShown.current = true;
      }
      const rutas = {
        1: '/admin_dashboard',
        2: '/empleados_dashboard',
        3: '/garagista_dashboard',
        4: '/superadmin_dashboard',
      };
      const ruta = rutas[userRole] || '/';
      navigate(ruta, { replace: true });
    }
  }, [usuario, allowedRoles, navigate, userRole]);

  if (!usuario) return null;
  if (!allowedRoles.includes(userRole) && userRole !== 4) return null;
  return children;
}
