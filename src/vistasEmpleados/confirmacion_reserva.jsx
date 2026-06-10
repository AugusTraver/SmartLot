import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, Car } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";
import "./confirmacion_reserva.css";

const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  const parsed = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return fecha;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

function ConfirmacionReserva() {
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva || {};

  return (
    <div className="confirmacion-layout-root">
      <HeaderEmpleado />

      <main className="confirmacion-main-wrapper">
        <section className="confirmacion-content">
          <div className="confirmacion-top-bar">
            <button
              className="boton-back-Confirmacion"
              onClick={() => navigate("/empleados_dashboard")}
              aria-label="Volver al panel"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="confirmacion-breadcrumb">Reserva confirmada</span>
          </div>

          <article className="confirmacion-bento-box">
            <span className="confirmacion-badge-success">
              <CheckCircle2 size={16} />
              Confirmada
            </span>

            <div className="confirmacion-text-header">
              <h1>Tu reserva fue creada</h1>
              <p>Guardamos tu plaza para el horario seleccionado.</p>
            </div>

            <div className="confirmacion-card-container">
              <div className="confirmacion-reserva-card">
                <div className="confirmacion-plaza">
                  <strong>{reserva.plaza || "Asignada"}</strong>
                  <span>{reserva.nivel || "Zona asignada"}</span>
                </div>

                <div className="confirmacion-detalles">
                  <div className="confirmacion-detalle">
                    <MapPin size={18} />
                    <span>{reserva.ubicacion || "Garage SmartLot"}</span>
                  </div>
                  {reserva.vehiculo && (
                    <div className="confirmacion-detalle">
                      <Car size={18} />
                      <span>{reserva.vehiculo}</span>
                    </div>
                  )}
                  <div className="confirmacion-detalle">
                    <CalendarDays size={18} />
                    <span>{formatearFecha(reserva.fecha)}</span>
                  </div>
                  <div className="confirmacion-detalle">
                    <Clock3 size={18} />
                    <span>
                      {reserva.horaInicio || "--:--"} - {reserva.horaFin || "--:--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="confirmacion-actions">
              <button
                type="button"
                className="btn-confirmacion-dashboard"
                onClick={() => navigate("/empleados_dashboard")}
              >
                Volver al inicio
              </button>
            </div>
          </article>
        </section>
      </main>

      <FooterEmpleado />
    </div>
  );
}

export default ConfirmacionReserva;
