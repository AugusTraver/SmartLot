import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  ArrowLeft, 
  BarChart3, 
  AlertTriangle, 
  UserX, 
  CalendarX 
} from 'lucide-react'; // Iconos limpios y modernos

// Registrar el hook de GSAP
gsap.registerPlugin(useGSAP);

export default function AdminPanelControl() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });

    // Animación de entrada secuencial optimizada por GPU
    tl.from('.animate-header', { opacity: 0, y: -20 })
      .from('.animate-stat-card', { opacity: 0, y: 30 }, '-=0.4')
      .from('.animate-progress-bar', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power4.out' }, '-=0.2')
      .from('.animate-conflict-title', { opacity: 0, x: -20 }, '-=0.6')
      .from('.animate-conflict-card', { 
        opacity: 0, 
        y: 40, 
        stagger: 0.15 
      }, '-=0.4');

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-6 max-w-md mx-auto font-sans antialiased"
    >
      {/* Header */}
      <header className="animate-header mb-6">
        <button className="p-2 -ml-2 text-[#0F172A] hover:bg-slate-200/50 rounded-full transition-colors duration-200 mb-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-[#1E293B]">Panel de Control</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Supervisión general de reservas y estados de ocupación.
        </p>
      </header>

      {/* Tarjeta de Ocupación Total */}
      <section className="animate-stat-card bg-[#1D4ED8] rounded-3xl p-6 text-white shadow-lg shadow-blue-600/10 mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
            Ocupación Total
          </span>
          <BarChart3 className="w-5 h-5 opacity-90" />
        </div>
        <div className="text-5xl font-extrabold tracking-tight mb-4">84%</div>
        
        {/* Barra de Progreso */}
        <div className="w-full h-2 bg-blue-600/50 rounded-full overflow-hidden">
          <div className="animate-progress-bar w-[84%] h-full bg-white rounded-full" />
        </div>
      </section>

      {/* Sección de Conflictos */}
      <section>
        <div className="animate-conflict-title flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
          <h2 className="text-lg font-bold text-[#1E293B]">
            Conflictos detectados (2)
          </h2>
        </div>

        <div className="space-y-4">
          {/* Conflicto 1: Duplicidad */}
          <div className="animate-conflict-card bg-[#FEF2F2] border border-[#FEE2E2] rounded-3xl p-5 shadow-sm">
            <div className="flex gap-4 items-start mb-3">
              <div className="p-3 bg-[#FEE2E2] text-[#991B1B] rounded-2xl">
                <UserX className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-[#991B1B] text-base leading-tight">
                    Duplicidad de Plaza
                  </h3>
                  <span className="text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 bg-[#FCA5A5]/30 text-[#991B1B] rounded-md shrink-0">
                    Crítico
                  </span>
                </div>
                <p className="text-xs font-medium text-[#7F1D1D]/70 mt-0.5">
                  Plaza A-12 • Zona Norte
                </p>
              </div>
            </div>
            
            <p className="text-sm text-[#475569] leading-normal mb-4">
              Carlos Ruiz y Marta Gil asignados a la misma plaza para el 24 de Octubre.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 px-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm shadow-red-900/10">
                Reasignar Marta
              </button>
              <button className="py-2.5 px-4 bg-white hover:bg-slate-50 text-[#1E293B] text-xs font-bold rounded-xl border border-slate-200 transition-all duration-200 active:scale-[0.98]">
                Ver Detalles
              </button>
            </div>
          </div>

          {/* Conflicto 2: Sobrecapacidad */}
          <div className="animate-conflict-card bg-[#FEF2F2] border border-[#FEE2E2] rounded-3xl p-5 shadow-sm">
            <div className="flex gap-4 items-start mb-3">
              <div className="p-3 bg-[#FEE2E2] text-[#991B1B] rounded-2xl">
                <CalendarX className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-[#991B1B] text-base leading-tight">
                    Sobrecapacidad Zona VIP
                  </h3>
                  <span className="text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 bg-[#FCA5A5]/30 text-[#991B1B] rounded-md shrink-0">
                    Crítico
                  </span>
                </div>
                <p className="text-xs font-medium text-[#7F1D1D]/70 mt-0.5">
                  Zona VIP • 12:00 - 15:00
                </p>
              </div>
            </div>
            
            <p className="text-sm text-[#475569] leading-normal mb-4">
              Demanda excede plazas disponibles en un 15% para el turno de tarde.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-2.5 px-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm shadow-red-900/10">
                Abrir lista de espera
              </button>
              <button className="py-2.5 px-4 bg-white hover:bg-slate-50 text-[#1E293B] text-xs font-bold rounded-xl border border-slate-200 transition-all duration-200 active:scale-[0.98]">
                Ajustar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}