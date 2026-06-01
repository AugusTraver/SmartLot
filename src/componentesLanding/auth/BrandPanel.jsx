import { Link } from 'react-router-dom';

export default function BrandPanel() {
  return (
    <div className="relative flex flex-col items-center text-center px-8 md:px-16 w-full h-full justify-center bg-brand-deep">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-sky/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="none">
          <defs>
            <pattern id="panel-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#panel-grid)" />
        </svg>
      </div>

      <Link to="/" className="mb-8 relative z-10 transition-opacity duration-300 hover:opacity-80">
        <img
          src="/logo.png"
          alt="SmartLot"
          className="h-14 md:h-16 w-auto brightness-0 invert drop-shadow-lg"
        />
      </Link>

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 relative z-10 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        SmartLot
      </h2>

      <p className="text-white/60 text-base md:text-lg max-w-xs leading-relaxed relative z-10">
        Gestioná tu estacionamiento con inteligencia artificial desde un solo panel.
      </p>
    </div>
  );
}
