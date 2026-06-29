import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import ModalDetalleReserva from "../componentesEmpleado/modal_detalle_reserva";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";
import { useAuth } from "../contexts/useAuth";
import { ReservasGetByUsuario } from "../servicies/API_Reserva";
import "./historial_reserva.css";

const obtenerCampo = (item, claves, fallback = "") => {
  if (!item || typeof item !== "object") return fallback;
  for (const clave of claves) {
    const valor = item[clave];
    if (valor !== undefined && valor !== null && valor !== "") return valor;
  }
  return fallback;
};

const normalizarFechaHora = (valor) => {
  if (!valor) return null;
  const texto = String(valor).trim().replace(" ", "T");
  const fecha = new Date(texto);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const extraerFecha = (valor) => {
  if (!valor) return "";
  return String(valor).trim().split(/[T ]/)[0] || "";
};

const extraerHora = (valor) => {
  if (!valor) return "";
  const partes = String(valor).trim().split(/[T ]/);
  const hora = partes.length > 1 ? partes[1] : partes[0];
  return hora ? hora.substring(0, 5) : "";
};

const obtenerIdUsuario = (usuario) =>
  usuario?.id ?? usuario?.id_usuario ?? usuario?.idUsuario ?? usuario?.usuario_id ?? usuario?.usuarioId;

const obtenerSalidaReserva = (reserva) => {
  const fechaSalidaCompleta = obtenerCampo(reserva, [
    "fecha_salida",
    "fechaSalida",
    "fecha_finalizacion",
    "fechaFinalizacion",
    "fecha_fin",
    "fechaFin",
  ]);

  const salidaDesdeCompleta = normalizarFechaHora(fechaSalidaCompleta);
  if (salidaDesdeCompleta) return salidaDesdeCompleta;

  const fecha = obtenerCampo(reserva, ["fecha", "fecha_reserva", "fechaReserva"]);
  const horaSalida = obtenerCampo(reserva, ["hora_salida", "horaSalida", "hora_fin", "horaFin"]);
  return normalizarFechaHora(fecha && horaSalida ? `${fecha}T${horaSalida}` : "");
};

const normalizarReservaHistorial = (reserva) => {
  const fechaEntrada = obtenerCampo(reserva, ["fecha_entrada", "fechaEntrada", "fecha_inicio", "fechaInicio"]);
  const fechaSalida = obtenerCampo(reserva, [
    "fecha_salida",
    "fechaSalida",
    "fecha_finalizacion",
    "fechaFinalizacion",
    "fecha_fin",
    "fechaFin",
  ]);
  const fecha = obtenerCampo(reserva, ["fecha", "fecha_reserva", "fechaReserva"], extraerFecha(fechaEntrada || fechaSalida));

  return {
    ...reserva,
    fecha,
    hora_entrada: obtenerCampo(reserva, ["hora_entrada", "horaEntrada", "hora_inicio", "horaInicio"], extraerHora(fechaEntrada)),
    hora_salida: obtenerCampo(reserva, ["hora_salida", "horaSalida", "hora_fin", "horaFin"], extraerHora(fechaSalida)),
  };
};

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
  const idUsuario = obtenerIdUsuario(usuario);
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
    if (!idUsuario) {
      setUltimaReserva(null);
      setReservasPasadas([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    ReservasGetByUsuario(idUsuario, { force: true }).then((res) => {
      if (cancelled) return;

      const datos = Array.isArray(res?.datos) ? res.datos : [];

      const ahora = new Date();
      const pasadas = datos
        .map((reserva) => {
          const salida = obtenerSalidaReserva(reserva);
          return salida ? { reserva: normalizarReservaHistorial(reserva), salida } : null;
        })
        .filter((item) => item && item.salida < ahora)
        .sort((a, b) => b.salida.getTime() - a.salida.getTime())
        .map((item) => item.reserva);

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
  }, [idUsuario]);

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
