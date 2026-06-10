import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./empleados_dashboard.css";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import ModalEditarReserva from "../componentesEmpleado/modal_editar_reserva";
import { ReservasGetAll } from "../servicies/API_Reserva";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import { GaragesGetAll } from "../servicies/API_Garage";
import { UsuariosGetById } from "../servicies/API_Usuario";
import { useAuth } from "../contexts/useAuth";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";

const GARAGE_DASHBOARD_STORAGE_KEY = "smartlot_empleado_dashboard_garage";

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.reservas)) return datos.reservas;
  if (Array.isArray(datos?.vehiculos)) return datos.vehiculos;
  if (Array.isArray(datos?.garages)) return datos.garages;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const obtenerIdUsuario = (usuario) =>
  usuario?.id ??
  usuario?.id_usuario ??
  usuario?.idUsuario ??
  usuario?._id ??
  usuario?.usuario?.id_usuario ??
  usuario?.usuario?.idUsuario ??
  usuario?.usuario?.id ??
  usuario?.datos?.id_usuario ??
  usuario?.datos?.idUsuario ??
  usuario?.datos?.id;
const obtenerIdVehiculo = (vehiculo) => vehiculo?.id ?? vehiculo?.id_vehiculo ?? vehiculo?._id;
const obtenerIdGarage = (item) => item?.id_garage ?? item?.idGarage ?? item?.garage_id ?? item?.garageId ?? item?.garage?.id_garage ?? item?.garage?.id ?? item?.id;
const obtenerIdGarageAsignado = (item) =>
  item?.id_garage ??
  item?.idGarage ??
  item?.garage_id ??
  item?.garageId ??
  item?.garage?.id_garage ??
  item?.garage?.idGarage ??
  item?.garage?.id;
const obtenerIdSedeUsuario = (item) =>
  item?.id_sede ??
  item?.idSede ??
  item?.sede_id ??
  item?.sedeId ??
  item?.sede?.id ??
  item?.sede?.id_sede ??
  item?.usuario?.id_sede ??
  item?.usuario?.idSede ??
  item?.datos?.id_sede ??
  item?.datos?.idSede;

const obtenerIdSedeGarage = (garage) =>
  garage?.id_sede ??
  garage?.idSede ??
  garage?.sede_id ??
  garage?.sedeId ??
  garage?.sede?.id ??
  garage?.sede?.id_sede;

const obtenerObjeto = (datos) => {
  if (!datos || Array.isArray(datos)) return null;
  return datos.usuario ?? datos.datos ?? datos.data ?? datos;
};

const esNombreGenerico = (valor) => {
  const normalizado = String(valor || "").trim().toLowerCase();
  return ["empleado", "admin", "administrador", "garagista", "usuario"].includes(normalizado);
};

const obtenerNombreUsuario = (usuario) => {
  const nombre = esNombreGenerico(usuario?.nombre) ? "" : usuario?.nombre;
  const nombreCompleto = [nombre, usuario?.apellido].filter(Boolean).join(" ").trim();
  const identificador =
    nombreCompleto ||
    usuario?.nombre_usuario ||
    usuario?.nombreUsuario ||
    usuario?.username ||
    usuario?.email?.split("@")[0];

  return identificador || "";
};

const obtenerCampo = (item, claves, fallback = "") => {
  const clave = claves.find((key) => item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "");
  return clave ? item[clave] : fallback;
};

const obtenerNombreGarage = (garage) =>
  garage
    ? obtenerCampo(garage, ["nombre", "descripcion", "nombre_garage", "garage_nombre"], `Garage ${obtenerIdGarage(garage) || ""}`.trim())
    : "";

const esMismaFecha = (fechaA, fechaB) =>
  fechaA.getFullYear() === fechaB.getFullYear() &&
  fechaA.getMonth() === fechaB.getMonth() &&
  fechaA.getDate() === fechaB.getDate();

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";
  const fechaReserva = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(fechaReserva.getTime())) return fecha;

  const hoy = new Date();
  const manana = new Date();
  manana.setDate(hoy.getDate() + 1);

  if (esMismaFecha(fechaReserva, hoy)) return "Hoy";
  if (esMismaFecha(fechaReserva, manana)) return "Manana";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(fechaReserva);
};

const extraerFechaStr = (datetime) => {
  if (!datetime) return "";
  const conEspacio = datetime.split(" ");
  if (conEspacio.length > 1) return conEspacio[0];
  return datetime.split("T")[0];
};

const extraerHoraLocal = (fechaStr) => {
  if (!fechaStr) return "--:--";
  if (fechaStr.includes("T")) {
    const tieneTz = /[Z+\-]\d{2}:/.test(fechaStr);
    const normalizada = tieneTz ? fechaStr : fechaStr + "Z";
    const fecha = new Date(normalizada);
    if (!isNaN(fecha.getTime())) {
      return `${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`;
    }
  }
  const partes = fechaStr.split(" ");
  if (partes.length > 1) return partes[1].slice(0, 5);
  return "--:--";
};

const normalizarReserva = (reserva, vehiculosPorId, garagesPorId) => {
  const idVehiculo = obtenerCampo(reserva, ["id_vehiculo", "idVehiculo", "vehiculo_id", "vehiculoId"]);
  const idGarage = obtenerIdGarageAsignado(reserva);
  const vehiculo = vehiculosPorId.get(Number(idVehiculo));
  const garageReserva = garagesPorId.get(Number(idGarage));
  const patente = obtenerCampo(vehiculo, ["patente", "placa", "matricula"]);
  const fechaEntrada = obtenerCampo(reserva, ["fecha_entrada", "fechaEntrada"]);
  const fechaSalida = obtenerCampo(reserva, ["fecha_salida", "fechaSalida"]);
  const fecha = obtenerCampo(reserva, ["fecha", "fecha_reserva", "fechaReserva"], extraerFechaStr(fechaEntrada));
  const horaInicio = obtenerCampo(reserva, ["horaInicio", "hora_inicio", "desde", "inicio"], extraerHoraLocal(fechaEntrada));
  const horaFin = obtenerCampo(reserva, ["horaFin", "hora_fin", "hasta", "fin"], extraerHoraLocal(fechaSalida));
  const ubicacion = obtenerCampo(reserva, ["ubicacion", "sede", "nombre_sede", "garage_nombre"], "") ||
    obtenerNombreGarage(garageReserva) ||
    "Garage asignado";

  const plaza = obtenerCampo(reserva, ["plaza", "nro_plaza", "numero_plaza", "espacio"], patente || "Auto");
  const zona = obtenerCampo(reserva, ["nombre_zona", "nivel", "piso", "sector", "zona"], "Reserva");

  return {
    id: reserva.id ?? reserva.id_reserva ?? `${fecha}-${idVehiculo}-${horaInicio}`,
    fecha,
    fechaLabel: formatearFecha(fecha),
    horario: `${horaInicio} - ${horaFin}`,
    ubicacion,
    plaza,
    nivel: zona,
    nombre_garage: ubicacion,
    nro_plaza: plaza,
    nombre_zona: zona,
    hora_entrada: horaInicio,
    hora_salida: horaFin,
  };
};

const EmpleadoDashboardIntroSkeleton = () => (
  <div className="empleado-dashboard-intro empleado-dashboard-intro-skeleton" aria-label="Cargando datos del empleado">
    <span className="empleado-skeleton-line empleado-skeleton-kicker" />
    <span className="empleado-skeleton-line empleado-skeleton-title" />
    <span className="empleado-skeleton-line empleado-skeleton-subtitle" />
  </div>
);

const EmpleadoDisponibilidadSkeleton = () => (
  <section className="empleado-disponibilidad-card empleado-disponibilidad-skeleton" aria-label="Cargando disponibilidad">
    <div className="empleado-disponibilidad-top">
      <span className="empleado-skeleton-block empleado-skeleton-parking" />
      <span className="empleado-skeleton-block empleado-skeleton-live" />
    </div>
    <span className="empleado-skeleton-line empleado-skeleton-disponibilidad-label" />
    <div className="empleado-skeleton-availability-row">
      <span className="empleado-skeleton-line empleado-skeleton-big-number" />
      <span className="empleado-skeleton-line empleado-skeleton-capacity-label" />
    </div>
    <span className="empleado-skeleton-line empleado-skeleton-occupancy" />
    <div className="empleado-skeleton-metrics">
      <span className="empleado-skeleton-block empleado-skeleton-chip" />
      <span className="empleado-skeleton-block empleado-skeleton-chip empleado-skeleton-chip-short" />
    </div>
  </section>
);

const EmpleadoReservasSkeleton = () => (
  <div className="empleado-reservas-skeleton-list" aria-label="Cargando reservas">
    {Array.from({ length: 1 }).map((_, index) => (
      <section className="empleado-reservas-section" key={index}>
        <article className="empleado-reserva-card empleado-reserva-card-skeleton">
          <span className="empleado-skeleton-block empleado-skeleton-reserva-plaza" />
          <div className="empleado-skeleton-reserva-info">
            <span className="empleado-skeleton-line empleado-skeleton-reserva-title" />
            <span className="empleado-skeleton-line empleado-skeleton-reserva-text" />
          </div>
          <span className="empleado-skeleton-block empleado-skeleton-reserva-action" />
        </article>
      </section>
    ))}
  </div>
);
  
function EmpleadoDashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [todasReservas, setTodasReservas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [garages, setGarages] = useState([]);
  const [garagesSede, setGaragesSede] = useState([]);
  const [garageUsuario, setGarageUsuario] = useState(null);
  const [garageSeleccionadoId, setGarageSeleccionadoId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [reservaNormEditando, setReservaNormEditando] = useState(null);

  useEffect(() => {
    let montado = true;

    const cargarDatosEmpleado = async () => {
      setLoading(true);
      setError("");

      try {
        const idUsuario = Number(obtenerIdUsuario(usuario));
        const [reservasResponse, vehiculosResponse, garagesResponse, usuarioResponse] = await Promise.all([
          ReservasGetAll(),
          VehiculosGetAll(),
          GaragesGetAll(),
          Number.isFinite(idUsuario) ? UsuariosGetById(idUsuario) : Promise.resolve({ respuesta: false, datos: null }),
        ]);

        if (!montado) return;

        const perfilUsuarioApi = usuarioResponse.respuesta ? obtenerObjeto(usuarioResponse.datos) : null;
        const perfilEmpleado = perfilUsuarioApi || usuario;

        if (perfilUsuarioApi) {
          setPerfilUsuario(perfilUsuarioApi);
        }

        const vehiculosApi = vehiculosResponse.respuesta ? obtenerListado(vehiculosResponse.datos) : [];
        const vehiculosDelUsuario = vehiculosApi.filter((vehiculo) => Number(vehiculo.id_usuario ?? vehiculo.idUsuario ?? vehiculo.usuario_id) === idUsuario);
        const idsVehiculos = new Set(vehiculosDelUsuario.map((vehiculo) => Number(obtenerIdVehiculo(vehiculo))));

        const reservasApi = reservasResponse.respuesta ? obtenerListado(reservasResponse.datos) : [];
        const reservasDelUsuario = reservasApi.filter((reserva) => {
          const reservaUsuarioId = Number(reserva.id_usuario ?? reserva.idUsuario ?? reserva.usuario_id);
          const reservaVehiculoId = Number(reserva.id_vehiculo ?? reserva.idVehiculo ?? reserva.vehiculo_id ?? reserva.vehiculoId);
          return reservaUsuarioId === idUsuario || idsVehiculos.has(reservaVehiculoId);
        });

        const garages = garagesResponse.respuesta ? obtenerListado(garagesResponse.datos) : [];
        const idSedeEmpleado = Number(obtenerIdSedeUsuario(perfilEmpleado));
        const garagesDeSede = Number.isFinite(idSedeEmpleado)
          ? garages.filter((garage) => Number(obtenerIdSedeGarage(garage)) === idSedeEmpleado)
          : [];
        const idGarageEmpleado = Number(obtenerIdGarageAsignado(perfilEmpleado));
        const garageGuardadoId = Number(localStorage.getItem(GARAGE_DASHBOARD_STORAGE_KEY));
        const garageEncontrado =
          garagesDeSede.find((garage) => Number(obtenerIdGarage(garage)) === garageGuardadoId) ??
          garagesDeSede.find((garage) => Number(obtenerIdGarage(garage)) === idGarageEmpleado) ??
          garagesDeSede[0] ??
          null;

        setVehiculos(vehiculosDelUsuario);
        setGarages(garages);
        setGaragesSede(garagesDeSede);
        setGarageUsuario(garageEncontrado);
        setGarageSeleccionadoId(garageEncontrado ? String(obtenerIdGarage(garageEncontrado)) : "");
        setReservas(reservasDelUsuario);
        setTodasReservas(reservasApi);

        if (!reservasResponse.respuesta || !vehiculosResponse.respuesta) {
          setError("No se pudieron cargar todos tus datos.");
        } else if (!Number.isFinite(idSedeEmpleado)) {
          setError("No se pudo identificar tu sede.");
        } else if (garagesDeSede.length === 0) {
          setError("No hay garages disponibles para tu sede.");
        }
      } catch (err) {
        console.error("Error al cargar el dashboard de empleado:", err);
        if (montado) setError("Ocurrio un error al cargar tus reservas.");
      } finally {
        if (montado) setLoading(false);
      }
    };

    cargarDatosEmpleado();

    return () => {
      montado = false;
    };
  }, [usuario]);

  const vehiculosPorId = useMemo(
    () => new Map(vehiculos.map((vehiculo) => [Number(obtenerIdVehiculo(vehiculo)), vehiculo])),
    [vehiculos]
  );

  const garagesPorId = useMemo(
    () => new Map(garages.map((garage) => [Number(obtenerIdGarage(garage)), garage])),
    [garages]
  );

  const reservasRawPorId = useMemo(
    () => new Map(reservas.map((r) => [r.id ?? r.id_reserva, r])),
    [reservas]
  );

  const reservasNormalizadas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return reservas
      .map((reserva) => normalizarReserva(reserva, vehiculosPorId, garagesPorId))
      .filter((reserva) => {
        if (!reserva.fecha) return true;
        const fecha = new Date(`${reserva.fecha}T00:00:00`);
        return Number.isNaN(fecha.getTime()) || fecha >= hoy;
      })
      .sort((a, b) => `${a.fecha} ${a.horario}`.localeCompare(`${b.fecha} ${b.horario}`));
  }, [reservas, vehiculosPorId, garagesPorId]);

  const reservasVisibles = mostrarTodas ? reservasNormalizadas : reservasNormalizadas.slice(0, 3);
  const capacidadReservas = Number(garageUsuario?.capacidad_reservas || 0);
  const capacidadNoReservas = Number(garageUsuario?.capacidad_para_no_reservas || 0);
  const ocupacionReservas = Number(garageUsuario?.ocupacion_reservas || 0);
  const ocupacionNoReservas = Number(garageUsuario?.ocupacion_no_reservas || 0);
  const totalCapacidad = capacidadReservas + capacidadNoReservas;
  const ocupacion = ocupacionReservas + ocupacionNoReservas;
  const plazasLibres = totalCapacidad > 0 ? Math.max(totalCapacidad - ocupacion, 0) : null;
  const porcentajeOcupacion = totalCapacidad > 0 ? Math.round((ocupacion / totalCapacidad) * 100) : null;
  const pctReservas = capacidadReservas > 0 ? Math.round((ocupacionReservas / capacidadReservas) * 100) : 0;
  const pctNoReservas = capacidadNoReservas > 0 ? Math.round((ocupacionNoReservas / capacidadNoReservas) * 100) : 0;
  const libresReservas = capacidadReservas > 0 ? Math.max(capacidadReservas - ocupacionReservas, 0) : null;
  const libresNoReservas = capacidadNoReservas > 0 ? Math.max(capacidadNoReservas - ocupacionNoReservas, 0) : null;

  const reservasDelGarage = useMemo(() => {
    if (!garageSeleccionadoId) return 0;
    const idGarageNum = Number(garageSeleccionadoId);
    return todasReservas.filter((r) => Number(obtenerIdGarageAsignado(r)) === idGarageNum).length;
  }, [todasReservas, garageSeleccionadoId]);
  const capacidadReservasDisponible = Math.max(capacidadReservas - reservasDelGarage, 0);
  const nombre = obtenerNombreUsuario(perfilUsuario || usuario);

  const handleGarageDashboardChange = (event) => {
    const nuevoId = event.target.value;
    const garageSeleccionado = garagesSede.find((garage) => String(obtenerIdGarage(garage)) === nuevoId) ?? null;

    setGarageSeleccionadoId(nuevoId);
    setGarageUsuario(garageSeleccionado);
    localStorage.setItem(GARAGE_DASHBOARD_STORAGE_KEY, nuevoId);
  };

  const handleReservaClick = (reservaNorm) => {
    const raw = reservasRawPorId.get(reservaNorm.id);
    if (raw) {
      setReservaEditando(raw);
      setReservaNormEditando(reservaNorm);
    }
  };

  const handleReservaActualizada = (reservaActualizada) => {
    setReservas((prev) =>
      prev.map((r) => {
        const id = r.id ?? r.id_reserva;
        return Number(id) === Number(reservaActualizada.id ?? reservaActualizada.id_reserva)
          ? reservaActualizada
          : r;
      })
    );
    setReservaEditando(null);
    setReservaNormEditando(null);
  };

  const handleReservaEliminada = (idReserva) => {
    setReservas((prev) =>
      prev.filter((r) => {
        const id = r.id ?? r.id_reserva;
        return Number(id) !== Number(idReserva);
      })
    );
    setReservaEditando(null);
    setReservaNormEditando(null);
  };

  return (
    <div className="empleado-dashboard-page">
      <HeaderEmpleado />
      <main className="empleado-dashboard-main">
        {loading ? (
          <>
            <EmpleadoDashboardIntroSkeleton />
            <EmpleadoDisponibilidadSkeleton />
          </>
        ) : (
          <>
            <div className="empleado-dashboard-intro">
              <span className="empleado-dashboard-kicker">Hoy</span>
              <h1 className="empleado-dashboard-title">
                Hola{nombre ? ` ${nombre}` : ""}
              </h1>
              <p className="empleado-dashboard-subtitle">
                Tu reserva y disponibilidad del estacionamiento.
              </p>
            </div>

            <section className="empleado-disponibilidad-card">
              <div className="empleado-disponibilidad-top">
                <div className="empleado-parking-icon">
                  <img src="/logo.png" alt="Logo" className="empleado-parking-logo" />
                </div>
                <span className="empleado-live-badge">EN VIVO</span>
              </div>

              <p className="empleado-disponibilidad-text">
                Disponibilidad en tiempo real
              </p>

              {garagesSede.length > 1 && (
                <label className="empleado-garage-selector">
                  <span>Garage</span>
                  <select value={garageSeleccionadoId} onChange={handleGarageDashboardChange}>
                    {garagesSede.map((garage) => {
                      const id = obtenerIdGarage(garage);
                      return (
                        <option key={id} value={id}>
                          {obtenerNombreGarage(garage)}
                        </option>
                      );
                    })}
                  </select>
                </label>
              )}

              <div className="empleado-plazas-libres">
                <strong>{ocupacion}</strong>
                <span>Ocupacion</span>
              </div>

              <p className="empleado-companeros">
                {porcentajeOcupacion === null ? "Disponibilidad pendiente de asignacion" : `${porcentajeOcupacion}% de ocupacion actual`}
              </p>

              {(capacidadReservas > 0 || capacidadNoReservas > 0) && (
                <div className="empleado-capacidad-split">
                  <div className="empleado-capacidad-item">
                    <span className="empleado-capacidad-item-label">Reservas</span>
                    <span className="empleado-capacidad-item-number">
                      {capacidadReservasDisponible} <small>/ {capacidadReservas}</small>
                    </span>
                    {capacidadReservas > 0 && (
                      <div className="empleado-capacidad-item-bar">
                        <div
                          className={`empleado-capacidad-item-bar-fill${pctReservas >= 75 ? " alta" : pctReservas >= 50 ? " media" : ""}`}
                          style={{ width: `${pctReservas}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="empleado-capacidad-item">
                    <span className="empleado-capacidad-item-label">No Reservas</span>
                    <span className="empleado-capacidad-item-number">
                      {libresNoReservas ?? "--"} <small>/ {capacidadNoReservas}</small>
                    </span>
                    {capacidadNoReservas > 0 && (
                      <div className="empleado-capacidad-item-bar">
                        <div
                          className={`empleado-capacidad-item-bar-fill${pctNoReservas >= 75 ? " alta" : pctNoReservas >= 50 ? " media" : ""}`}
                          style={{ width: `${pctNoReservas}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="empleado-disponibilidad-metrics">
                <span>{porcentajeOcupacion !== null && porcentajeOcupacion >= 75 ? "Ocupacion alta" : "Ocupacion baja"}</span>
                <span>{vehiculos.length > 0 ? "Acceso habilitado" : "Vehiculo pendiente"}</span>
              </div>
            </section>
          </>
        )}

        <div className="empleado-reservas-header">
          <div>
            <span>Agenda</span>
            <h2>Mis Reservas Actuales</h2>
          </div>
          {reservasNormalizadas.length > 3 && (
            <button type="button" onClick={() => setMostrarTodas((prev) => !prev)}>
              {mostrarTodas ? "Ver menos" : "Ver todas"}
            </button>
          )}
        </div>

        {error && (
          <div className="empleado-dashboard-feedback empleado-dashboard-feedback-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <EmpleadoReservasSkeleton />
        ) : reservasVisibles.length > 0 ? (
          reservasVisibles.map((reserva) => (
            <TarjetaReserva key={reserva.id} reserva={reserva} onClick={handleReservaClick} />
          ))
        ) : (
          <div className="empleado-dashboard-feedback">
            No tenes reservas activas.
          </div>
        )}

        <button
          type="button"
          className="empleado-nueva-reserva-btn"
          onClick={() => navigate("/nueva_reserva")}
        >
          Nueva reserva
        </button>
      </main>
      <FooterEmpleado />

      {reservaEditando && reservaNormEditando && (
        <ModalEditarReserva
          reservaRaw={reservaEditando}
          reservaNorm={reservaNormEditando}
          onClose={() => { setReservaEditando(null); setReservaNormEditando(null); }}
          onActualizada={handleReservaActualizada}
          onEliminada={handleReservaEliminada}
        />
      )}
    </div>
  );
}

export default EmpleadoDashboard;
