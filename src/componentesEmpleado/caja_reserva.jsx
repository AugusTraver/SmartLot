// src/componentesEmpleado/caja_reserva.jsx
import React from "react";
import "./caja_reserva.css";

function CajaReserva({ reserva }) {
  if (!reserva) return null;

  const fechaFormateada = reserva.fecha 
    ? new Date(reserva.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })
    : reserva.fecha_entrada 
      ? new Date(reserva.fecha_entrada).toLocaleDateString('es-AR')
      : "Fecha pendiente";

  const obtenerHoraCorta = (fechaStr) => {
    if (!fechaStr) return "00:00";
    if (fechaStr.includes(" ")) {
      return fechaStr.split(" ")[1].substring(0, 5);
    }
    return fechaStr.substring(0, 5);
  };

  const horaInicio = reserva.horaInicio || obtenerHoraCorta(reserva.fecha_entrada);
  const horaFin = reserva.horaFin || obtenerHoraCorta(reserva.fecha_salida);
  const ubicacionGarage = reserva.nombre_garage || reserva.ubicacion || "Garage SmartLot";

  return (
    <section className="empleado-reservas-section">
      <button
        type="button"
        className="empleado-reserva-card"
        aria-label={`Reserva en ${ubicacionGarage}`}
      >
        <div className="reserva-circle-bg reserva-circle-1" aria-hidden="true"></div>
        <div className="reserva-circle-bg reserva-circle-2" aria-hidden="true"></div>

        <div className="empleado-reserva-plaza">
          <strong>{reserva.nro_plaza || reserva.plaza || "P-"}</strong>
          <span>{reserva.nombre_zona || reserva.nivel || "Zona"}</span>
        </div>

        <div className="empleado-reserva-info">
          <h3>{ubicacionGarage}</h3>
          <p>
            {horaInicio} - {horaFin} | {fechaFormateada}
          </p>
        </div>

        <div className="empleado-reserva-icon" aria-hidden="true">
          <span>&gt;</span>
        </div>
      </button>
    </section>
  );
}

export default CajaReserva;