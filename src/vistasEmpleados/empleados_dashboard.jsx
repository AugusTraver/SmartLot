import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./empleados_dashboard.css";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import { ReservasGetAll } from "../servicies/API_Reserva";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import { GaragesGetAll } from "../servicies/API_Garage";
import { UsuariosGetById } from "../servicies/API_Usuario";
import { useAuth } from "../contexts/useAuth";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";

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

const obtenerIdUsuario = (usuario) => usuario?.id ?? usuario?.id_usuario ?? usuario?._id;
const obtenerIdVehiculo = (vehiculo) => vehiculo?.id ?? vehiculo?.id_vehiculo ?? vehiculo?._id;
const obtenerIdGarage = (item) => item?.id_garage ?? item?.idGarage ?? item?.garage_id ?? item?.garageId ?? item?.garage?.id_garage ?? item?.garage?.id ?? item?.id;

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

const normalizarReserva = (reserva, vehiculosPorId, garageUsuario) => {
  const idVehiculo = obtenerCampo(reserva, ["id_vehiculo", "idVehiculo", "vehiculo_id", "vehiculoId"]);
  const vehiculo = vehiculosPorId.get(Number(idVehiculo));
  const patente = obtenerCampo(vehiculo, ["patente", "placa", "matricula"]);
  const fecha = obtenerCampo(reserva, ["fecha", "fecha_reserva", "fechaReserva"]);
  const horaInicio = obtenerCampo(reserva, ["horaInicio", "hora_inicio", "desde", "inicio"], "--:--");
  const horaFin = obtenerCampo(reserva, ["horaFin", "hora_fin", "hasta", "fin"], "--:--");
  const ubicacion = obtenerCampo(reserva, ["ubicacion", "sede", "nombre_sede", "garage_nombre"], "") ||
    obtenerCampo(garageUsuario, ["nombre", "descripcion"], "Garage asignado");

  return {
    id: reserva.id ?? reserva.id_reserva ?? `${fecha}-${idVehiculo}-${horaInicio}`,
    fecha,
    fechaLabel: formatearFecha(fecha),
    horario: `${horaInicio} - ${horaFin}`,
    ubicacion,
    plaza: obtenerCampo(reserva, ["plaza", "nro_plaza", "numero_plaza", "espacio"], patente || "Auto"),
    nivel: obtenerCampo(reserva, ["nivel", "piso", "sector", "zona"], "Reserva"),
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
  const [vehiculos, setVehiculos] = useState([]);
  const [garageUsuario, setGarageUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarTodas, setMostrarTodas] = useState(false);

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

        if (usuarioResponse.respuesta) {
          setPerfilUsuario(obtenerObjeto(usuarioResponse.datos));
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
        const idGarageUsuario = Number(obtenerIdGarage(usuario));
        const garageEncontrado = garages.find((garage) => Number(obtenerIdGarage(garage)) === idGarageUsuario) ?? garages[0] ?? null;

        setVehiculos(vehiculosDelUsuario);
        setGarageUsuario(garageEncontrado);
        setReservas(reservasDelUsuario);

        if (!reservasResponse.respuesta || !vehiculosResponse.respuesta) {
          setError("No se pudieron cargar todos tus datos.");
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

  const reservasNormalizadas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return reservas
      .map((reserva) => normalizarReserva(reserva, vehiculosPorId, garageUsuario))
      .filter((reserva) => {
        if (!reserva.fecha) return true;
        const fecha = new Date(`${reserva.fecha}T00:00:00`);
        return Number.isNaN(fecha.getTime()) || fecha >= hoy;
      })
      .sort((a, b) => `${a.fecha} ${a.horario}`.localeCompare(`${b.fecha} ${b.horario}`));
  }, [reservas, vehiculosPorId, garageUsuario]);

  const reservasVisibles = mostrarTodas ? reservasNormalizadas : reservasNormalizadas.slice(0, 3);
  const totalCapacidad = Number(garageUsuario?.capacidad_reservas || 0) + Number(garageUsuario?.capacidad_para_no_reservas || 0);
  const ocupacion = Number(garageUsuario?.ocupacion_reservas || 0) + Number(garageUsuario?.ocupacion_no_reservas || 0);
  const plazasLibres = totalCapacidad > 0 ? Math.max(totalCapacidad - ocupacion, 0) : null;
  const porcentajeOcupacion = totalCapacidad > 0 ? Math.round((ocupacion / totalCapacidad) * 100) : null;
  const nombre = obtenerNombreUsuario(perfilUsuario || usuario);

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
                <div className="empleado-parking-icon">P</div>
                <span className="empleado-live-badge">EN VIVO</span>
              </div>

              <p className="empleado-disponibilidad-text">
                Disponibilidad en tiempo real
              </p>

              <div className="empleado-plazas-libres">
                <strong>{plazasLibres ?? "--"}</strong>
                <span>Plazas Libres</span>
              </div>

              <p className="empleado-companeros">
                {porcentajeOcupacion === null ? "Disponibilidad pendiente de asignacion" : `${porcentajeOcupacion}% de ocupacion actual`}
              </p>

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
            <TarjetaReserva key={reserva.id} reserva={reserva} />
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
    </div>
  );
}

export default EmpleadoDashboard;
