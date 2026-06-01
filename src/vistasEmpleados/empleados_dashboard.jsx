import "./empleados_dashboard.css";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
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
            compañeros ya aparcados
          </p>
        </section>

        <section className="empleado-reservas-section">
          <div className="empleado-reservas-header">
            <h2>Mis Reservas Actuales</h2>
            <button>Ver todas</button>
          </div>

          <article className="empleado-reserva-card">
            <div className="empleado-reserva-plaza">
              <strong>P12</strong>
              <span>NIVEL 2</span>
            </div>

            <div className="empleado-reserva-info">
              <h3>Sede Central - Zona A</h3>
              <p>08:30 - 18:00 · Hoy</p>
            </div>

            <div className="empleado-reserva-icon">
              🚘
            </div>
          </article>
        </section>

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