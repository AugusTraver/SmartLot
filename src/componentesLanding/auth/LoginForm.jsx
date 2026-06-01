import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { UsuariosLogin } from '../../servicies/API_Usuario';

gsap.registerPlugin(useGSAP);

export default function LoginForm() {
  const pathRef = useRef();
  const buttonRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useGSAP(() => {
    gsap.to(pathRef.current, {
      strokeDashoffset: -150,
      duration: 4.5,
      ease: "none",
      repeat: -1,
    });
  }, { scope: buttonRef });

  return (
    <div className="w-full max-w-sm">
      <h1 className="auth-stagger text-3xl md:text-4xl font-extrabold text-brand-warm mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        Iniciar Sesión
      </h1>
      <p className="auth-stagger text-brand-muted text-sm md:text-base mb-8 leading-relaxed">
        Ingresá a tu panel de gestión
      </p>

      <form className="flex flex-col gap-5" onSubmit={async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
          const res = await UsuariosLogin(email, password);
          if (res.respuesta && res.datos) {
            const datos = res.datos;
            const usuario = datos.usuario;
            if (usuario) localStorage.setItem('usuario', JSON.stringify(usuario));
            if (datos.token) localStorage.setItem('token', datos.token);
            const rutas = {
              1: '/admin_dashboard',
              2: '/empleados_dashboard',
              3: '/garagista_dashboard',
            };
            const ruta = rutas[Number(usuario?.id_rol)] || '/';
            window.location.href = ruta;
          } else {
            setError('Credenciales incorrectas.');
          }
        } catch (err) {
          console.error(err);
          setError('Error al conectarse al servidor.');
        } finally {
          setLoading(false);
        }
      }}>
        <div className="auth-stagger relative">
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer w-full px-5 pt-6 pb-2.5 bg-brand-surface/70 border border-brand-deep/10 rounded-xl text-brand-warm text-base outline-none transition-all duration-300 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
          <label
            htmlFor="email"
            className="absolute left-5 top-4 text-brand-muted text-base pointer-events-none transition-all duration-300 ease-out
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-muted
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-blue
              peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-brand-muted"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Correo electrónico
          </label>
        </div>

        <div className="auth-stagger relative">
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="peer w-full px-5 pt-6 pb-2.5 bg-brand-surface/70 border border-brand-deep/10 rounded-xl text-brand-warm text-base outline-none transition-all duration-300 ease-out focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
          />
          <label
            htmlFor="password"
            className="absolute left-5 top-4 text-brand-muted text-base pointer-events-none transition-all duration-300 ease-out
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-muted
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-blue
              peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-brand-muted"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Contraseña
          </label>
        </div>

        <button
          ref={buttonRef}
          type="submit"
          className="auth-stagger group relative w-full mt-2 rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <rect
              fill="none"
              stroke="url(#btn-beam-glow)"
              strokeWidth="12"
              rx="5"
              strokeDasharray="30 120"
              strokeDashoffset="150"
              opacity="0.6"
            />
            <rect
              ref={pathRef}
              x="0" y="0" width="100" height="100"
              rx="5"
              fill="none"
              stroke="url(#btn-beam)"
              strokeWidth="3"
              strokeDasharray="30 120"
              strokeDashoffset="150"
            />
            <defs>
              <linearGradient id="btn-beam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A5CBF" stopOpacity="0" />
                <stop offset="20%" stopColor="#2A5CBF" stopOpacity="0.3" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="50%" stopColor="#6BA3E8" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="80%" stopColor="#2A5CBF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0C1E3F" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="btn-beam-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A5CBF" stopOpacity="0" />
                <stop offset="25%" stopColor="#2A5CBF" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6BA3E8" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#2A5CBF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0C1E3F" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative m-[2px] rounded-[10px] bg-brand-blue px-8 py-4 text-white font-bold text-lg shadow-lg shadow-brand-blue/20 transition-all duration-300 group-hover:bg-brand-deep group-hover:shadow-brand-deep/25 group-active:scale-[0.97]">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </div>
        </button>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
