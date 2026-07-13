import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  DoorOpen,
  LogOut,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import apiClient from "../api/client";
import { clearCache } from "../cache/cacheStore";
import { GaragesGetById } from "../servicies/API_Garage";
import { ReservasGetAll } from "../servicies/API_Reserva";
import { UsuariosGetAll } from "../servicies/API_Usuario";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import ModalPortal from "../componentesCompartidos/ModalPortal";
import HeaderAdmin from "../componentesAdmin/header_admin";
import FooterAdmin from "../componentesAdmin/footer_admin";
import { useAuth } from "../contexts/useAuth";
import { showToast } from "../helpers/toast";
import {
  eliminarSuperadminBackup,
  eliminarUsuarioImpersonado,
  obtenerSuperadminBackup,
  obtenerUsuarioImpersonado,
} from "../helpers/superadminSession";
import "./garagista_dashboard.css";

const normalizarPatente = (valor) =>
  valor
    .trim()
    .replace(/[\s-]/g, "")
    .toUpperCase();

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

const obtenerIdGarage = (garage) =>
  garage?.id_garage ?? garage?.idGarage ?? garage?.garage_id ?? garage?.id ?? garage?._id;

const obtenerIdGarageUsuario = (user) =>
  user?.id_garage ?? user?.idGarage ?? user?.garage_id ?? user?.garageId;

const obtenerIdReserva = (reserva) =>
  reserva?.id_reserva ?? reserva?.id ?? reserva?._id;

const normalizarEstadoReserva = (reserva) => {
  const entro = reserva.entrada ?? reserva.ingreso ?? reserva.check_in ?? reserva.entro ?? false;
  const salio = reserva.salida ?? reserva.egreso ?? reserva.check_out ?? reserva.salio ?? false;

  if (salio) return "Finalizado";
  if (entro) return "Dentro";
  return "Pendiente";
};

const extraerHora = (valor) => {
  if (!valor) return null;
  if (typeof valor === "string" && valor.includes("T")) return valor.split("T")[1]?.slice(0, 5);
  if (typeof valor === "string" && valor.includes(" ")) return valor.split(" ")[1]?.slice(0, 5);
  if (typeof valor === "string" && valor.includes(":")) return valor.slice(0, 5);
  return null;
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

export default function GaragistaDashboard() {
  const navigate = useNavigate();
  const { usuario, setUsuario, setRoleTransition } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [garageData, setGarageData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [patenteIngresada, setPatenteIngresada] = useState("");
  const [errorVerificacion, setErrorVerificacion] = useState("");
  const [patenteVerificada, setPatenteVerificada] = useState(false);

  const esAdmin = Number(usuario?.id_rol) === 1;
  const fechaActual = useMemo(() => obtenerFechaActual(), []);
  const idGarageAsignado = useMemo(() => Number(obtenerIdGarageUsuario(usuario)) || null, [usuario]);
  const terminoBusqueda = busqueda.trim().toLowerCase();
  const capacidadTotal = useMemo(() => {
    if (!garageData) return 0;
    return Number(garageData.capacidad_reservas || 0) + Number(garageData.capacidad_para_no_reservas || 0);
  }, [garageData]);

  useEffect(() => {
    if (!idGarageAsignado) {
      setCargando(false);
      setErrorCarga("No tenés un garage asignado.");
      return;
    }

    let cancelado = false;

    const cargarDatos = async () => {
      setCargando(true);
      setErrorCarga("");

      try {
        const [garageResp, reservasResp, usuariosResp, vehiculosResp] = await Promise.all([
          GaragesGetById(idGarageAsignado),
          ReservasGetAll(),
          UsuariosGetAll(),
          VehiculosGetAll(),
        ]);

        if (cancelado) return;

        const garageRaw = garageResp.respuesta ? garageResp.datos : null;
        const garageCandidates = [garageRaw];
        if (garageRaw?.data) garageCandidates.push(garageRaw.data);
        if (garageRaw?.garage) garageCandidates.push(garageRaw.garage);
        if (Array.isArray(garageRaw)) garageCandidates.push(garageRaw[0]);
        const garage = garageCandidates.find((g) => g && typeof g === "object" && !Array.isArray(g)) || null;

        setGarageData(garage);

        const usuariosLista = Array.isArray(usuariosResp.datos)
          ? usuariosResp.datos
          : Array.isArray(usuariosResp.datos?.data) ? usuariosResp.datos.data : [];
        const vehiculosLista = Array.isArray(vehiculosResp.datos)
          ? vehiculosResp.datos
          : Array.isArray(vehiculosResp.datos?.data) ? vehiculosResp.datos.data : [];

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
            const marca = v.marca ?? v.nombre_marca ?? "";
            const modelo = v.modelo ?? v.nombre_modelo ?? "";
            const descripcion = [marca, modelo].filter(Boolean).join(" ") || patente || "Vehículo";
            vehiculosMap.set(id, { patente, descripcion });
          }
        });

        const todasReservas = Array.isArray(reservasResp.datos)
          ? reservasResp.datos
          : Array.isArray(reservasResp.datos?.data) ? reservasResp.datos.data : [];

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
              horaReserva: extraerHora(r.hora_entrada) ?? extraerHora(r.fecha_entrada) ?? "--:--",
              plaza: r.nro_plaza ?? r.plaza ?? "--",
              vehiculo: vehiculo.descripcion || "Vehículo desconocido",
              patenteInterna: vehiculo.patente || "--",
              estado,
              horaEntrada: extraerHora(r.fecha_entrada_real) ?? extraerHora(r.hora_entrada_real) ?? null,
              horaSalida: extraerHora(r.fecha_salida_real) ?? extraerHora(r.hora_salida_real) ?? null,
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
    if (!terminoBusqueda) return reservas;

    return reservas.filter((reserva) => {
      const textoVisible = `${reserva.conductor} ${reserva.vehiculo}`.toLowerCase();
      return textoVisible.includes(terminoBusqueda);
    });
  }, [reservas, terminoBusqueda]);

  const reservasPendientes = reservasFiltradas.filter(
    (reserva) => reserva.estado === "Pendiente"
  );
  const autosDentro = reservasFiltradas.filter((reserva) => reserva.estado === "Dentro");
  const movimientosFinalizados = reservasFiltradas.filter(
    (reserva) => reserva.estado === "Finalizado"
  );
  const cantidadAutosDentro = reservas.filter((reserva) => reserva.estado === "Dentro").length;

  const abrirVerificacion = (reserva) => {
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
    if (!reservaSeleccionada) return;

    const patenteEscrita = normalizarPatente(patenteIngresada);
    const patenteEsperada = normalizarPatente(reservaSeleccionada.patenteInterna);

    if (patenteEscrita !== patenteEsperada) {
      setErrorVerificacion("La patente ingresada no coincide con la reserva.");
      return;
    }

    setErrorVerificacion("");
    setPatenteVerificada(true);
  };

  const confirmarAcceso = () => {
    if (!reservaSeleccionada || !patenteVerificada) return;

    const horaEntrada = obtenerHoraActual();
    setReservas((reservasActuales) =>
      reservasActuales.map((reserva) =>
        reserva.id === reservaSeleccionada.id
          ? { ...reserva, estado: "Dentro", horaEntrada }
          : reserva
      )
    );
    cerrarVerificacion();
    showToast("Ingreso verificado correctamente.", "success");
  };

  const registrarSalida = (id) => {
    const horaSalida = obtenerHoraActual();
    setReservas((reservasActuales) =>
      reservasActuales.map((reserva) =>
        reserva.id === id ? { ...reserva, estado: "Finalizado", horaSalida } : reserva
      )
    );
    showToast("Salida registrada correctamente.", "success");
  };

  const handleCerrarSesion = async () => {
    const cookies = document.cookie.split("; ").filter(Boolean);
    const superadminBackup = obtenerSuperadminBackup();
    const usuarioImpersonado = obtenerUsuarioImpersonado();

    if (cookies.length > 1 && superadminBackup && usuarioImpersonado) {
      eliminarUsuarioImpersonado();
      clearCache();
      setRoleTransition(true);
      setUsuario(superadminBackup);
      navigate("/superadmin_dashboard", { replace: true });
      return;
    }

    try {
      await apiClient.post("/api/usuario/logout");
    } catch {
      // Salimos localmente aunque falle el logout del servidor.
    }

    eliminarSuperadminBackup();
    eliminarUsuarioImpersonado();
    setUsuario(null);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {esAdmin ? <HeaderAdmin /> : null}

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
                  <ShieldCheck size={16} />
                  Operación diaria
                </span>
                <h1>Control de acceso</h1>
              </div>
            </div>

            {!esAdmin ? (
              <button className="garagista-logout" type="button" onClick={handleCerrarSesion}>
                <LogOut size={18} />
                Cerrar sesion
              </button>
            ) : null}
          </header>

          <section className="garagista-summary-card" aria-label="Resumen operativo">
            <div>
              <span className="garagista-summary-label">Garage asignado</span>
              <strong>{garageData?.nombre || garageData?.name || garageData?.descripcion || garageData?.ubicacion || garageData?.nombre_garage || garageData?.garage_nombre || "Sin garage"}</strong>
            </div>

            <div className="garagista-summary-metric">
              <CalendarDays size={19} />
              <span>{fechaActual}</span>
            </div>

            <div className="garagista-capacity">
              <CarFront size={22} />
              <span>{cantidadAutosDentro} / {capacidadTotal || "—"} dentro</span>
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

          {cargando ? (
            <div className="garagista-empty">Cargando datos del garage…</div>
          ) : errorCarga ? (
            <div className="garagista-empty">{errorCarga}</div>
          ) : (
          <>
          <div className="garagista-sections-grid">
            <section className="garagista-section">
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

                      <button
                        className="garagista-primary-btn"
                        type="button"
                        onClick={() => abrirVerificacion(reserva)}
                      >
                        <ShieldCheck size={17} />
                        Verificar ingreso
                      </button>
                    </article>
                  ))
                ) : (
                  <EmptyState mensaje="No hay reservas próximas para mostrar." />
                )}
              </div>
            </section>

            <section className="garagista-section">
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

                      <button
                        className="garagista-secondary-btn"
                        type="button"
                        onClick={() => registrarSalida(reserva.id)}
                      >
                        <CheckCircle2 size={17} />
                        Registrar salida
                      </button>
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

      {reservaSeleccionada ? (
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

                {errorVerificacion ? (
                  <p className="garagista-modal__error" role="alert">
                    {errorVerificacion}
                  </p>
                ) : null}
              </>
            )}

            <div className="garagista-modal__actions">
              <button className="garagista-cancel-btn" type="button" onClick={cerrarVerificacion}>
                Cancelar
              </button>
              <button
                className="garagista-primary-btn"
                type={patenteVerificada ? "button" : "submit"}
                onClick={patenteVerificada ? confirmarAcceso : undefined}
              >
                {patenteVerificada ? "Confirmar" : "Verificar patente"}
              </button>
            </div>
          </form>
        </ModalPortal>
      ) : null}
    </>
  );
}
