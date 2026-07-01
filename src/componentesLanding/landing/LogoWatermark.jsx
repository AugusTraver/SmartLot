import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LogoWatermark({ heroRef }) {
  const container = useRef(null);
  const frameImgRef = useRef(null);
  const staticImgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const frames = Array.from({ length: 120 }, (_, i) =>
      `/GIF_IMGS_LOGO/ffout${String(i + 1).padStart(3, '0')}.gif`
    );
    frames.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(wrapperRef.current, { opacity: 1, scale: 2.5 });
      gsap.set(staticImgRef.current, { opacity: 1 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { currentFrame: 0 };
      let continuousAnim = null;

      const getHeroLogo = () => heroRef.current?.querySelector('.floating-logo');
      const getHeroRect = () => {
        const el = getHeroLogo();
        return el ? el.getBoundingClientRect() : { top: 0, left: 0, width: 0, height: 0 };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "bottom bottom",
          end: "+=200%",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress >= 1 && !continuousAnim) {
              continuousAnim = gsap.to(wrapperRef.current, {
                rotationY: "+=360",
                duration: 20,
                ease: "none",
                repeat: -1,
              });
            }
            if (self.progress < 0.95 && continuousAnim) {
              continuousAnim.kill();
              continuousAnim = null;
            }
          },
        }
      });

      tl.set(wrapperRef.current, {
        position: 'fixed',
        top: () => getHeroRect().top,
        left: () => getHeroRect().left,
        width: () => getHeroRect().width,
        height: () => getHeroRect().height,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        opacity: 1,
        transformOrigin: '50% 50%',
        transformPerspective: 1000,
      }, 0)
      .set(getHeroLogo, { opacity: 0 }, 0)
      .call(() => {
        frameImgRef.current.src = '/GIF_IMGS_LOGO/ffout001.gif';
      }, [], 0)
      .set(frameImgRef.current, { opacity: 1 }, 0)
      .set(staticImgRef.current, { opacity: 0 }, 0)

      .to(state, {
        currentFrame: 119,
        duration: 0.28,
        ease: "none",
        onUpdate: () => {
          const frame = Math.round(state.currentFrame) + 1;
          frameImgRef.current.src = `/GIF_IMGS_LOGO/ffout${String(frame).padStart(3, '0')}.gif`;
        }
      }, 0.02)

      .to(frameImgRef.current, { opacity: 0, duration: 0.03 }, 0.30)
      .to(staticImgRef.current, { opacity: 1, duration: 0.03 }, 0.30)

      .to(wrapperRef.current, {
        top: () => window.innerHeight * 0.1,
        left: () => window.innerWidth * 0.5,
        xPercent: -50,
        yPercent: 0,
        scale: 2.8,
        rotationY: 60,
        rotationX: 12,
        opacity: 1,
        duration: 0.78,
        ease: "power2.inOut",
      }, 0.02)

      .to(wrapperRef.current, {
        duration: 0.20,
        ease: "power1.out",
      }, 0.80);
    });

    return () => mm.revert();
  }, { scope: container, dependencies: [heroRef] });

  return (
    <div ref={container} className="fixed inset-0 pointer-events-none z-0">
      <div ref={wrapperRef} className="logo-watermark">
        <img
          ref={frameImgRef}
          src=""
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: 0 }}
        />
        <img
          ref={staticImgRef}
          src="/logo.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
