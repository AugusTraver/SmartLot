import { useNavigate } from "react-router-dom";
import "./tarjeta_reserva.css";

function TarjetaReserva({ to = "/nueva_reserva" }) {
  const navigate = useNavigate();

  return (
    <section className="empleado-reservas-section">
      <button
        type="button"
        className="empleado-reserva-card"
       // onClick={() => navigate("/historial_reservas")}
        aria-label="Abrir detalle de reserva en Sede Central - Zona A"
      >
        <div className="empleado-reserva-plaza">
          <strong>P12</strong>
          <span>NIVEL 2</span>
        </div>

        <div className="empleado-reserva-info">
          <h3>Sede Central - Zona A</h3>
          <p>08:30 - 18:00 · Hoy</p>
        </div>

        <div className="empleado-reserva-icon" aria-hidden="true">
          <span>→</span>
        </div>
      </button>
    </section>
  );
}

export default TarjetaReserva;
