import "./tarjeta_reserva.css";

function TarjetaReserva({ reserva }) {
  return (
    <section className="empleado-reservas-section">
      <button
        type="button"
        className="empleado-reserva-card"
        aria-label={`Reserva en ${reserva.ubicacion}`}
      >
        <div className="empleado-reserva-plaza">
          <strong>{reserva.plaza}</strong>
          <span>{reserva.nivel}</span>
        </div>

        <div className="empleado-reserva-info">
          <h3>{reserva.ubicacion}</h3>
          <p>
            {reserva.horario} - {reserva.fechaLabel}
          </p>
        </div>

        <div className="empleado-reserva-icon" aria-hidden="true">
          <span>{">"}</span>
        </div>
      </button>
    </section>
  );
}

export default TarjetaReserva;
