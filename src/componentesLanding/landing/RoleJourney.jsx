import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { CalendarCheck, ScanLine, SlidersHorizontal, ShieldAlert } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, SplitText);

const roles = [
  { role: 'Empleado', action: 'Reservá tu lugar antes de llegar.', icon: CalendarCheck },
  { role: 'Garajista', action: 'Verificá la patente en el acceso.', icon: ScanLine },
  { role: 'Administrador', action: 'Configurá capacidad y zonas.', icon: SlidersHorizontal },
  { role: 'Superadministrador', action: 'Resolvé conflictos entre sedes.', icon: ShieldAlert },
];

export default function RoleJourney() {
  const container = useRef(null);
  const pinRef = useRef(null);
  const headingRefs = useRef([]);
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
    if (prefersReducedMotion) return undefined;

    const splits = headingRefs.current.map((el) => (
      el ? new SplitText(el, { type: 'chars', charsClass: 'role-char' }) : null
    ));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: true,
      },
    });

    roles.forEach((_, i) => {
      const split = splits[i];
      if (!split) return;
      const label = `role${i}`;
      tl.addLabel(label, i === 0 ? 0 : `+=0.4`);
      if (i > 0) {
        tl.to(`.role-panel-${i - 1}`, { autoAlpha: 0, duration: 0.15 }, label);
      }
      tl.set(`.role-panel-${i}`, { autoAlpha: 1 }, label)
        .from(
          split.chars,
          { yPercent: 110, opacity: 0, stagger: 0.02, duration: 0.5, ease: 'power3.out' },
          label
        );
    });

    return () => splits.forEach((s) => s && s.revert());
  }, { scope: container, dependencies: [prefersReducedMotion] });

  return (
    <section
      ref={container}
      aria-label="Recorrido por los cuatro roles de SmartLot: Empleado, Garajista, Administrador y Superadministrador"
      className="relative bg-brand-bg"
    >
      {prefersReducedMotion ? (
        <div className="max-w-4xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(({ role, action, icon: Icon }) => (
            <article key={role} className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
              <Icon className="w-10 h-10 text-brand-blue" aria-hidden="true" />
              <h3 className="text-brand-warm">{role}</h3>
              <p className="text-brand-muted">{action}</p>
            </article>
          ))}
        </div>
      ) : (
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
          {roles.map(({ role, action, icon: Icon }, i) => (
            <div
              key={role}
              role="group"
              aria-label={`${role} — ${action}`}
              className={`role-panel role-panel-${i} absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center ${
                i === 0 ? '' : 'opacity-0'
              }`}
            >
              <Icon className="w-12 h-12 text-brand-blue" aria-hidden="true" />
              <h3
                ref={(el) => { headingRefs.current[i] = el; }}
                aria-hidden="true"
                className="text-brand-warm overflow-hidden"
              >
                {role}
              </h3>
              <p aria-hidden="true" className="role-action text-brand-muted text-xl md:text-2xl max-w-md">
                {action}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
