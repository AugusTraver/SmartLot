const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ;
const JWT_EXPIRES_IN = import.meta.env.VITE_JWT_EXPIRES_IN || '2h';

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getTokenExpiryInfo() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      exp: payload.exp,
      expiresIn: JWT_EXPIRES_IN,
      remainingMs: payload.exp * 1000 - Date.now(),
    };
  } catch {
    return null;
  }
}
