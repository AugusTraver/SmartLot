import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LoginForm from '../componentesLanding/auth/LoginForm';
import BrandPanel from '../componentesLanding/auth/BrandPanel';

export default function Auth() {
  const container = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        container.current.querySelectorAll('.auth-stagger'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power2.out", delay: 0.2 }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set('.auth-stagger', { opacity: 1, y: 0 });
    });

    return () => mm.kill();
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-brand-bg relative overflow-hidden">
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px'
      }} />

      {/* Soft background glow on form side */}
      <div className="hidden md:block absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-deep rounded-full blur-[120px] opacity-[0.04] pointer-events-none z-0" />

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden md:flex w-full h-screen relative overflow-hidden">
        {/* Login form — left half */}
        <div className="w-1/2 h-full flex items-center justify-center p-8 xl:p-16 relative z-10">
          <LoginForm />
        </div>

        {/* Brand panel — right half, static */}
        <div className="w-1/2 h-full relative z-10">
          <BrandPanel />
        </div>
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="md:hidden min-h-screen flex flex-col bg-brand-bg">
        {/* Brand bar */}
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

        {/* Login form */}
        <div className="flex-1 px-6 py-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
