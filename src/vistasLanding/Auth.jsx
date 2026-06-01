import { useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LoginForm from '../componentesLanding/auth/LoginForm';
import RegisterForm from '../componentesLanding/auth/RegisterForm';
import BrandPanel from '../componentesLanding/auth/BrandPanel';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  const container = useRef(null);
  const panelRef = useRef(null);

  // Separate refs for desktop and mobile to avoid React overwriting one with the other
  const desktopLogin = useRef(null);
  const desktopRegister = useRef(null);
  const mobileLogin = useRef(null);
  const mobileRegister = useRef(null);

  const firstRender = useRef(true);
  const prevIsLogin = useRef(isLogin);

  const onToggle = useCallback(() => {
    navigate(isLogin ? '/register' : '/login', { replace: true });
  }, [isLogin, navigate]);

  // Helpers to pick the right refs for the current viewport
  const pick = () => {
    const isD = window.innerWidth >= 768;
    return {
      login: isD ? desktopLogin.current : mobileLogin.current,
      register: isD ? desktopRegister.current : mobileRegister.current,
    };
  };

  // ─── GSAP animations ──────────────────────────────────────────────
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const isInitial = firstRender.current;
    firstRender.current = false;

    const prevX = prevIsLogin.current ? 100 : 0;
    const nextX = isLogin ? 100 : 0;
    prevIsLogin.current = isLogin;

    // ── Desktop: split-screen with sliding panel ──
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const { login: loginEl, register: registerEl } = pick();

      if (isInitial) {
        gsap.set(panelRef.current, { xPercent: nextX });
        gsap.set(loginEl, { opacity: isLogin ? 1 : 0, y: 0, scale: 1, pointerEvents: isLogin ? 'auto' : 'none' });
        gsap.set(registerEl, { opacity: isLogin ? 0 : 1, y: 0, scale: 1, pointerEvents: isLogin ? 'none' : 'auto' });
        const activeForm = isLogin ? loginEl : registerEl;
        gsap.fromTo(
          activeForm.querySelectorAll('.auth-stagger'),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power2.out", delay: 0.2 }
        );
        return;
      }

      gsap.set(panelRef.current, { xPercent: prevX });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      tl.to(panelRef.current, { xPercent: nextX, duration: 1.1 }, 0);

      if (isLogin) {
        tl.to(registerEl, { opacity: 0, y: 14, scale: 0.97, duration: 0.55, ease: "sine.in" }, 0);
        tl.to(loginEl, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 0.85, ease: "sine.out" }, 0.25);
        tl.fromTo(
          loginEl.querySelectorAll('.auth-stagger'),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power1.out" },
          0.4
        );
      } else {
        tl.to(loginEl, { opacity: 0, y: 14, scale: 0.97, duration: 0.55, ease: "sine.in" }, 0);
        tl.to(registerEl, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 0.85, ease: "sine.out" }, 0.25);
        tl.fromTo(
          registerEl.querySelectorAll('.auth-stagger'),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power1.out" },
          0.4
        );
      }
    });

    // ── Mobile: crossfade (no panel slide) ──
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const { login: loginEl, register: registerEl } = pick();

      if (isInitial) {
        gsap.set(loginEl, { opacity: isLogin ? 1 : 0, display: isLogin ? 'flex' : 'none', y: 0, scale: 1 });
        gsap.set(registerEl, { opacity: isLogin ? 0 : 1, display: isLogin ? 'none' : 'flex', y: 0, scale: 1 });
        const activeForm = isLogin ? loginEl : registerEl;
        gsap.fromTo(
          activeForm.querySelectorAll('.auth-stagger'),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out", delay: 0.15 }
        );
        return;
      }

      if (isLogin) {
        gsap.to(registerEl, { opacity: 0, scale: 0.97, display: 'none', y: 14, duration: 0.4, ease: "sine.in" });
        gsap.to(loginEl, { opacity: 1, scale: 1, display: 'flex', y: 0, duration: 0.65, ease: "sine.out", delay: 0.2 });
        gsap.fromTo(
          loginEl.querySelectorAll('.auth-stagger'),
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power1.out", delay: 0.35 }
        );
      } else {
        gsap.to(loginEl, { opacity: 0, scale: 0.97, display: 'none', y: 14, duration: 0.4, ease: "sine.in" });
        gsap.to(registerEl, { opacity: 1, scale: 1, display: 'flex', y: 0, duration: 0.65, ease: "sine.out", delay: 0.2 });
        gsap.fromTo(
          registerEl.querySelectorAll('.auth-stagger'),
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power1.out", delay: 0.35 }
        );
      }
    });

    // ── Reduced motion ──
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const { login: loginEl, register: registerEl } = pick();
      gsap.set(panelRef.current, { xPercent: nextX });
      gsap.set(loginEl, { opacity: isLogin ? 1 : 0, y: 0, scale: 1, pointerEvents: isLogin ? 'auto' : 'none' });
      gsap.set(registerEl, { opacity: isLogin ? 0 : 1, y: 0, scale: 1, pointerEvents: isLogin ? 'none' : 'auto' });
      gsap.set('.auth-stagger', { opacity: 1, y: 0 });
    });

    return () => mm.kill();
  }, { scope: container, dependencies: [isLogin] });

  return (
    <div ref={container} className="min-h-screen bg-brand-bg relative overflow-hidden">
      {/* Global noise texture overlay (matches site aesthetic) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px'
      }} />

      {/* ─── DESKTOP LAYOUT (>= md) ─── */}
      <div className="hidden md:flex w-full h-screen relative overflow-hidden">
        {/* Soft background glow on form side */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-deep rounded-full blur-[120px] opacity-[0.04] pointer-events-none z-0" />

        {/* Forms row – full width, side by side */}
        <div className="w-full h-full flex">
          {/* Login form – left half */}
          <div
            ref={desktopLogin}
            className="w-1/2 h-full flex items-center justify-center p-8 xl:p-16 relative z-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <LoginForm onToggle={onToggle} />
          </div>

          {/* Register form – right half */}
          <div
            ref={desktopRegister}
            className="w-1/2 h-full flex items-center justify-center p-8 xl:p-16 relative z-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <RegisterForm onToggle={onToggle} />
          </div>
        </div>

        {/* Sliding brand panel – absolutely positioned, 50% width, slides using xPercent */}
        <div
          ref={panelRef}
          className="absolute top-0 left-0 w-1/2 h-full z-20 flex items-center justify-center bg-brand-deep"
          style={{ willChange: 'transform' }}
        >
          <BrandPanel isLogin={isLogin} onToggle={onToggle} />
        </div>
      </div>

      {/* ─── MOBILE LAYOUT (< md) ─── */}
      <div className="md:hidden min-h-screen flex flex-col bg-brand-bg">
        {/* Compact brand bar */}
        <div className="bg-brand-deep px-6 py-5 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-sky/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Link to="/" className="transition-opacity duration-300 hover:opacity-80 flex-shrink-0">
              <img
                src="/logo.png"
                alt="SmartLot"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <span className="text-xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              SmartLot
            </span>
          </div>
        </div>

        {/* Mobile forms area – stacking with crossfade */}
        <div className="flex-1 relative px-6 py-8">
          <div
            ref={mobileLogin}
            className="absolute inset-0 px-6 py-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <LoginForm onToggle={onToggle} />
          </div>
          <div
            ref={mobileRegister}
            className="absolute inset-0 px-6 py-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <RegisterForm onToggle={onToggle} />
          </div>
        </div>
      </div>
    </div>
  );
}
