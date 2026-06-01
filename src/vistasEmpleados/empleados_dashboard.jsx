import "./empleados_dashboard.css";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import { useNavigate } from "react-router-dom";

function EmpleadoDashboard() {
  const navigate = useNavigate();

  return (
    <div className="empleado-dashboard-page">
      <HeaderEmpleado />

      <main className="empleado-dashboard-main">
        <button className="empleado-back-button">
          ←
        </button>

        <h1 className="empleado-dashboard-title">
          Sebastian Lopez
        </h1>

        <section className="empleado-disponibilidad-card">
          <div className="empleado-disponibilidad-top">
            <div className="empleado-parking-icon">P</div>
            <span className="empleado-live-badge">EN VIVO</span>
          </div>

          <p className="empleado-disponibilidad-text">
            Disponibilidad en Tiempo Real
          </p>

          <div className="empleado-plazas-libres">
            <strong>15</strong>
            <span>Plazas Libres</span>
          </div>

          <p className="empleado-companeros">
            compañeros que ya estacionarion hoy
          </p>
        </section>

          <div className="empleado-reservas-header">
            <h2>Mis Reservas Actuales</h2>
            <button>Ver todas</button>
          </div>

          <TarjetaReserva to="/nueva_reserva" />

        <button
          className="empleado-nueva-reserva-btn"
          onClick={() => navigate("/nueva_reserva")}
        >
          + Nueva Reserva
        </button>
      </main>
    </div>
  );
}

export default EmpleadoDashboard;
