import React, { useRef } from "react";
import { Star, CarFront, Minus, Plus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./formulario_capacidad.css";

// Registrar el hook oficial de GSAP
gsap.registerPlugin(useGSAP);

function FormularioCapacidad({ formData = {}, onChange }) {
  const containerRef = useRef(null);

  // Extraer las variables mapeadas exactamente al estado nativo de EditarZona
  const capacidad = Number(formData.capacidad) || 0;
  const capacidadReservas = Number(formData.capacidad_reservas) || 0;
  const capacidadNoReservas = Number(formData.capacidad_para_no_reservas) || 0;

  // Animación de entrada fluida mediante hardware GPU (staggered cards)
  useGSAP(() => {
    gsap.from(".plaza-item, .plazas-resumen", {
      opacity: 0,
      y: 16,
      duration: 0.45,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  // Manejador centralizado y atómico que actualiza el objeto de estado padre
  const handleUpdate = (field, newValue) => {
    if (!onChange) return;

    const sanitizedValue = Math.max(0, newValue);
    
    // Generar el nuevo set de datos manteniendo la inmutabilidad
    const updatedFields = {
      ...formData,
      [field]: sanitizedValue
    };

    // Recalcular dinámicamente la capacidad total de forma reactiva (Side-effect limpio)
    if (field === "capacidad_reservas") {
      updatedFields.capacidad = sanitizedValue + capacidadNoReservas;
    } else if (field === "capacidad_para_no_reservas") {
      updatedFields.capacidad = capacidadReservas + sanitizedValue;
    }

    onChange(updatedFields);
  };

  return (
    <div className="bloque-formulario" ref={containerRef}>
      <div className="header-formulario-capacidad">
        <h3>Capacidad del Establecimiento</h3>
        <p>Configura la distribución de plazas disponibles en tiempo real.</p>
      </div>
      
      {/* Resumen dinámico sincronizado */}
      <div className="plazas-resumen">
        <span>Capacidad total recalculada</span>
        <strong>{capacidad} plazas</strong>
      </div>

      <div className="plazas-grid">
        {/* Tarjeta: Reservas */}
        <div className="plaza-item">
          <div className="plaza-top">
            <div className="plaza-icon">
              <Star size={18} />
            </div>
            <span className="plaza-tag">RESERVAS</span>
          </div>

          <h4>Capacidad Reservas</h4>
          <p>Ubicaciones para usuarios con reserva.</p>

          <div className="contador">
            <button
              type="button"
              className="btn-contador"
              onClick={() => handleUpdate("capacidad_reservas", capacidadReservas - 1)}
              disabled={capacidadReservas <= 0}
              aria-label="Disminuir capacidad de reservas"
            >
              <Minus size={16} />
            </button>
            
            <input
              type="number"
              min="0"
              value={capacidadReservas}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                handleUpdate("capacidad_reservas", Number.isNaN(value) ? 0 : value);
              }}
            />

            <button
              type="button"
              className="btn-contador"
              onClick={() => handleUpdate("capacidad_reservas", capacidadReservas + 1)}
              aria-label="Aumentar capacidad de reservas"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Tarjeta: No Reservas */}
        <div className="plaza-item">
          <div className="plaza-top">
            <div className="plaza-icon" style={{ background: "rgba(71, 85, 105, 0.1)", color: "#156fe5" }}>
              <CarFront size={18} />
            </div>
            <span className="plaza-tag tag-no-reservas">NO RESERVAS</span>
          </div>

          <h4>Capacidad No Reservas</h4>
          <p>Plazas de uso general por llegada.</p>

          <div className="contador">
            <button
              type="button"
              className="btn-contador"
              onClick={() => handleUpdate("capacidad_para_no_reservas", capacidadNoReservas - 1)}
              disabled={capacidadNoReservas <= 0}
              aria-label="Disminuir capacidad no reservas"
            >
              <Minus size={16} />
            </button>

            <input
              type="number"
              min="0"
              value={capacidadNoReservas}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                handleUpdate("capacidad_para_no_reservas", Number.isNaN(value) ? 0 : value);
              }}
            />

            <button
              type="button"
              className="btn-contador"
              onClick={() => handleUpdate("capacidad_para_no_reservas", capacidadNoReservas + 1)}
              aria-label="Aumentar capacidad no reservas"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioCapacidad;