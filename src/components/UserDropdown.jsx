import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Swal from 'sweetalert2';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import apiClient from '../api/client';

const ROLE_LABELS = {
  1: 'Admin',
  2: 'Empleado',
  3: 'Garagista',
};

const AVATAR_GRADIENTS = [
  'from-brand-blue to-brand-sky',
  'from-brand-deep to-brand-blue',
  'from-brand-navy to-brand-sky',
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function getAvatarGradient(name) {
  if (!name) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[Math.abs(hashString(name)) % AVATAR_GRADIENTS.length];
}

function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

export default function UserDropdown() {
  const { usuario, setUsuario } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const fullName = usuario
    ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
    : 'Usuario';
  const roleLabel = ROLE_LABELS[usuario?.id_rol] || 'Usuario';
  const initial = getInitial(usuario?.nombre);
  const gradient = getAvatarGradient(usuario?.nombre);

  useGSAP(() => {
    if (!panelRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.95, y: -8, transformOrigin: 'top right' },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.25,
          ease: 'power3.out',
        }
      );

      const items = panelRef.current.querySelectorAll('.dropdown-item');
      if (items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.04, ease: 'power2.out' }
        );
      }
    }
  }, { dependencies: [isOpen], revertOnUpdate: true, scope: containerRef });

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = useCallback(async () => {
    setIsOpen(false);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Cerrando sesión de forma segura...',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    try {
      await apiClient.post('/api/usuario/logout');
    } catch {
      // Emergency exit: clear local state regardless
    }

    setUsuario(null);
    navigate('/login', { replace: true });
  }, [navigate, setUsuario]);

  return (
    <div className="relative" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="flex items-center gap-2.5 p-1.5 rounded-xl transition-colors duration-200 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Menú de usuario: ${fullName}`}
      >
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-display font-semibold shadow-sm`}
        >
          {initial}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-brand-warm leading-tight">
            {fullName}
          </p>
          <p className="text-xs text-brand-muted leading-tight">{roleLabel}</p>
        </div>
        <ChevronDown
          size={16}
          className={`hidden md:block text-brand-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-[1100]"
          style={{
            background: 'rgba(253, 252, 249, 0.75)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
            border: '1px solid rgba(12, 30, 63, 0.08)',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="md:hidden px-4 pt-4 pb-3">
            <p className="text-sm font-medium text-brand-warm">{fullName}</p>
            <p className="text-xs text-brand-muted">{usuario?.email || ''}</p>
            <p className="text-xs text-brand-muted mt-0.5">{roleLabel}</p>
          </div>
          <div className="md:hidden h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-3" />

          <div className="py-2">
            <button
              role="menuitem"
              className="dropdown-item flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-warm hover:bg-black/5 transition-colors duration-150 text-left"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="text-brand-muted shrink-0" />
              <span>Perfil</span>
            </button>
            <button
              role="menuitem"
              className="dropdown-item flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-warm hover:bg-black/5 transition-colors duration-150 text-left"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="text-brand-muted shrink-0" />
              <span>Configuración</span>
            </button>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent mx-3" />

          <div className="py-2">
            <button
              role="menuitem"
              className="dropdown-item flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-150 text-left font-medium"
              onClick={handleLogout}
            >
              <LogOut size={16} className="shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
