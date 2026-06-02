import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, children, usuario }) {
  if (!usuario) return <Navigate to="/login" />;
  if (!allowedRoles.includes(usuario.id_rol)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}
