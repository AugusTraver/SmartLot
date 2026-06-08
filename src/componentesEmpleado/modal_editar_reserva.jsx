import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Z_INDEX } from "../helpers/zIndex";
import { ReservasUpdate, ReservasCancel } from "../servicies/API_Reserva";
import ModalPortal from "../componentesCompartidos/ModalPortal";
import "./modal_editar_reserva.css";

const obtenerCampo = (item, claves, fallback = "") => {
  const clave = claves.find((key) => item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "");
  return clave ? item[clave] : fallback;
};

const extraerFecha = (reserva) => {
  const fechaEntrada = obtenerCampo(reserva, ["fecha_entrada", "fechaEntrada"]);
  if (fechaEntrada) return fechaEntrada.split(" ")[0] || fechaEntrada.split("T")[0];
  return obtenerCampo(reserva, ["fecha", "fecha_reserva", "fechaReserva"], "");
};

const extraerHora = (reserva, tipo) => {
  const clavesEntrada = tipo === "entrada"
    ? ["horaInicio", "hora_inicio", "desde", "inicio"]
    : ["horaFin", "hora_fin", "hasta", "fin"];
  const campoFecha = tipo === "entrada" ? "fecha_entrada" : "fecha_salida";
  const fechaVal = obtenerCampo(reserva, [campoFecha, campoFecha === "fecha_entrada" ? "fechaEntrada" : "fechaSalida"]);
  const desdeDatetime = fechaVal?.split(" ")?.[1]?.slice(0, 5) || fechaVal?.split("T")?.[1]?.slice(0, 5);
  return obtenerCampo(reserva, clavesEntrada, desdeDatetime || "--:--");
};

function ModalEditarReserva({ reservaRaw, reservaNorm, onClose, onActualizada, onEliminada }) {
  const fechaBase = extraerFecha(reservaRaw);
  const [horaInicio, setHoraInicio] = useState(() => extraerHora(reservaRaw, "entrada"));
  const [horaFin, setHoraFin] = useState(() => extraerHora(reservaRaw, "salida"));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleGuardar = useCallback(async () => {
    if (!horaInicio || !horaFin) {
      setError("Completa ambas horas.");
      return;
    }
    if (horaInicio >= horaFin) {
      setError("La hora de fin debe ser posterior a la de inicio.");
      return;
    }

    setGuardando(true);
    setError("");

    const idReserva = Number(reservaRaw.id ?? reservaRaw.id_reserva);
    const idUsuario = Number(obtenerCampo(reservaRaw, ["id_usuario", "idUsuario", "usuario_id", "usuarioId"]));
    const idVehiculo = Number(obtenerCampo(reservaRaw, ["id_vehiculo", "idVehiculo", "vehiculo_id", "vehiculoId"]));
    const idGarage = Number(obtenerCampo(reservaRaw, ["id_garage", "idGarage", "garage_id", "garageId"]));

    const payload = {
      fecha_entrada: `${fechaBase} ${horaInicio}:00`,
      fecha_salida: `${fechaBase} ${horaFin}:00`,
      id_usuario: idUsuario,
      id_vehiculo: idVehiculo,
      id_garage: idGarage,
      idUsuario,
      idVehiculo,
      idGarage,
    };

    const resultado = await ReservasUpdate(idReserva, payload);

    setGuardando(false);

    if (resultado.respuesta) {
      const actualizada = {
        ...reservaRaw,
        ...resultado.datos,
        fecha_entrada: payload.fecha_entrada,
        fecha_salida: payload.fecha_salida,
      };
      onActualizada(actualizada);
    } else {
      setError("No se pudo actualizar la reserva. Intenta de nuevo.");
    }
  }, [horaInicio, horaFin, fechaBase, reservaRaw, onActualizada]);

  const handleEliminar = useCallback(async () => {
    onClose();

    const confirmacion = await Swal.fire({
      title: "Cancelar reserva",
      text: "Esta accion no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "Volver",
      zIndex: Z_INDEX.SWAL_DIALOG,
    });

    if (!confirmacion.isConfirmed) return;

    const idReserva = Number(reservaRaw.id ?? reservaRaw.id_reserva);
    const resultado = await ReservasCancel(idReserva);

    if (resultado.respuesta) {
      Swal.fire({
        icon: "success",
        title: "Reserva cancelada",
        text: "La reserva fue eliminada correctamente.",
        timer: 1500,
        showConfirmButton: false,
        zIndex: Z_INDEX.SWAL_DIALOG,
      });
      onEliminada(idReserva);
    } else {
      setError("No se pudo cancelar la reserva. Intenta de nuevo.");
    }
  }, [reservaRaw, onEliminada]);

  const fechaFormateada = reservaNorm?.fecha
    ? new Date(reservaNorm.fecha).toLocaleDateString("es-AR", { timeZone: "UTC" })
    : fechaBase;

  return (
    <ModalPortal onClose={onClose}>
      <div className="modal-reserva-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-reserva-header">
          <h2>Detalle de reserva</h2>
          <button type="button" className="modal-reserva-close" onClick={onClose} aria-label="Cerrar">
            &#x2715;
          </button>
        </div>

        <div className="modal-reserva-body">
          <div className="modal-reserva-field">
            <span className="modal-reserva-field-label">Fecha</span>
            <span className="modal-reserva-field-value">{fechaFormateada}</span>
          </div>

          <div className="modal-reserva-field">
            <span className="modal-reserva-field-label">Garage</span>
            <span className="modal-reserva-field-value">{reservaNorm?.nombre_garage || "—"}</span>
          </div>

          <div className="modal-reserva-field">
            <span className="modal-reserva-field-label">Plaza</span>
            <span className="modal-reserva-field-value">{reservaNorm?.nro_plaza || "—"} &middot; {reservaNorm?.nombre_zona || "Sector"}</span>
          </div>

          <div className="modal-reserva-field">
            <span className="modal-reserva-field-label">Vehiculo</span>
            <span className="modal-reserva-field-value">{reservaNorm?.plaza || "—"}</span>
          </div>

          <div className="modal-reserva-divider" />

          <p className="modal-reserva-times-title">Modificar horario</p>

          <div className="modal-reserva-time-row">
            <div className="modal-reserva-time-group">
              <label htmlFor="modal-hora-inicio">Hora inicio</label>
              <input
                id="modal-hora-inicio"
                type="time"
                className="modal-reserva-time-input"
                value={horaInicio === "--:--" ? "" : horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
            <div className="modal-reserva-time-group">
              <label htmlFor="modal-hora-fin">Hora fin</label>
              <input
                id="modal-hora-fin"
                type="time"
                className="modal-reserva-time-input"
                value={horaFin === "--:--" ? "" : horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="modal-reserva-error" role="alert">{error}</p>}
        </div>

        <div className="modal-reserva-footer">
          <button
            type="button"
            className="modal-reserva-btn-guardar"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            className="modal-reserva-btn-cancelar"
            onClick={handleEliminar}
          >
            Cancelar reserva
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

export default ModalEditarReserva;
