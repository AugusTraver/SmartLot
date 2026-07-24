import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import { CheckCircle, IdCard, ScanLine } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Draggable);

export default function AccessControlDemo() {
  const container = useRef(null);
  const sceneRef = useRef(null);
  const barrierRef = useRef(null);
  const scannerRef = useRef(null);
  const cardRef = useRef(null);
  const statusRef = useRef(null);
  const playGrantedRef = useRef(() => {});

  useGSAP((context, contextSafe) => {
    const mm = gsap.matchMedia();

    const playGranted = contextSafe(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tl = gsap.timeline();

      if (reduced) {
        tl.set(barrierRef.current, { rotation: -80 })
          .set(statusRef.current, { autoAlpha: 1 })
          .set(cardRef.current, { x: 0, y: 0 })
          .to(statusRef.current, { autoAlpha: 0, duration: 0.2, delay: 1 })
          .set(barrierRef.current, { rotation: 0 });
      } else {
        tl.to(scannerRef.current, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut' })
          .to(barrierRef.current, { rotation: -80, duration: 0.5, ease: 'power3.out' }, '-=0.1')
          .to(statusRef.current, { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.2')
          .to(cardRef.current, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' }, '<')
          .to(statusRef.current, { autoAlpha: 0, duration: 0.3 }, '+=1.4')
          .to(barrierRef.current, { rotation: 0, duration: 0.4, ease: 'power2.inOut' }, '<');
      }
    });

    playGrantedRef.current = playGranted;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        scrollTrigger: { trigger: container.current, start: 'top 80%' },
      }).fromTo(
        '.access-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }
      );

      const [draggable] = Draggable.create(cardRef.current, {
        type: 'x,y',
        bounds: sceneRef.current,
        onDragEnd() {
          if (this.hitTest(scannerRef.current, '40%')) {
            playGranted();
          } else {
            gsap.to(this.target, { x: 0, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
          }
        },
      });

      return () => draggable.kill();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.access-header', { opacity: 1, y: 0 });
    });
  }, { scope: container });

  const handleTrigger = () => playGrantedRef.current();

  return (
    <section ref={container} className="relative z-10 py-24 content-visibility-auto">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="access-header text-brand-warm mb-4">Control de acceso, en vivo</h2>
        <p className="access-header text-brand-muted mb-12">
          Arrastrá la patente hasta el escáner, o simulá el ingreso con el botón.
        </p>

        <div
          ref={sceneRef}
          className="access-header glass-card rounded-[2rem] p-10 relative h-64 flex items-center justify-center overflow-hidden"
        >
          <div
            ref={barrierRef}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 w-40 h-2 bg-brand-blue rounded-full origin-left"
            style={{ transform: 'translate(-4px, -50%)' }}
          />

          <div
            ref={scannerRef}
            aria-hidden="true"
            className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl border-2 border-dashed border-brand-blue/50 flex items-center justify-center"
          >
            <ScanLine className="w-6 h-6 text-brand-blue" aria-hidden="true" />
          </div>

          <button
            ref={cardRef}
            type="button"
            onClick={handleTrigger}
            aria-label="Tarjeta de patente AB 123 CD. Presioná para simular el ingreso, o arrastrala hasta el escáner."
            className="absolute left-12 flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-lg border border-brand-navy/10 font-bold text-brand-warm cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            <IdCard className="w-5 h-5 text-brand-blue" aria-hidden="true" />
            AB 123 CD
          </button>

          <div
            ref={statusRef}
            role="status"
            aria-live="polite"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md opacity-0 translate-y-2"
          >
            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
            <span className="text-sm font-semibold text-brand-warm">Acceso concedido</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTrigger}
          className="access-header mt-8 px-8 py-4 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg active:scale-95 transition-all duration-300"
        >
          Simular ingreso
        </button>

        <p className="access-header text-brand-muted text-sm mt-4">
          Ingreso permitido hasta 60 minutos antes de la hora reservada.
        </p>
      </div>
    </section>
  );
}
