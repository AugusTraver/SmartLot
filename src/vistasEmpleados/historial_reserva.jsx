import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import ModalDetalleReserva from "../componentesEmpleado/modal_detalle_reserva";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";
import { useAuth } from "../contexts/useAuth";
import { ReservasGetByUsuario } from "../servicies/API_Reserva";
import "./historial_reserva.css";

function HistorialReservaSkeleton() {
  return (
    <>
      <div className="historial-title-skeleton" aria-label="Cargando historial">
        <span className="historial-skeleton-line historial-skeleton-title" />
        <span className="historial-skeleton-line historial-skeleton-subtitle" />
      </div>

      <section className="historial-section historial-section--current historial-skeleton-section">
        <div className="historial-section-header">
          <span className="historial-skeleton-line historial-skeleton-kicker" />
          <span className="historial-skeleton-line historial-skeleton-heading" />
        </div>

        <div className="historial-skeleton-card">
          <span className="historial-skeleton-block historial-skeleton-plaza" />
          <div className="historial-skeleton-card-info">
            <span className="historial-skeleton-line historial-skeleton-card-title" />
            <span className="historial-skeleton-line historial-skeleton-card-text" />
            <span className="historial-skeleton-line historial-skeleton-card-chip" />
          </div>
          <span className="historial-skeleton-block historial-skeleton-action" />
        </div>
      </section>

      <section className="historial-section historial-section--past">
        <div className="historial-section-header">
          <span className="historial-skeleton-line historial-skeleton-kicker" />
          <span className="historial-skeleton-line historial-skeleton-heading" />
        </div>

        <div className="historial-skeleton-card">
          <span className="historial-skeleton-block historial-skeleton-plaza" />
          <div className="historial-skeleton-card-info">
            <span className="historial-skeleton-line historial-skeleton-card-title historial-skeleton-card-title-short" />
            <span className="historial-skeleton-line historial-skeleton-card-text" />
          </div>
          <span className="historial-skeleton-block historial-skeleton-action" />
        </div>
        <span className="historial-skeleton-block historial-skeleton-toggle" />
      </section>
    </>
  );
}

function HistorialReserva() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [reservasPasadas, setReservasPasadas] = useState([]);
  const [mostrarMasPasadas, setMostrarMasPasadas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const handleReservaClick = (reserva) => {
    setReservaSeleccionada(reserva);
  };

  const handleCopyReserva = (reserva) => {
    const horaInicio = reserva.hora_entrada?.substring(0, 5) || "";
    const horaFin = reserva.hora_salida?.substring(0, 5) || "";
    const idGarage = Number(reserva.id_garage ?? reserva.idGarage ?? reserva.garage_id ?? reserva.garageId) || 0;
    const idVehiculo = Number(reserva.id_vehiculo ?? reserva.idVehiculo ?? reserva.vehiculo_id ?? reserva.vehiculoId) || 0;

    navigate("/nueva_reserva", {
      state: {
        copiaReserva: { horaInicio, horaFin, idGarage, idVehiculo },
      },
    });
  };

  useEffect(() => {
    if (!usuario?.id) return;

    let cancelled = false;

    ReservasGetByUsuario(usuario.id).then((res) => {
      if (cancelled) return;

      const datos = Array.isArray(res?.datos) ? res.datos : [];

      const ahora = new Date();
      const pasadas = datos.filter((r) => {
        if (!r.fecha || !r.hora_salida) return false;
        const salida = new Date(`${r.fecha}T${r.hora_salida}:00`);
        return salida < ahora;
      });

      setUltimaReserva(pasadas[0] || null);
      setReservasPasadas(pasadas.slice(1));
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setUltimaReserva(null);
        setReservasPasadas([]);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [usuario?.id]);

  const reservaPasadaPrincipal = reservasPasadas[0] || null;
  const restoReservasPasadas = reservasPasadas.slice(1);
  const tieneMasReservasPasadas = restoReservasPasadas.length > 0;
  const sinReservas = !loading && !ultimaReserva && reservasPasadas.length === 0;

  return (
    <div className="historial-page">
      <HeaderEmpleado />
      <main className="historial-main">
        {loading ? (
          <HistorialReservaSkeleton />
        ) : (
          <>
            <h1>Historial de Reservas</h1>
            <p>Tus estacionamientos registrados.</p>

            <section className="historial-section historial-section--current">
              <div className="historial-section-header">
                <span>Resumen</span>
                <h2>Ultima reserva</h2>
              </div>

              {sinReservas ? (
                <div className="historial-empty-note">
                  No tenes reservas en tu historial.
                </div>
              ) : ultimaReserva ? (
                <TarjetaReserva reserva={ultimaReserva} variant="historyPast" onClick={handleReservaClick} onCopy={handleCopyReserva} />
              ) : null}
            </section>

            {reservasPasadas.length > 0 && (
              <section className="historial-section historial-section--past">
                <div className="historial-section-header">
                  <span>Actividad</span>
                  <h2>Reservas pasadas</h2>
                </div>

                {reservaPasadaPrincipal && (
                  <TarjetaReserva
                    key={reservaPasadaPrincipal.id_reserva}
                    reserva={reservaPasadaPrincipal}
                    variant="historyPast"
                    onClick={handleReservaClick}
                    onCopy={handleCopyReserva}
                  />
                )}

                {tieneMasReservasPasadas && (
                  <button
                    type="button"
                    className={`historial-toggle${mostrarMasPasadas ? " historial-toggle--open" : ""}`}
                    onClick={() => setMostrarMasPasadas((prev) => !prev)}
                    aria-expanded={mostrarMasPasadas}
                  >
                    <span>{mostrarMasPasadas ? "Mostrar menos" : `Mostrar mas (${restoReservasPasadas.length})`}</span>
                    <span className="historial-toggle-arrow" aria-hidden="true">&gt;</span>
                  </button>
                )}

                <div className={`historial-rest${mostrarMasPasadas ? " historial-rest--open" : ""}`}>
                  {restoReservasPasadas.map((reserva) => (
                    <TarjetaReserva
                      key={reserva.id_reserva}
                      reserva={reserva}
                      variant="historyPast"
                      onClick={handleReservaClick}
                      onCopy={handleCopyReserva}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <FooterEmpleado />

      {reservaSeleccionada && (
        <ModalDetalleReserva
          reserva={reservaSeleccionada}
          onClose={() => setReservaSeleccionada(null)}
          onCopy={handleCopyReserva}
        />
      )}
    </div>
  );
}

export default HistorialReserva;
