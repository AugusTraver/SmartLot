import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);


const TOTAL_FRAMES = 120;
const FRAME_PATH = (i) => `/GIF_IMGS_LOGO/ffout${String(i).padStart(3, '0')}.png`;
// Los frames del gif tienen el logo más chico (con padding) que logoEntero.png:
// arrancamos la reproducción con este zoom para que el tamaño coincida y lo
// bajamos a 1 durante el giro.
const START_FRAME_ZOOM = 1.25;


export default function LogoWatermark({ heroRef }) {
  const container = useRef(null);
  const canvasRef = useRef(null);
  const staticImgRef = useRef(null);
  const wrapperRef = useRef(null);
  const tiltRef = useRef(null);
  const framesRef = useRef([]);
  const startLogoRef = useRef(null);
  const animStateRef = useRef({ framesReady: false, staticReady: false });
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const lastImgRef = useRef(null);


  // Preload all frames AND the static logo into Image objects
  useEffect(() => {
    let loaded = 0;
    const total = TOTAL_FRAMES + 1;
    const images = [];


    const onLoad = () => {
      loaded++;
      if (loaded === total) {
        animStateRef.current.framesReady = true;
      }
    };


    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = onLoad;
      img.onerror = onLoad;
      images.push(img);
    }


    const staticLogo = new Image();
    staticLogo.src = '/logo.png';
    staticLogo.onload = () => {
      animStateRef.current.staticReady = true;
      onLoad();
    };
    staticLogo.onerror = onLoad;
    images.push(staticLogo);


    framesRef.current = images;


    const startLogo = new Image();
    startLogo.src = '/logoEntero.png';
    startLogoRef.current = startLogo;
  }, []);


  const drawImage = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!img || !img.complete) return;


    const size = canvasSizeRef.current;
    if (size.width > 0 && size.height > 0) {
      canvas.width = size.width;
      canvas.height = size.height;
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);


    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;
    let drawW, drawH, drawX, drawY;


    if (imgAspect > canvasAspect) {
      drawW = canvas.width;
      drawH = canvas.width / imgAspect;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgAspect;
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    }


    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    lastImgRef.current = img;
  }, []);


  const drawFrame = useCallback((frameIndex) => {
    drawImage(framesRef.current[frameIndex]);
  }, [drawImage]);


  // Sync canvas internal resolution to display size via ResizeObserver,
  // redrawing whatever was on screen so it doesn't stay stretched/blurry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;


    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        canvasSizeRef.current = { width: width * 2, height: height * 2 };
        if (lastImgRef.current) drawImage(lastImgRef.current);
      }
    });


    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawImage]);


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
      const getHeroLogoContainer = () => heroRef.current?.querySelector('.hero-logo-container');


      gsap.set(wrapperRef.current, { opacity: 0 });
      gsap.set(canvasRef.current, { opacity: 0 });
      gsap.set(staticImgRef.current, { opacity: 0 });


      // ── Scroll-velocity inertia (3D momentum) ──
      // The inner tilt layer reacts to how HARD you scroll: fast scrolling
      // pushes a 3D tilt + a forward "lunge" (translateZ), then quickTo eases
      // it back to rest, giving the logo a sense of physical inertia. It lives
      // on a separate element so it never fights the timeline's own transforms
      // (position/scale/rotationY spin) applied to the wrapper.
      gsap.set(tiltRef.current, { transformPerspective: 900, transformOrigin: '50% 50%' });
      const rotXTo = gsap.quickTo(tiltRef.current, 'rotationX', { duration: 0.8, ease: 'power3' });
      const rotYTo = gsap.quickTo(tiltRef.current, 'rotationY', { duration: 0.8, ease: 'power3' });
      const zTo = gsap.quickTo(tiltRef.current, 'z', { duration: 0.9, ease: 'power3' });

      // Scroll speed also spins the settled watermark faster, then decays back.
      const spinProxy = { ts: 1 };
      const spinTo = gsap.quickTo(spinProxy, 'ts', {
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (continuousAnim) continuousAnim.timeScale(spinProxy.ts);
        },
      });

      let idleTimer;
      const settle = () => {
        rotXTo(0);
        rotYTo(0);
        zTo(0);
        spinTo(1);
      };

      // Map raw scroll velocity (px/s) to the 3D inertia response.
      const applyInertia = (velocity) => {
        const v = gsap.utils.clamp(-3500, 3500, velocity);
        rotXTo(gsap.utils.mapRange(-3500, 3500, 20, -20, v));
        rotYTo(gsap.utils.mapRange(-3500, 3500, -12, 12, v));
        zTo(gsap.utils.clamp(0, 100, Math.abs(velocity) / 30));
        spinTo(gsap.utils.clamp(1, 4.5, 1 + Math.abs(velocity) / 500));
        clearTimeout(idleTimer);
        idleTimer = setTimeout(settle, 150);
      };


      // Swap in: capture hero logo position, pin the wrapper there, hide the hero logo
      const swapIn = () => {
        const heroLogo = getHeroLogo();
        const heroContainer = getHeroLogoContainer();
        if (!heroLogo) return;
        const rect = heroLogo.getBoundingClientRect();
        gsap.set(wrapperRef.current, {
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          transformOrigin: '50% 50%',
          transformPerspective: 1000,
        });
        // The ResizeObserver won't have seen the new wrapper size yet
        // (it fires async), so size the canvas from the rect before drawing
        canvasSizeRef.current = { width: rect.width * 2, height: rect.height * 2 };
        const startLogo = startLogoRef.current;
        drawImage(startLogo && startLogo.complete ? startLogo : framesRef.current[0]);
        gsap.set(canvasRef.current, { opacity: 1, scale: 1 });
        gsap.set(heroLogo, { visibility: 'hidden' });
        if (heroContainer) {
          gsap.set(heroContainer, { opacity: 0 });
        }
      };


      // Swap out: restore hero logo, hide the wrapper
      const swapOut = () => {
        const heroLogo = getHeroLogo();
        const heroContainer = getHeroLogoContainer();
        if (heroLogo) {
          gsap.set(heroLogo, { visibility: 'visible' });
        }
        if (heroContainer) {
          gsap.set(heroContainer, { opacity: 1 });
        }
        gsap.set(wrapperRef.current, { opacity: 0 });
        gsap.set(canvasRef.current, { opacity: 0 });
        gsap.set(staticImgRef.current, { opacity: 0 });
      };


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          // On viewports taller than the hero, "bottom bottom" resolves to a
          // negative scroll offset (unreachable), so progress can never
          // return to exactly 0 at the top of the page. Clamp it to 0.
          start: () => {
            const rect = heroRef.current.getBoundingClientRect();
            const idealStart = rect.bottom + window.scrollY - window.innerHeight;
            return Math.max(idealStart, 0);
          },
          end: "+=200%",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: swapIn,
          onLeaveBack: (self) => {
            // Force the lagging scrub to finish rewinding NOW, so its
            // pending renders can't override the restore below
            self.getTween()?.progress(1);
            tl.progress(0);
            swapOut();
          },
          onUpdate: (self) => {
            // Harder scroll → stronger 3D tilt/lunge + faster spin (inertia).
            applyInertia(self.getVelocity());

            if (self.progress >= 1 && !continuousAnim) {
              // Past this point it's no longer "the logo transitioning" —
              // it's a persistent background mark sitting over the rest of
              // the page's sections, several of which have transparent
              // backdrops. Fading it down to true watermark opacity here
              // keeps it a subtle brand touch instead of a solid shape
              // competing with whatever section content scrolls under it.
              gsap.to(wrapperRef.current, { opacity: 0.14, duration: 0.6, ease: 'power2.out' });
              continuousAnim = gsap.to(wrapperRef.current, {
                rotationY: "+=360",
                duration: 20,
                ease: "none",
                repeat: -1,
              });
              continuousAnim.timeScale(spinProxy.ts);
            }
            if (self.progress < 1 && continuousAnim) {
              gsap.to(wrapperRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });
              continuousAnim.kill();
              continuousAnim = null;
            }
          },
        }
      });


      // Phase 2: Play the frame animation on canvas. The frames pad the logo
      // smaller than logoEntero, so they start zoomed to match and ease to 1.
      tl.fromTo(canvasRef.current,
        { scale: START_FRAME_ZOOM },
        { scale: 1, duration: 0.2, ease: "power1.out", immediateRender: false },
      0.02)
      .to(state, {
        currentFrame: TOTAL_FRAMES - 1,
        duration: 0.28,
        ease: "none",
        onUpdate: () => {
          drawFrame(Math.round(state.currentFrame));
        }
      }, 0.02)


      // Phase 3: Crossfade from canvas to static logo
      .to(canvasRef.current, { opacity: 0, duration: 0.03 }, 0.30)
      .to(staticImgRef.current, { opacity: 1, duration: 0.03 }, 0.30)


      // Phase 4: Animate to final watermark position
      .to(wrapperRef.current, {
        top: () => window.innerHeight * 0.1,
        left: () => window.innerWidth * 0.5,
        xPercent: -50,
        yPercent: 0,
        scale: 2.8,
        rotationY: 60,
        rotationX: 12,
        duration: 0.78,
        ease: "power2.inOut",
      }, 0.02)


      // Phase 5: Settle
      .to(wrapperRef.current, {
        duration: 0.20,
        ease: "power1.out",
      }, 0.80);


      return () => clearTimeout(idleTimer);
    });


    return () => mm.revert();
  }, { scope: container, dependencies: [heroRef, drawFrame], revertOnUpdate: true });


  return (
    <div ref={container} className="fixed inset-0 pointer-events-none z-[5]">
      <div ref={wrapperRef} className="logo-watermark" style={{ opacity: 0 }}>
        <div
          ref={tiltRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform' }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0 }}
            role="img"
            aria-label="SmartLot animated logo transition"
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
    </div>
  );
}
