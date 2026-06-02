export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Debe contener al menos una mayúscula.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Debe contener al menos una minúscula.';
  }
  if (!/\d/.test(password)) {
    return 'Debe contener al menos un número.';
  }
  return null;
}
