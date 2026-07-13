import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  DoorOpen,
  Eye,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { GaragesGetAll, GaragesGetById } from "../servicies/API_Garage";
import { ReservasCheckIn, ReservasCheckOut, ReservasGetAll } from "../servicies/API_Reserva";
import { SedesGetAll } from "../servicies/API_Sede";
import { MarcasGetAll } from "../servicies/API_Marca";
import { ModelosGetAll } from "../servicies/API_Modelo";
import { UsuariosGetAll } from "../servicies/API_Usuario";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import ModalPortal from "../componentesCompartidos/ModalPortal";
import HeaderAdmin from "../componentesAdmin/header_admin";
import FooterAdmin from "../componentesAdmin/footer_admin";
import { useAuth } from "../contexts/useAuth";
import { showToast } from "../helpers/toast";
import "./garagista_dashboard.css";

const normalizarPatente = (valor) =>
  valor
    .trim()
    .replace(/[\s-]/g, "")
    .toUpperCase();

const MENSAJE_INGRESO_ANTICIPADO =
  "No se puede ingresar el vehículo hasta una hora antes del horario pautado de la reserva.";

const MINUTOS_ANTICIPACION_INGRESO = 60;
const SKELETON_CARD_KEYS = ["reserva-1", "reserva-2", "reserva-3"];
const SKELETON_MOVEMENT_KEYS = ["movimiento-1", "movimiento-2", "movimiento-3"];

const obtenerHoraActual = () =>
  new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

const obtenerFechaActual = () =>
  new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

const obtenerFechaISOActual = () =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());

const tieneZonaHoraria = (valor) => /(?:Z|[+-]\d{2}:?\d{2})$/.test(String(valor).trim());

const extraerFecha = (valor) => {
  if (!valor) return "";
  const texto = String(valor);
  if (tieneZonaHoraria(texto)) {
    const fecha = new Date(texto);
    if (!Number.isNaN(fecha.getTime())) {
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(fecha);
    }
  }

  const coincidencia = texto.match(/^\d{4}-\d{2}-\d{2}/);
  if (coincidencia) return coincidencia[0];

  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(fecha);
};

const obtenerFechaReserva = (reserva) => {
  const candidatos = [
    reserva.fecha_entrada,
    reserva.fechaEntrada,
    reserva.fecha,
    reserva.fecha_reserva,
    reserva.fechaReserva,
  ];

  for (const candidato of candidatos) {
    const fecha = extraerFecha(candidato);
    if (fecha) return fecha;
  }
  return "";
};

const obtenerIdGarage = (garage) =>
  garage?.id_garage ?? garage?.idGarage ?? garage?.garage_id ?? garage?.id ?? garage?._id;

const obtenerIdGarageUsuario = (user) =>
  user?.id_garage ?? user?.idGarage ?? user?.garage_id ?? user?.garageId;

const obtenerIdReserva = (reserva) =>
  reserva?.id_reserva ?? reserva?.id ?? reserva?._id;

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.reservas)) return datos.reservas;
  if (Array.isArray(datos?.usuarios)) return datos.usuarios;
  return [];
};

const esValorVerdadero = (valor) => {
  if (valor === true || valor === 1) return true;
  if (valor === false || valor === 0 || valor == null) return false;
  if (typeof valor !== "string") return false;

  const texto = valor.trim().toLowerCase();
  if (!texto || ["false", "0", "no", "null", "undefined"].includes(texto)) return false;
  if (["true", "1", "si", "sí", "completo", "completado"].includes(texto)) return true;
  return !Number.isNaN(new Date(valor).getTime());
};

const normalizarEstadoReserva = (reserva) => {
  const entro = [
    reserva.entrada,
    reserva.ingreso,
    reserva.check_in,
    reserva.checkIn,
    reserva.entro,
    reserva.entrada_registrada,
    reserva.fecha_entrada_real,
  ].some(esValorVerdadero);
  const salio = [
    reserva.salida,
    reserva.egreso,
    reserva.check_out,
    reserva.checkOut,
    reserva.salio,
    reserva.salida_registrada,
    reserva.fecha_salida_real,
  ].some(esValorVerdadero);

  if (salio) return "Finalizado";
  if (entro) return "Dentro";
  return "Pendiente";
};

const extraerHora = (valor) => {
  if (!valor) return null;
  const texto = String(valor).trim();

  if (/^\d{2}:\d{2}/.test(texto)) return texto.slice(0, 5);

  if (tieneZonaHoraria(texto)) {
    const fecha = new Date(texto);
    if (!Number.isNaN(fecha.getTime())) {
      return new Intl.DateTimeFormat("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(fecha);
    }
  }

  if (texto.includes("T")) return texto.split("T")[1]?.slice(0, 5);
  if (texto.includes(" ")) return texto.split(" ")[1]?.slice(0, 5);
  if (texto.includes(":")) return texto.slice(0, 5);
  return null;
};

const obtenerFechaHoraReserva = (reserva) => {
  const fecha = reserva?.fechaReserva;
  const hora = reserva?.horaReserva;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) return null;

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [horas, minutos] = hora.split(":").map(Number);
  const fechaHora = new Date(anio, mes - 1, dia, horas, minutos);

  return Number.isNaN(fechaHora.getTime()) ? null : fechaHora;
};

const obtenerHoraHabilitacionIngreso = (reserva) => {
  const fechaHoraReserva = obtenerFechaHoraReserva(reserva);
  if (!fechaHoraReserva) return null;

  const fechaHabilitacion = new Date(fechaHoraReserva);
  fechaHabilitacion.setMinutes(fechaHabilitacion.getMinutes() - MINUTOS_ANTICIPACION_INGRESO);
  return fechaHabilitacion;
};

const formatearHora = (fecha) =>
  new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(fecha);

const obtenerMensajeIngresoAnticipado = (reserva) => {
  const fechaHabilitacion = obtenerHoraHabilitacionIngreso(reserva);
  if (!fechaHabilitacion) return MENSAJE_INGRESO_ANTICIPADO;

  return `No se puede registrar el ingreso todavia. La entrada del vehiculo se podra efectuar a partir de las ${formatearHora(fechaHabilitacion)}, una hora antes del horario de la reserva.`;
};

function BadgeEstado({ estado }) {
  return (
    <span className={`garagista-status garagista-status--${estado.toLowerCase()}`}>
      {estado}
    </span>
  );
}

function EmptyState({ mensaje }) {
  return <div className="garagista-empty">{mensaje}</div>;
}

function SkeletonLine({ className = "" }) {
  return <span className={`garagista-skeleton-line ${className}`} aria-hidden="true" />;
}

function SkeletonAccessCard() {
  return (
    <article className="access-card access-card--skeleton" aria-hidden="true">
      <div className="access-card__top">
        <div className="garagista-skeleton-stack">
          <SkeletonLine className="garagista-skeleton-line--title" />
          <SkeletonLine className="garagista-skeleton-line--text" />
        </div>
        <SkeletonLine className="garagista-skeleton-line--badge" />
      </div>

      <dl className="access-card__meta">
        <div>
          <SkeletonLine className="garagista-skeleton-line--label" />
          <SkeletonLine className="garagista-skeleton-line--value" />
        </div>
        <div>
          <SkeletonLine className="garagista-skeleton-line--label" />
          <SkeletonLine className="garagista-skeleton-line--value garagista-skeleton-line--short" />
        </div>
      </dl>

      <SkeletonLine className="garagista-skeleton-line--button" />
    </article>
  );
}

function GaragistaDashboardSkeleton() {
  return (
    <div className="garagista-skeleton" role="status" aria-label="Cargando datos del garage">
      <div className="garagista-mobile-tabs garagista-skeleton-tabs" aria-hidden="true">
        <SkeletonLine className="garagista-skeleton-line--tab" />
        <SkeletonLine className="garagista-skeleton-line--tab" />
      </div>

      <div className="garagista-sections-grid">
        {["Ingresos pendientes", "Autos dentro"].map((titulo) => (
          <section className="garagista-section garagista-mobile-panel is-active" key={titulo}>
            <div className="garagista-section-heading" aria-hidden="true">
              <div>
                <SkeletonLine className="garagista-skeleton-line--eyebrow" />
                <SkeletonLine className="garagista-skeleton-line--heading" />
              </div>
              <SkeletonLine className="garagista-skeleton-line--count" />
            </div>

            <div className="garagista-card-list">
              {SKELETON_CARD_KEYS.map((key) => (
                <SkeletonAccessCard key={`${titulo}-${key}`} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="garagista-section garagista-section--movements">
        <div className="garagista-section-heading" aria-hidden="true">
          <div>
            <SkeletonLine className="garagista-skeleton-line--eyebrow" />
            <SkeletonLine className="garagista-skeleton-line--heading" />
          </div>
          <SkeletonLine className="garagista-skeleton-line--count" />
        </div>

        <div className="movements-list" aria-hidden="true">
          {SKELETON_MOVEMENT_KEYS.map((key) => (
            <article className="movement-row movement-row--skeleton" key={key}>
              <div className="garagista-skeleton-stack">
                <SkeletonLine className="garagista-skeleton-line--title" />
                <SkeletonLine className="garagista-skeleton-line--text" />
              </div>
              <SkeletonLine className="garagista-skeleton-line--badge" />
              <SkeletonLine className="garagista-skeleton-line--value" />
              <SkeletonLine className="garagista-skeleton-line--value" />
              <SkeletonLine className="garagista-skeleton-line--value" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function GaragistaDashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [garageData, setGarageData] = useState(null);
  const [garagesDisponibles, setGaragesDisponibles] = useState([]);
  const [garageSeleccionadoId, setGarageSeleccionadoId] = useState(null);
  const [cargandoGaragesAdmin, setCargandoGaragesAdmin] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("todas");
  const [seccionMovil, setSeccionMovil] = useState("pendientes");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [patenteIngresada, setPatenteIngresada] = useState("");
  const [errorVerificacion, setErrorVerificacion] = useState("");
  const [patenteVerificada, setPatenteVerificada] = useState(false);
  const [guardandoAccion, setGuardandoAccion] = useState(false);

  const esAdmin = Number(usuario?.id_rol) === 1;
  const fechaActual = useMemo(() => obtenerFechaActual(), []);
  const fechaISOActual = useMemo(() => obtenerFechaISOActual(), []);
  const idGarageAsignado = useMemo(
    () => esAdmin ? garageSeleccionadoId : Number(obtenerIdGarageUsuario(usuario)) || null,
    [esAdmin, garageSeleccionadoId, usuario]
  );
  const terminoBusqueda = busqueda.trim().toLowerCase();
  const capacidadTotal = useMemo(() => {
    if (!garageData) return 0;
    return Number(garageData.capacidad_reservas || 0) + Number(garageData.capacidad_para_no_reservas || 0);
  }, [garageData]);
  const cargandoVista = idGarageAsignado ? cargando : esAdmin && cargandoGaragesAdmin;
  const errorVista = idGarageAsignado
    ? errorCarga
    : esAdmin
      ? cargandoGaragesAdmin ? "" : "No hay garages disponibles para consultar."
      : "No tenés un garage asignado.";

  useEffect(() => {
    if (!esAdmin) return;

    let cancelado = false;

    const cargarGaragesDelAdmin = async () => {
      setCargandoGaragesAdmin(true);
      try {
        const [garagesResp, sedesResp] = await Promise.all([
          GaragesGetAll(),
          SedesGetAll(),
        ]);
        if (cancelado) return;

        const todosLosGarages = obtenerListado(garagesResp.datos);
        const idSedeAdmin = Number(usuario?.id_sede);
        const idEmpresaAdmin = Number(usuario?.id_empresa);
        let garagesPermitidos = todosLosGarages;

        if (idSedeAdmin > 0) {
          garagesPermitidos = todosLosGarages.filter(
            (garage) => Number(garage.id_sede ?? garage.idSede) === idSedeAdmin
          );
        } else if (idEmpresaAdmin > 0) {
          const idsSedes = new Set(
            obtenerListado(sedesResp.datos)
              .filter((sede) => Number(sede.id_empresa ?? sede.idEmpresa) === idEmpresaAdmin)
              .map((sede) => Number(sede.id_sede ?? sede.id))
          );
          garagesPermitidos = todosLosGarages.filter((garage) =>
            idsSedes.has(Number(garage.id_sede ?? garage.idSede))
          );
        }

        setGaragesDisponibles(garagesPermitidos);
        setGarageSeleccionadoId((actual) => {
          const seleccionValida = actual && garagesPermitidos.some(
            (garage) => Number(obtenerIdGarage(garage)) === actual
          );
          return seleccionValida ? actual : Number(obtenerIdGarage(garagesPermitidos[0])) || null;
        });
      } catch {
        if (!cancelado) {
          setGaragesDisponibles([]);
          setGarageSeleccionadoId(null);
        }
      } finally {
        if (!cancelado) setCargandoGaragesAdmin(false);
      }
    };

    cargarGaragesDelAdmin();
    return () => { cancelado = true; };
  }, [esAdmin, usuario?.id_empresa, usuario?.id_sede]);

  useEffect(() => {
    if (!idGarageAsignado) return;

    let cancelado = false;

    const cargarDatos = async () => {
      setCargando(true);
      setErrorCarga("");

      try {
        const [
          garageResp,
          reservasResp,
          usuariosResp,
          vehiculosResp,
          marcasResp,
          modelosResp,
        ] = await Promise.all([
          GaragesGetById(idGarageAsignado),
          ReservasGetAll({ force: true }),
          UsuariosGetAll(),
          VehiculosGetAll(),
          MarcasGetAll(),
          ModelosGetAll(),
        ]);

        if (cancelado) return;

        const garageRaw = garageResp.respuesta ? garageResp.datos : null;
        const garageCandidates = [garageRaw];
        if (garageRaw?.data) garageCandidates.push(garageRaw.data);
        if (garageRaw?.garage) garageCandidates.push(garageRaw.garage);
        if (Array.isArray(garageRaw)) garageCandidates.push(garageRaw[0]);
        const garage = garageCandidates.find((g) => g && typeof g === "object" && !Array.isArray(g)) || null;

        setGarageData(garage);

        const usuariosLista = obtenerListado(usuariosResp.datos);
        const vehiculosLista = obtenerListado(vehiculosResp.datos);
        const marcasLista = obtenerListado(marcasResp.datos);
        const modelosLista = obtenerListado(modelosResp.datos);
        const marcasMap = new Map(
          marcasLista.map((marca) => [Number(marca.id ?? marca.id_marca ?? marca._id), marca])
        );
        const modelosMap = new Map(
          modelosLista.map((modelo) => [Number(modelo.id ?? modelo.id_modelo ?? modelo._id), modelo])
        );

        const usuariosMap = new Map();
        usuariosLista.forEach((u) => {
          const id = Number(u.id_usuario ?? u.id ?? u._id);
          if (id) {
            const nombre = [u.nombre, u.apellido].filter(Boolean).join(" ") || "Sin nombre";
            usuariosMap.set(id, nombre);
          }
        });

        const vehiculosMap = new Map();
        vehiculosLista.forEach((v) => {
          const id = Number(v.id_vehiculo ?? v.id ?? v._id);
          if (id) {
            const patente = v.patente ?? v.patenteVehiculo ?? "";
            const idModelo = Number(v.id_modelo ?? v.idModelo ?? v.modelo_id);
            const modeloRelacion = modelosMap.get(idModelo);
            const modeloDirecto = typeof v.modelo === "string" && !/^\d+$/.test(v.modelo)
              ? v.modelo
              : v.modelo?.nombre ?? v.modelo?.nombre_modelo ?? "";
            const modelo = v.nombre_modelo
              || modeloDirecto
              || modeloRelacion?.nombre
              || modeloRelacion?.nombre_modelo
              || "";
            const idMarca = Number(
              v.id_marca
              ?? v.idMarca
              ?? modeloRelacion?.id_marca
              ?? modeloRelacion?.idMarca
            );
            const marcaRelacion = marcasMap.get(idMarca);
            const marcaDirecta = typeof v.marca === "string" && !/^\d+$/.test(v.marca)
              ? v.marca
              : v.marca?.nombre ?? v.marca?.nombre_marca ?? "";
            const marca = v.nombre_marca
              || marcaDirecta
              || marcaRelacion?.nombre
              || marcaRelacion?.nombre_marca
              || "";
            const descripcion = [marca, modelo].filter(Boolean).join(" ") || "Vehículo sin marca/modelo";
            vehiculosMap.set(id, { patente, descripcion });
          }
        });

        const todasReservas = obtenerListado(reservasResp.datos);

        const reservasDelGarage = todasReservas
          .filter((r) => {
            const idGarageReserva = Number(
              r.id_garage ?? r.idGarage ?? r.garage_id ?? r.garageId
            );
            return idGarageReserva === idGarageAsignado;
          })
          .map((r) => {
            const idUsuario = Number(r.id_usuario ?? r.idUsuario);
            const idVehiculo = Number(r.id_vehiculo ?? r.idVehiculo);
            const vehiculo = vehiculosMap.get(idVehiculo) || {};
            const estado = normalizarEstadoReserva(r);

            return {
              id: obtenerIdReserva(r),
              conductor: usuariosMap.get(idUsuario) || "Conductor desconocido",
              fechaReserva: obtenerFechaReserva(r),
              horaReserva: extraerHora(r.hora_entrada) ?? extraerHora(r.fecha_entrada) ?? "--:--",
              plaza: r.nro_plaza ?? r.plaza ?? "--",
              vehiculo: vehiculo.descripcion || "Vehículo desconocido",
              patenteInterna: vehiculo.patente || "--",
              estado,
              horaEntrada: extraerHora(r.fecha_entrada_real) ?? extraerHora(r.hora_entrada_real) ?? null,
              horaSalida: extraerHora(r.fecha_salida_real) ?? extraerHora(r.hora_salida_real) ?? null,
              raw: r,
            };
          });

        if (!cancelado) setReservas(reservasDelGarage);
      } catch {
        if (!cancelado) setErrorCarga("No se pudieron cargar los datos del garage.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargarDatos();
    return () => { cancelado = true; };
  }, [idGarageAsignado]);

  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      const coincideFecha = filtroFecha === "todas" || reserva.fechaReserva === fechaISOActual;
      if (!coincideFecha) return false;
      if (!terminoBusqueda) return true;

      const textoVisible = `${reserva.conductor} ${reserva.vehiculo} ${reserva.patenteInterna}`.toLowerCase();
      return textoVisible.includes(terminoBusqueda);
    });
  }, [fechaISOActual, filtroFecha, reservas, terminoBusqueda]);

  const reservasPendientes = reservasFiltradas.filter(
    (reserva) => reserva.estado === "Pendiente"
  );
  const autosDentro = reservasFiltradas.filter((reserva) => reserva.estado === "Dentro");
  const movimientosFinalizados = reservasFiltradas.filter(
    (reserva) => reserva.estado === "Finalizado"
  );
  const cantidadAutosDentro = reservas.filter((reserva) => reserva.estado === "Dentro").length;

  const abrirVerificacion = (reserva) => {
    if (esAdmin) return;
    setReservaSeleccionada(reserva);
    setPatenteIngresada("");
    setErrorVerificacion("");
    setPatenteVerificada(false);
  };

  const cerrarVerificacion = () => {
    setReservaSeleccionada(null);
    setPatenteIngresada("");
    setErrorVerificacion("");
    setPatenteVerificada(false);
  };

  const verificarPatente = (event) => {
    event.preventDefault();
    if (esAdmin || !reservaSeleccionada) return;

    const patenteEscrita = normalizarPatente(patenteIngresada);
    const patenteEsperada = normalizarPatente(reservaSeleccionada.patenteInterna);

    if (patenteEscrita !== patenteEsperada) {
      setErrorVerificacion("La patente ingresada no coincide con la reserva.");
      return;
    }

    setErrorVerificacion("");
    setPatenteVerificada(true);
  };

  const confirmarAcceso = async () => {
    if (esAdmin || guardandoAccion || !reservaSeleccionada || !patenteVerificada) return;

    const horaHabilitacionIngreso = obtenerHoraHabilitacionIngreso(reservaSeleccionada);
    if (horaHabilitacionIngreso && new Date() < horaHabilitacionIngreso) {
      setErrorVerificacion(obtenerMensajeIngresoAnticipado(reservaSeleccionada));
      return;
    }

    setGuardandoAccion(true);
    const horaEntrada = obtenerHoraActual();
    const resultado = await ReservasCheckIn(reservaSeleccionada.id);

    if (resultado.respuesta) {
      setReservas((reservasActuales) =>
        reservasActuales.map((reserva) =>
          reserva.id === reservaSeleccionada.id
            ? {
                ...reserva,
                estado: "Dentro",
                horaEntrada,
                raw: { ...reserva.raw, ...resultado.datos },
              }
            : reserva
        )
      );
      cerrarVerificacion();
      showToast("Ingreso verificado correctamente.", "success");
    } else {
      const mensajeBackend = resultado.datos?.message || "";
      const ingresoTodaviaNoHabilitado = /todav[ií]a no est[aá] habilitad/i.test(mensajeBackend);
      setErrorVerificacion(
        ingresoTodaviaNoHabilitado
          ? obtenerMensajeIngresoAnticipado(reservaSeleccionada)
          : mensajeBackend || "No se pudo registrar el ingreso en el servidor."
      );
    }
    setGuardandoAccion(false);
  };

  const registrarSalida = async (reservaSeleccionadaSalida) => {
    if (esAdmin || guardandoAccion || !reservaSeleccionadaSalida) return;

    setGuardandoAccion(true);
    const horaSalida = obtenerHoraActual();
    const resultado = await ReservasCheckOut(reservaSeleccionadaSalida.id);

    if (resultado.respuesta) {
      setReservas((reservasActuales) =>
        reservasActuales.map((reserva) =>
          reserva.id === reservaSeleccionadaSalida.id
            ? {
                ...reserva,
                estado: "Finalizado",
                horaSalida,
                raw: { ...reserva.raw, ...resultado.datos },
              }
            : reserva
        )
      );
      showToast("Salida registrada correctamente.", "success");
    } else {
      showToast(
        resultado.datos?.message || "No se pudo registrar la salida en el servidor.",
        "error"
      );
    }
    setGuardandoAccion(false);
  };

  return (
    <>
      <HeaderAdmin homePath={esAdmin ? "/admin_dashboard" : "/garagista_dashboard"} />

      <main className="garagista-page">
        <div className="garagista-shell">
          <header className="garagista-hero">
            <div className="garagista-title-block">
              {esAdmin ? (
                <button
                  className="garagista-icon-button"
                  type="button"
                  onClick={() => navigate("/admin_dashboard")}
                  aria-label="Volver al dashboard de admin"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : null}

              <div>
                <span className="garagista-eyebrow">
                  {esAdmin ? <Eye size={16} /> : <ShieldCheck size={16} />}
                  {esAdmin ? "Vista de solo lectura" : "Operación diaria"}
                </span>
                <h1>Control de acceso</h1>
              </div>
            </div>

          </header>

          <section className="garagista-summary-card" aria-label="Resumen operativo">
            <div>
              <span className="garagista-summary-label">
                {esAdmin ? "Garage consultado" : "Garage asignado"}
              </span>
              {esAdmin ? (
                <select
                  className="garagista-garage-select"
                  value={garageSeleccionadoId ?? ""}
                  onChange={(event) => setGarageSeleccionadoId(Number(event.target.value) || null)}
                  disabled={cargandoGaragesAdmin || garagesDisponibles.length === 0}
                  aria-label="Seleccionar garage para consultar"
                >
                  {garagesDisponibles.length === 0 ? (
                    <option value="">Sin garages disponibles</option>
                  ) : garagesDisponibles.map((garage) => (
                    <option key={obtenerIdGarage(garage)} value={obtenerIdGarage(garage)}>
                      {garage.nombre || garage.name || garage.descripcion || garage.ubicacion || "Garage"}
                    </option>
                  ))}
                </select>
              ) : cargandoVista ? (
                <SkeletonLine className="garagista-skeleton-line--garage" />
              ) : (
                <strong>{garageData?.nombre || garageData?.name || garageData?.descripcion || garageData?.ubicacion || garageData?.nombre_garage || garageData?.garage_nombre || "Sin garage"}</strong>
              )}
            </div>

            <div className="garagista-summary-metric">
              <CalendarDays size={19} />
              <span>{fechaActual}</span>
            </div>

            <div className="garagista-capacity">
              <CarFront size={22} />
              {cargandoVista ? (
                <SkeletonLine className="garagista-skeleton-line--capacity" />
              ) : (
                <span>{cantidadAutosDentro} / {capacidadTotal || "—"} dentro</span>
              )}
            </div>
          </section>

          <label className="garagista-search">
            <Search size={20} />
            <input
              type="search"
              placeholder="Buscar por conductor o vehículo..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>

          <div className="garagista-date-filter" role="group" aria-label="Filtrar reservas por fecha">
            <button
              type="button"
              className={filtroFecha === "todas" ? "is-active" : ""}
              onClick={() => setFiltroFecha("todas")}
              aria-pressed={filtroFecha === "todas"}
            >
              Todas las reservas
            </button>
            <button
              type="button"
              className={filtroFecha === "hoy" ? "is-active" : ""}
              onClick={() => setFiltroFecha("hoy")}
              aria-pressed={filtroFecha === "hoy"}
            >
              Reservas de hoy
            </button>
          </div>

          {cargandoVista ? (
            <GaragistaDashboardSkeleton />
          ) : errorVista ? (
            <div className="garagista-empty">{errorVista}</div>
          ) : (
          <>
          <div className="garagista-mobile-tabs" role="group" aria-label="Estado de las reservas">
            <button
              type="button"
              className={seccionMovil === "pendientes" ? "is-active" : ""}
              onClick={() => setSeccionMovil("pendientes")}
              aria-pressed={seccionMovil === "pendientes"}
            >
              Pendientes <span>{reservasPendientes.length}</span>
            </button>
            <button
              type="button"
              className={seccionMovil === "dentro" ? "is-active" : ""}
              onClick={() => setSeccionMovil("dentro")}
              aria-pressed={seccionMovil === "dentro"}
            >
              Dentro <span>{autosDentro.length}</span>
            </button>
          </div>
          <div className="garagista-sections-grid">
            <section className={`garagista-section garagista-mobile-panel ${seccionMovil === "pendientes" ? "is-active" : ""}`}>
              <div className="garagista-section-heading">
                <div>
                  <span>Ingresos pendientes</span>
                  <h2>Reservas próximas</h2>
                </div>
                <strong>{reservasPendientes.length}</strong>
              </div>

              <div className="garagista-card-list">
                {reservasPendientes.length > 0 ? (
                  reservasPendientes.map((reserva) => (
                    <article className="access-card" key={reserva.id}>
                      <div className="access-card__top">
                        <div>
                          <h3>{reserva.conductor}</h3>
                          <p>{reserva.vehiculo}</p>
                        </div>
                        <BadgeEstado estado={reserva.estado} />
                      </div>

                      <dl className="access-card__meta">
                        <div>
                          <dt>Hora de reserva</dt>
                          <dd>
                            <Clock3 size={15} />
                            {reserva.horaReserva}
                          </dd>
                        </div>
                        <div>
                          <dt>Plaza</dt>
                          <dd>{reserva.plaza}</dd>
                        </div>
                      </dl>

                      {!esAdmin ? (
                        <button
                          className="garagista-primary-btn"
                          type="button"
                          onClick={() => abrirVerificacion(reserva)}
                          disabled={guardandoAccion}
                        >
                          <ShieldCheck size={17} />
                          Verificar ingreso
                        </button>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <EmptyState mensaje="No hay reservas próximas para mostrar." />
                )}
              </div>
            </section>

            <section className={`garagista-section garagista-mobile-panel ${seccionMovil === "dentro" ? "is-active" : ""}`}>
              <div className="garagista-section-heading">
                <div>
                  <span>Ocupacion actual</span>
                  <h2>Autos dentro</h2>
                </div>
                <strong>{autosDentro.length}</strong>
              </div>

              <div className="garagista-card-list">
                {autosDentro.length > 0 ? (
                  autosDentro.map((reserva) => (
                    <article className="access-card access-card--inside" key={reserva.id}>
                      <div className="access-card__top">
                        <div>
                          <h3>{reserva.conductor}</h3>
                          <p>{reserva.vehiculo}</p>
                        </div>
                        <BadgeEstado estado={reserva.estado} />
                      </div>

                      <dl className="access-card__meta">
                        <div>
                          <dt>Hora de entrada</dt>
                          <dd>
                            <DoorOpen size={15} />
                            {reserva.horaEntrada}
                          </dd>
                        </div>
                        <div>
                          <dt>Plaza</dt>
                          <dd>{reserva.plaza}</dd>
                        </div>
                      </dl>

                      {!esAdmin ? (
                        <button
                          className="garagista-secondary-btn"
                          type="button"
                          onClick={() => registrarSalida(reserva)}
                          disabled={guardandoAccion}
                        >
                          <CheckCircle2 size={17} />
                          Registrar salida
                        </button>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <EmptyState mensaje="No hay autos dentro con este filtro." />
                )}
              </div>
            </section>
          </div>

          <section className="garagista-section garagista-section--movements">
            <div className="garagista-section-heading">
              <div>
                <span>Actividad reciente</span>
                <h2>Últimos movimientos</h2>
              </div>
              <strong>{movimientosFinalizados.length}</strong>
            </div>

            <div className="movements-list">
              {movimientosFinalizados.length > 0 ? (
                movimientosFinalizados.map((reserva) => (
                  <article className="movement-row" key={reserva.id}>
                    <div>
                      <h3>{reserva.conductor}</h3>
                      <p>{reserva.vehiculo}</p>
                    </div>
                    <BadgeEstado estado={reserva.estado} />
                    <span>Plaza {reserva.plaza}</span>
                    <span>Entrada {reserva.horaEntrada}</span>
                    <span>Salida {reserva.horaSalida}</span>
                  </article>
                ))
              ) : (
                <EmptyState mensaje="Todavía no hay movimientos finalizados." />
              )}
            </div>
          </section>
          </>
          )}
        </div>
      </main>

      {esAdmin ? <FooterAdmin /> : null}

      {!esAdmin && reservaSeleccionada ? (
        <ModalPortal onClose={cerrarVerificacion} overlayClassName="garagista-modal-overlay">
          <form className="garagista-modal" onSubmit={verificarPatente} onClick={(e) => e.stopPropagation()}>
            <div className="garagista-modal__header">
              <div>
                <h2>{patenteVerificada ? "Confirmar vehículo" : "Verificar patente"}</h2>
                <p>
                  {patenteVerificada
                    ? "Revisá los datos antes de registrar el ingreso."
                    : "Ingresá la patente del vehículo para confirmar el acceso."}
                </p>
              </div>
              <button
                className="garagista-modal__close"
                type="button"
                onClick={cerrarVerificacion}
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            {patenteVerificada ? (
              <div className="garagista-vehicle-confirmation" role="status">
                <span className="garagista-vehicle-confirmation__icon">
                  <CarFront size={25} />
                </span>
                <div>
                  <span>El vehículo que ingresará es</span>
                  <strong>{reservaSeleccionada.vehiculo}</strong>
                  <small>Patente {reservaSeleccionada.patenteInterna}</small>
                </div>
              </div>
            ) : (
              <>
                <label className="garagista-modal__field">
                  <span>Patente</span>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Ej: AB123CD"
                    value={patenteIngresada}
                    onChange={(event) => {
                      setPatenteIngresada(event.target.value);
                      setErrorVerificacion("");
                    }}
                  />
                </label>
              </>
            )}

            {errorVerificacion ? (
              <p className="garagista-modal__error" role="alert">
                {errorVerificacion}
              </p>
            ) : null}

            <div className="garagista-modal__actions">
              <button className="garagista-cancel-btn" type="button" onClick={cerrarVerificacion}>
                Cancelar
              </button>
              <button
                className="garagista-primary-btn"
                type={patenteVerificada ? "button" : "submit"}
                onClick={patenteVerificada ? confirmarAcceso : undefined}
                disabled={guardandoAccion}
              >
                {guardandoAccion ? "Guardando..." : patenteVerificada ? "Confirmar" : "Verificar patente"}
              </button>
            </div>
          </form>
        </ModalPortal>
      ) : null}
    </>
  );
}
