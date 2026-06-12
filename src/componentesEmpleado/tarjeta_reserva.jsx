// src/componentesEmpleado/tarjeta_reserva.jsx
import { Car } from "lucide-react";
import "./tarjeta_reserva.css";

function TarjetaReserva({ reserva, onClick }) {
  if (!reserva) return null;

  const fechaFormateada = reserva.fecha
    ? new Date(reserva.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })
    : "";

  const vehiculo = reserva.vehiculo;
  const tieneVehiculo = vehiculo && (vehiculo.patente || vehiculo.marca || vehiculo.modelo);

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
          <small>Reservado</small>
        </div>

        {/* Bloque de Informacion de Ubicacion y Tiempos (Centro) */}
        <div className="empleado-reserva-info">
          <h3>{reserva.nombre_garage || "Ubicación no especificada"}</h3>
          <p>
            {reserva.hora_entrada?.substring(0, 5) || "00:00"} a {reserva.hora_salida?.substring(0, 5) || "00:00"} | {fechaFormateada}
          </p>

          {/* Mini card del vehiculo */}
          {tieneVehiculo && (
            <div className="empleado-reserva-vehiculo">
              <div className="empleado-reserva-vehiculo-icon" aria-hidden="true">
                <Car size={16} />
              </div>
              <div className="empleado-reserva-vehiculo-info">
                <span className="empleado-reserva-vehiculo-patente">{vehiculo.patente || "Sin patente"}</span>
                <span className="empleado-reserva-vehiculo-modelo">
                  {[vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" ")}
                </span>
              </div>
            </div>
          )}
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
