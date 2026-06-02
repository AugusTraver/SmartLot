import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero({ startAnimation }) { 
  const container = useRef();

  useGSAP(() => {
    if (!startAnimation) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ 
        defaults: { ease: "power4.out" },
        delay: 0.4 
      });
      
      tl.from(".hero-badge", { y: -16, opacity: 0, duration: 1 })
        .from(".word", { 
          y: 80, 
          rotateX: -30, 
          opacity: 0, 
          duration: 1.2, 
          stagger: 0.2 
        }, "-=0.5")
        .from(".hero-p", { opacity: 0, x: -16, duration: 1 }, "-=0.6")
        .from(".hero-btn", { scale: 0.85, opacity: 0, duration: 0.7 }, "-=0.8")
        .from(".hero-logo-container", { x: 80, opacity: 0, duration: 1.4 }, "-=1");

      gsap.to(".floating-logo", {
        y: "-=12",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([".hero-badge", ".word", ".hero-p", ".hero-btn", ".hero-logo-container"], { opacity: 1, y: 0, x: 0 });
    });

  }, { 
    scope: container,
    dependencies: [startAnimation] 
  });

  return (
    <section ref={container} className="relative pt-32 pb-12 overflow-hidden bg-transparent min-h-[75vh] flex items-center z-10">
      <div className="max-w-7xl mx-auto px-6 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-left relative z-20">
            <span className="hero-badge inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-brand-navy uppercase bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-brand-navy/10">
              SmartLot App
            </span>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-none mb-8 text-brand-warm" className="font-display">
              <div className="overflow-hidden py-1"><span className="word inline-block">Gestioná.</span></div>
              <div className="overflow-hidden py-1"><span className="word inline-block">Optimizá.</span></div>
              <div className="overflow-hidden py-1"><span className="word inline-block text-brand-blue">Escalá.</span></div>
            </h1>
            
            <p className="hero-p text-lg md:text-xl text-brand-muted max-w-lg mb-10 leading-relaxed">
              La plataforma SaaS que redefine el control de accesos y estacionamientos corporativos con IA.
            </p>
            
            <button className="hero-btn px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-brand-deep focus-visible:bg-brand-deep active:scale-95 transition-all duration-300 hover:shadow-xl shadow-lg shadow-brand-deep/20">
              Solicitar Demo Gratis
            </button>
          </div>

          <div className="hero-logo-container relative flex justify-center lg:justify-end z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-navy rounded-full blur-[100px] opacity-[0.07] -z-10"></div>
            <img src="/logoEntero.png" alt="SmartLot" width="500" height="134" className="floating-logo w-full max-w-[500px] h-auto drop-shadow-xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
