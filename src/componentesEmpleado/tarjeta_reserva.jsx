// src/componentesEmpleado/tarjeta_reserva.jsx
import "./tarjeta_reserva.css";

function TarjetaReserva({ reserva, onClick }) {
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
        onClick={() => onClick?.(reserva)}
      >
        {/* Bloque del Numero de la Plaza (Izquierda) */}
        <div className="empleado-reserva-plaza">
          <strong>{reserva.nro_plaza || "-"}</strong>
          <span>{reserva.nombre_zona || "Sector"}</span>
        </div>

        {/* Bloque de Informacion de Ubicacion y Tiempos (Centro) */}
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
