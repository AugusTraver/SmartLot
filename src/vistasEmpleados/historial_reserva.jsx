import { useEffect, useState } from "react";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";
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
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [reservasPasadas, setReservasPasadas] = useState([]);
  const [mostrarMasPasadas, setMostrarMasPasadas] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = window.setTimeout(() => {
      // Simulacion de datos que vendrian del backend.
      const reservaActual = {
        fecha: new Date().toISOString().split("T")[0],
        nombre_zona: "Nivel 2",
        nro_plaza: "B-12",
        nombre_garage: "Oficinas Centrales",
        hora_entrada: "09:00",
        hora_salida: "18:00",
        estado: "Finalizada",
      };

      const reservasPasadas = [
        {
          id_reserva: 2,
          fecha: "2026-06-15",
          nombre_zona: "Nivel 1",
          nro_plaza: "A-08",
          nombre_garage: "Torre Corporativa",
          hora_entrada: "09:00",
          hora_salida: "18:30",
          estado: "Completada",
          entrada: true,
          salida: true,
        },
        {
          id_reserva: 3,
          fecha: "2026-06-08",
          nombre_zona: "Nivel 3",
          nro_plaza: "C-04",
          nombre_garage: "Oficinas Centrales",
          hora_entrada: "08:30",
          hora_salida: "17:00",
          estado: "Cancelada",
          borrado: true,
        },
      ];

      setUltimaReserva(reservaActual);
      setReservasPasadas(reservasPasadas);
      setLoading(false);
    }, 700);

    return () => window.clearTimeout(timer); // le pone un tiempo de carga hardcodeado 
  }, []);

  const reservaPasadaPrincipal = reservasPasadas[0] || null; 
  const restoReservasPasadas = reservasPasadas.slice(1); 
  const tieneMasReservasPasadas = restoReservasPasadas.length > 0; 

  return (
    <div className="historial-page">
      <HeaderEmpleado />
      <main className="historial-main">
        {loading ? (
          <HistorialReservaSkeleton />
        ) : (
          <>
            <h1>Historial de Reservas</h1>
            <p>Gestiona tus estacionamientos pasados y proximos.</p>

            <section className="historial-section historial-section--current">
              <div className="historial-section-header">
                <span>Resumen</span>
                <h2>Ultima reserva</h2>
              </div>

              {ultimaReserva && (
                <TarjetaReserva reserva={ultimaReserva} />
              )}
            </section>
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
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <FooterEmpleado />
    </div>
  );
}

export default HistorialReserva;
