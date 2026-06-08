// src/componentesEmpleado/tarjeta_reserva.jsx
import React from "react";
import "./tarjeta_reserva.css";

function TarjetaReserva({ reserva }) {
  if (!reserva) return null;

  // Formateamos la fecha para que se lea de forma limpia en Argentina (ej. "15/06/2026")
  const fechaFormateada = reserva.fecha 
    ? new Date(reserva.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' }) 
    : "";

  return (
    <section className="empleado-reservas-section">
      <button
        type="button"
        className="empleado-reserva-card"
        aria-label={`Reserva en ${reserva.nombre_garage || 'Garage'}`}
      >
        {/* 🚀 CÍRCULOS DECORATIVOS ADENTRO DE LA TARJETA (EFECTO DE FONDO PREMIUM) */}
        <div className="reserva-circle-bg reserva-circle-1" aria-hidden="true"></div>
        <div className="reserva-circle-bg reserva-circle-2" aria-hidden="true"></div>

        {/* Bloque del Número de la Plaza (Izquierda) */}
        <div className="empleado-reserva-plaza">
          <strong>{reserva.nro_plaza || "-"}</strong>
          <span>{reserva.nombre_zona || "Sector"}</span>
        </div>

        {/* Bloque de Información de Ubicación y Tiempos (Centro) */}
        <div className="empleado-reserva-info">
          <h3>{reserva.nombre_garage || "Ubicación no especificada"}</h3>
          <p>
            {reserva.hora_entrada?.substring(0, 5) || "00:00"} a {reserva.hora_salida?.substring(0, 5) || "00:00"} | {fechaFormateada}
          </p>
        </div>

        {/* Contenedor de la Flecha (Derecha) */}
        <div className="empleado-reserva-icon" aria-hidden="true">
          <span>&gt;</span>
        </div>
      </button>
    </section>
  );
}

export default TarjetaReserva;