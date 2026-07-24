import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ParkingStructureScene from './ParkingStructureScene';

gsap.registerPlugin(ScrollTrigger);

const LEVEL_COUNT = 4;

const callouts = [
  'Empresa → Sede → Garage: toda tu operación en una sola jerarquía.',
  'Capacidad para reservas y para uso libre, definida por vos.',
  'Ingreso validado hasta 60 minutos antes de la reserva.',
  'Ocupación, picos de uso y tiempo promedio, siempre a la vista.',
];

function StaticParkingPoster() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect width="400" height="300" fill="#0C1E3F" />
      {[0, 1, 2, 3].map((level) => (
        <g key={level} transform={`translate(0 ${level * 62})`}>
          <rect x="60" y="30" width="280" height="14" rx="4" fill="#13294B" stroke="#2563EB" strokeOpacity="0.25" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={70 + i * 32}
              y="48"
              width="18"
              height="10"
              rx="2"
              fill={level === 0 ? '#2563EB' : '#1E3A6B'}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function ParkingStructureSection() {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Pinning is done via ScrollTrigger's own `pin: true` (which positions the
    // element with `position: fixed` + an auto-generated spacer) rather than
    // CSS `position: sticky` — a shared ancestor further up the tree sets
    // `overflow-x-hidden`, and a non-"visible" overflow-x with no explicit
    // overflow-y forces the used value of overflow-y to `auto`, which breaks
    // `position: sticky` for descendants. ScrollTrigger's pin is immune to
    // that because it never relies on CSS sticky positioning.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      // Each callout's window must match ParkingStructureScene's own
      // levelProgress = scrollProgress * (levelCount - 1) mapping (level i is
      // "active" from the midpoint before it to the midpoint after it), so
      // the copy on screen always matches whichever level is actually lit up
      // — equal 1/N-wide windows drift out of sync with the camera's motion.
      callouts.forEach((_, i) => {
        const start = i === 0 ? 0 : (i - 0.5) / (LEVEL_COUNT - 1);
        const end = i === callouts.length - 1 ? 1 : (i + 0.5) / (LEVEL_COUNT - 1);
        const span = end - start;
        tl.fromTo(
          `.parking-callout-${i}`,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: span * 0.3 },
          start
        ).to(
          `.parking-callout-${i}`,
          { autoAlpha: 0, y: -24, duration: span * 0.25 },
          end - span * 0.25
        );
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.parking-callout', { autoAlpha: 1, y: 0 });
    });
  }, { scope: sectionRef });

  if (prefersReducedMotion) {
    return (
      <section
        ref={sectionRef}
        className="relative content-visibility-auto py-24 overflow-hidden bg-gradient-to-b from-brand-deep to-[#050B16]"
      >
        <div className="absolute inset-0" role="img" aria-label="Ilustración de una estructura de estacionamiento de varios niveles">
          <StaticParkingPoster />
        </div>
        <div className="relative z-10 max-w-md mx-auto px-6">
          {callouts.map((text) => (
            <p key={text} className="parking-callout mb-6 font-display font-extrabold text-xl sm:text-2xl text-white opacity-100">
              {text}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-brand-deep to-[#050B16]"
    >
      <div
        className="absolute inset-0"
        role="img"
        aria-label="Animación 3D de una estructura de estacionamiento de varios niveles que se ilumina en azul a medida que se recorre cada nivel"
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [5, 4.8, 10], fov: 45, near: 0.1, far: 50 }}
          onCreated={() => setCanvasReady(true)}
          className={`!absolute inset-0 transition-opacity duration-700 ${canvasReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <Suspense fallback={null}>
            <ParkingStructureScene scrollProgressRef={scrollProgressRef} levelCount={LEVEL_COUNT} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 h-full flex items-center px-6 md:px-16 pointer-events-none">
        <div className="relative w-full max-w-md">
          {callouts.map((text, i) => (
            <p
              key={text}
              className={`parking-callout parking-callout-${i} absolute inset-0 opacity-0 font-display font-extrabold text-lg sm:text-xl md:text-3xl leading-snug text-white`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
