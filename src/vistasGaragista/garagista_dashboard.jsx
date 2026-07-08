import { useMemo, useState } from "react";
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

const CAPACIDAD_GARAGE = 20;

const reservasSimuladas = [
  {
    id: 1,
    conductor: "Martina Lopez",
    horaReserva: "08:30",
    plaza: "A-04",
    vehiculo: "Toyota Corolla gris",
    patenteInterna: "AB123CD",
    estado: "Pendiente",
  },
  {
    id: 2,
    conductor: "Nicolas Farias",
    horaReserva: "09:15",
    plaza: "B-11",
    vehiculo: "Ford Focus azul",
    patenteInterna: "AC 456 EF",
    estado: "Pendiente",
  },
  {
    id: 3,
    conductor: "Lucia Benitez",
    horaReserva: "07:50",
    plaza: "C-02",
    vehiculo: "Jeep Renegade blanca",
    patenteInterna: "AD-789-GH",
    estado: "Dentro",
    horaEntrada: "07:54",
  },
  {
    id: 4,
    conductor: "Santiago Vera",
    horaReserva: "07:10",
    plaza: "A-09",
    vehiculo: "Volkswagen Taos negra",
    patenteInterna: "AE321JK",
    estado: "Dentro",
    horaEntrada: "07:18",
  },
  {
    id: 5,
    conductor: "Paula Sosa",
    horaReserva: "06:40",
    plaza: "D-01",
    vehiculo: "Renault Sandero rojo",
    patenteInterna: "AF654LM",
    estado: "Finalizado",
    horaEntrada: "06:45",
    horaSalida: "08:05",
  },
  {
    id: 6,
    conductor: "Diego Morales",
    horaReserva: "06:15",
    plaza: "B-05",
    vehiculo: "Chevrolet Cruze blanco",
    patenteInterna: "AG987NO",
    estado: "Finalizado",
    horaEntrada: "06:23",
    horaSalida: "07:42",
  },
  {
    id: 7,
    conductor: "Camila Torres",
    horaReserva: "08:05",
    plaza: "A-12",
    vehiculo: "Fiat Cronos plata",
    patenteInterna: "AH111PQ",
    estado: "Dentro",
    horaEntrada: "08:07",
  },
  {
    id: 8,
    conductor: "Rafael Medina",
    horaReserva: "09:40",
    plaza: "C-07",
    vehiculo: "Peugeot 208 azul",
    patenteInterna: "AI222RS",
    estado: "Pendiente",
  },
  {
    id: 9,
    conductor: "Valentina Castro",
    horaReserva: "07:35",
    plaza: "D-09",
    vehiculo: "Honda HR-V gris",
    patenteInterna: "AJ333TU",
    estado: "Dentro",
    horaEntrada: "07:39",
  },
  {
    id: 10,
    conductor: "Federico Luna",
    horaReserva: "07:25",
    plaza: "B-02",
    vehiculo: "Citroen C4 negro",
    patenteInterna: "AK444VW",
    estado: "Dentro",
    horaEntrada: "07:32",
  },
  {
    id: 11,
    conductor: "Julieta Romero",
    horaReserva: "08:20",
    plaza: "C-11",
    vehiculo: "Nissan Kicks blanca",
    patenteInterna: "AL555XY",
    estado: "Dentro",
    horaEntrada: "08:22",
  },
  {
    id: 12,
    conductor: "Mateo Herrera",
    horaReserva: "08:45",
    plaza: "D-04",
    vehiculo: "Toyota Yaris rojo",
    patenteInterna: "AM666ZA",
    estado: "Dentro",
    horaEntrada: "08:49",
  },
  {
    id: 13,
    conductor: "Sofia Aguirre",
    horaReserva: "09:00",
    plaza: "A-16",
    vehiculo: "Kia Seltos plata",
    patenteInterna: "AN777BC",
    estado: "Dentro",
    horaEntrada: "09:03",
  },
];

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
  const [reservas, setReservas] = useState(reservasSimuladas);
  const [busqueda, setBusqueda] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [patenteIngresada, setPatenteIngresada] = useState("");
  const [errorVerificacion, setErrorVerificacion] = useState("");

  const esAdmin = Number(usuario?.id_rol) === 1;
  const fechaActual = useMemo(() => obtenerFechaActual(), []);
  const terminoBusqueda = busqueda.trim().toLowerCase();

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
  };

  const cerrarVerificacion = () => {
    setReservaSeleccionada(null);
    setPatenteIngresada("");
    setErrorVerificacion("");
  };

  const confirmarAcceso = (event) => {
    event.preventDefault();
    if (!reservaSeleccionada) return;

    const patenteEscrita = normalizarPatente(patenteIngresada);
    const patenteEsperada = normalizarPatente(reservaSeleccionada.patenteInterna);

    if (patenteEscrita !== patenteEsperada) {
      setErrorVerificacion("La patente ingresada no coincide con la reserva.");
      return;
    }

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
              <strong>Garage Central</strong>
            </div>

            <div className="garagista-summary-metric">
              <CalendarDays size={19} />
              <span>{fechaActual}</span>
            </div>

            <div className="garagista-capacity">
              <CarFront size={22} />
              <span>{cantidadAutosDentro} / {CAPACIDAD_GARAGE} dentro</span>
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
        </div>
      </main>

      {esAdmin ? <FooterAdmin /> : null}

      {reservaSeleccionada ? (
        <ModalPortal onClose={cerrarVerificacion} overlayClassName="garagista-modal-overlay">
          <form className="garagista-modal" onSubmit={confirmarAcceso} onClick={(e) => e.stopPropagation()}>
            <div className="garagista-modal__header">
              <div>
                <h2>Verificar patente</h2>
                <p>Ingresá la patente del vehículo para confirmar el acceso.</p>
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

            <div className="garagista-modal__actions">
              <button className="garagista-cancel-btn" type="button" onClick={cerrarVerificacion}>
                Cancelar
              </button>
              <button className="garagista-primary-btn" type="submit">
                Confirmar acceso
              </button>
            </div>
          </form>
        </ModalPortal>
      ) : null}
    </>
  );
}
