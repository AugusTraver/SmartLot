import { useEffect, useRef, useState } from "react";

const UMBRAL_INICIO = 24;
const DISTANCIA_MINIMA = 6;

export function useFooterCompacto() {
  const [compacto, setCompacto] = useState(false);
  const ultimaPosicion = useRef(0);
  const framePendiente = useRef(null);

  useEffect(() => {
    ultimaPosicion.current = window.scrollY;

    const actualizarEstado = () => {
      const posicionActual = Math.max(window.scrollY, 0);
      const diferencia = posicionActual - ultimaPosicion.current;

      if (posicionActual <= UMBRAL_INICIO) {
        setCompacto(false);
      } else if (diferencia > DISTANCIA_MINIMA) {
        setCompacto(true);
      } else if (diferencia < -DISTANCIA_MINIMA) {
        setCompacto(false);
      }

      ultimaPosicion.current = posicionActual;
      framePendiente.current = null;
    };

    const manejarScroll = () => {
      if (framePendiente.current === null) {
        framePendiente.current = requestAnimationFrame(actualizarEstado);
      }
    };

    window.addEventListener("scroll", manejarScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", manejarScroll);
      if (framePendiente.current !== null) {
        cancelAnimationFrame(framePendiente.current);
      }
    };
  }, []);

  return compacto;
}
