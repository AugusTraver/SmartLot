import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const IntroAnimation = ({ onComplete, onOpenDoors }) => {
  const containerRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const logoContainerRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ onComplete });

      gsap.set(logoContainerRef.current, { opacity: 0, scale: 0.8, y: 20 });

      tl.to(logoContainerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.2)",
      })
      .to(logoContainerRef.current, {
        opacity: 0,
        scale: 1.05,
        y: -20,
        duration: 0.5,
        ease: "power2.inOut",
      }, "+=1.2")
      .addLabel("doorsStart", "-=0.2")
      .add(onOpenDoors, "doorsStart")
      .to([leftDoorRef.current, rightDoorRef.current], {
        xPercent: (i) => (i === 0 ? -100 : 100),
        duration: 1.4,
        ease: "expo.inOut",
      }, "doorsStart");
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(logoContainerRef.current, { opacity: 1, scale: 1, y: 0 });
      gsap.set([leftDoorRef.current, rightDoorRef.current], { opacity: 0 });
      onOpenDoors();
      onComplete();
    });

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-transparent pointer-events-none"
    >
      <div ref={leftDoorRef} className="absolute left-0 top-0 h-full w-1/2 bg-brand-navy will-change-transform" />
      <div ref={rightDoorRef} className="absolute right-0 top-0 h-full w-1/2 bg-brand-navy will-change-transform" />
      
      <div 
        ref={logoContainerRef} 
        className="relative z-10 flex items-center justify-center bg-white/95 backdrop-blur-md px-10 py-10 md:px-16 md:py-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(12,30,63,0.5)] border border-white/50"
      >
        <img 
          src="/logoEntero.png" 
          alt="SmartLot"
          width="448"
          height="120"
          className="w-64 md:w-[28rem] h-auto object-contain" 
        />
      </div>
    </div>
  );
};

export default IntroAnimation;
