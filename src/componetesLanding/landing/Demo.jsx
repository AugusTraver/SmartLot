import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Demo() {
  const container = useRef();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
        }
      });

      tl.fromTo(".demo-header", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      )
      .fromTo(".demo-wrapper", 
        { y: 80, scale: 0.9, rotationX: 10, opacity: 0 },
        { 
          y: 0, scale: 1, rotationX: 0, opacity: 1, 
          duration: 1.4, ease: "expo.out", 
          transformPerspective: 1000 
        }, 
        "-=0.6"
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([".demo-header", ".demo-wrapper"], { opacity: 1, y: 0, scale: 1, rotationX: 0 });
    });

  }, { scope: container });

  return (
    <section id="demo" ref={container} className="relative z-10 pt-12 pb-32 bg-transparent content-visibility-auto">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <div className="mb-16">
          <h2 className="demo-header text-5xl md:text-7xl font-extrabold mb-6 text-brand-warm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Experimentá el <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-navy to-brand-blue">futuro hoy</span>
          </h2>
          <p className="demo-header text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Interactuá con nuestro prototipo funcional y descubrí lo fácil que es gestionar espacios con SmartLot.
          </p>
        </div>

        <div className="perspective-[1000px]">
          <div className="demo-wrapper glass-card p-3 md:p-4 rounded-[2.5rem] shadow-[0_16px_40px_-12px_rgba(12,30,63,0.08)]">
            <div className="bg-white rounded-[1.8rem] overflow-hidden shadow-inner border border-brand-navy/5">
              
              <div className="h-12 bg-brand-bg border-b border-brand-muted/20 flex items-center px-5 gap-2 relative">
                <div className="flex gap-2 relative z-10" aria-hidden="true">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white border border-brand-muted/15 text-brand-muted text-xs font-medium py-1 px-4 rounded-md flex items-center gap-2 shadow-sm">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    app.smartlot.com
                  </div>
                </div>
              </div>
              
              <div className="bg-brand-bg relative h-[600px] md:h-[750px] overflow-hidden">
                
                <div 
                  className={`absolute inset-0 z-20 bg-white p-6 md:p-10 flex flex-col gap-6 transition-opacity duration-700 ease-in-out ${
                    iframeLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-4">
                    <div className="h-10 w-48 bg-brand-navy/10 rounded-lg animate-pulse"></div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 bg-brand-navy/10 rounded-full animate-pulse"></div>
                      <div className="h-10 w-10 bg-brand-navy/10 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 h-full w-full">
                    <div className="hidden md:flex flex-col gap-4 w-1/4 h-full border-r border-brand-navy/5 pr-6">
                      <div className="h-12 w-full bg-brand-navy/5 rounded-lg animate-pulse"></div>
                      <div className="h-12 w-full bg-brand-navy/5 rounded-lg animate-pulse"></div>
                      <div className="h-12 w-full bg-brand-navy/5 rounded-lg animate-pulse"></div>
                      <div className="h-12 w-full bg-brand-navy/5 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="flex flex-col gap-6 w-full md:w-3/4 h-full">
                      <div className="flex gap-4 w-full h-32">
                        <div className="flex-1 bg-brand-navy/5 rounded-xl animate-pulse"></div>
                        <div className="flex-1 bg-brand-navy/5 rounded-xl animate-pulse"></div>
                        <div className="flex-1 bg-brand-navy/5 rounded-xl animate-pulse hidden md:block"></div>
                      </div>
                      <div className="w-full flex-1 bg-brand-navy/5 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <iframe
                  title="SmartLot Demo"
                  onLoad={() => setIframeLoaded(true)} 
                  className={`w-full h-full relative z-10 bg-transparent transition-opacity duration-1000 ${
                    iframeLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/UpGFc4YLqAynUEyO13Yvxt/SmartLot?node-id=0-1&t=ZAvxKfo2yr6mtDhY-1"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms"
                ></iframe>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
