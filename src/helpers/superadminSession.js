const COOKIE_NAME = 'smartlot_superadmin_backup';
const LS_IMPERSONATED = 'smartlot_usuario_impersonado';

export function guardarSuperadminBackup(usuario) {
  if (!usuario) return;
  const data = JSON.stringify({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    id_rol: usuario.id_rol,
  });
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(data)}; path=/; max-age=86400; SameSite=Lax`;
}

export function obtenerSuperadminBackup() {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === COOKIE_NAME && value) {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function eliminarSuperadminBackup() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function haySuperadminBackup() {
  const cookies = document.cookie.split('; ');
  return cookies.some((c) => c.split('=')[0] === COOKIE_NAME);
}

export function guardarUsuarioImpersonado(usuario) {
  if (!usuario) return;
  localStorage.setItem(LS_IMPERSONATED, JSON.stringify({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    id_rol: usuario.id_rol,
  }));
}

export function obtenerUsuarioImpersonado() {
  try {
    const raw = localStorage.getItem(LS_IMPERSONATED);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function eliminarUsuarioImpersonado() {
  localStorage.removeItem(LS_IMPERSONATED);
}
