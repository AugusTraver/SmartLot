import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { setToken } from '../api/token';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('El email es requerido.'); return; }
    if (cooldown > 0) { setError(`Espere ${cooldown}s antes de reintentar.`); return; }

    setLoading(true);
    try {
      const res = await apiClient.post('/api/usuario/login', {
        email: email.trim(),
        contraseña: password,
      });
      setToken(res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      const msg = err.response?.data?.message || 'Error de conexión.';
      setError(msg);

      if (err.response?.status === 429) {
        const retryAfter = parseInt(err.response?.headers?.['retry-after'] || '900', 10);
        setCooldown(retryAfter);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar Sesión</h1>

      <input type="email" value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="Email" required />

      <input type="password" value={password}
             onChange={(e) => setPassword(e.target.value)}
             placeholder="Contraseña" required />

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading || cooldown > 0}>
        {cooldown > 0
          ? `Espere ${cooldown}s`
          : loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
