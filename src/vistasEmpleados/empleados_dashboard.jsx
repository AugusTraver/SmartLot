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
        <div className="empleado-dashboard-intro">
          <span className="empleado-dashboard-kicker">Hoy</span>
          <h1 className="empleado-dashboard-title">Hola, Sebastian</h1>
          <p className="empleado-dashboard-subtitle">
            Tu reserva y disponibilidad del estacionamiento.
          </p>
        </div>

        <section className="empleado-disponibilidad-card">
          <div className="empleado-disponibilidad-top">
            <div className="empleado-parking-icon">P</div>
            <span className="empleado-live-badge">EN VIVO</span>
          </div>

          <p className="empleado-disponibilidad-text">
            Disponibilidad en tiempo real
          </p>

          <div className="empleado-plazas-libres">
            <strong>15</strong>
            <span>Plazas Libres</span>
          </div>

          <p className="empleado-companeros">
            compañeros que ya estacionaron hoy
          </p>

          <div className="empleado-disponibilidad-metrics">
            <span>Ocupación baja</span>
            <span>Acceso habilitado</span>
          </div>
        </section>

        <div className="empleado-reservas-header">
          <div>
            <span>Agenda</span>
            <h2>Mis Reservas Actuales</h2>
          </div>
          <button type="button">Ver todas</button>
        </div>

        <TarjetaReserva to="/nueva_reserva" />

        <button
          type="button"
          className="empleado-nueva-reserva-btn"
          onClick={() => navigate("/nueva_reserva")}
        >
          Nueva reserva
        </button>
      </main>
    </div>
  );
}

export default EmpleadoDashboard;
