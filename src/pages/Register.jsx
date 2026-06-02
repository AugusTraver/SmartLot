import { useState } from 'react';
import apiClient from '../api/client';
import PasswordStrength from '../components/PasswordStrength';
import { validatePassword } from '../validators/password';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '',
    contraseña: '', id_rol: 2, id_sede: '', id_empresa: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
    if (!form.apellido.trim()) newErrors.apellido = 'El apellido es requerido.';
    if (!form.email.trim()) newErrors.email = 'El email es requerido.';

    const pwError = validatePassword(form.contraseña);
    if (pwError) newErrors.contraseña = pwError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await apiClient.post('/api/usuario', form);
      window.location.href = '/login?registro=exitoso';
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error al registrar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registro</h1>

      <input name="nombre" placeholder="Nombre" value={form.nombre}
             onChange={handleChange} />
      {errors.nombre && <span className="field-error">{errors.nombre}</span>}

      <input name="apellido" placeholder="Apellido" value={form.apellido}
             onChange={handleChange} />
      {errors.apellido && <span className="field-error">{errors.apellido}</span>}

      <input name="email" type="email" placeholder="Email" value={form.email}
             onChange={handleChange} />
      {errors.email && <span className="field-error">{errors.email}</span>}

      <input name="contraseña" type="password" placeholder="Contraseña"
             value={form.contraseña} onChange={handleChange} />
      <PasswordStrength password={form.contraseña} />
      {errors.contraseña && <span className="field-error">{errors.contraseña}</span>}

      {serverError && <div className="error">{serverError}</div>}

      <button type="submit">Crear Cuenta</button>
    </form>
  );
}
