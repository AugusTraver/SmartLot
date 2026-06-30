import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  MessageCircleQuestion,
  MessageSquareWarning,
  RotateCcw,
  Search,
  Trash2,
  X
} from 'lucide-react';
import "./admin_panel_de_control.css";
import Header from '../componentesAdmin/header_admin';
import FooterEmpleado from '../componentesAdmin/footer_admin';
import BotonReportes from "../componentesAdmin/boton_reportes";
import TablaReservasPanleControl from "../componentesAdmin/tabla_reservas_panelControl";
import {
  ConflictosCreate,
  ConflictosDelete,
  ConflictosGetAll,
  ConflictosGetPapelera,
  ConflictosRestore,
  ConflictosUpdate
} from "../servicies/API_Conflicto";
import { UsuariosGetAll } from "../servicies/API_Usuario";
import { GaragesGetAll } from "../servicies/API_Garage";
import { SedesGetAll } from "../servicies/API_Sede";
import { useAuth } from '../contexts/useAuth';

const MAX_PALABRAS = 300;
const contarPalabras = (texto) => (texto || "").trim().split(/\s+/).filter(Boolean).length;

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.conflictos)) return datos.conflictos;
  if (Array.isArray(datos?.usuarios)) return datos.usuarios;
  return [];
};

const obtenerIdUsuario = (item) => item?.id_usuario ?? item?.idUsuario ?? item?.usuario_id ?? item?.id;
const obtenerIdEmpresa = (item) => item?.id_empresa ?? item?.idEmpresa ?? item?.empresa_id ?? item?.empresaId;
const obtenerIdSede = (item) => item?.id_sede ?? item?.idSede ?? item?.sede_id ?? item?.sedeId;
const obtenerFechaConflicto = (item) =>
  item?.fecha_creacion ?? item?.fechaCreacion ?? item?.created_at ?? item?.createdAt ?? item?.CreateAt;
const obtenerFechaBorrado = (item) =>
  item?.DeleteAt ?? item?.deleteAt ?? item?.deleted_at ?? item?.deletedAt;

const formatearFecha = (fecha) => {
  if (!fecha) return "Sin fecha";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const prioridadClase = (prioridad) => {
  const valor = String(prioridad || "").toLowerCase();
  if (valor === "alta") return "alta";
  if (valor === "media") return "media";
  return "baja";
};

const estadoClase = (estado) => {
  const valor = String(estado || "").toLowerCase();
  if (valor.includes("resuelto")) return "resuelto";
  if (valor.includes("proceso")) return "proceso";
  return "pendiente";
};

const PanelStatsSkeleton = () => (
  <section className="panel-stats-card panel-stats--skeleton" aria-label="Cargando ocupacion total">
    <div className="panel-stats__header">
      <span className="panel-skeleton-line panel-skeleton-label" />
      <span className="panel-skeleton-icon" />
    </div>
    <span className="panel-skeleton-line panel-skeleton-value" />
    <span className="panel-skeleton-progress" />
  </section>
);

const ConflictsTableSkeleton = ({ rows = 4 }) => (
  <div className="conflicts-table-shell conflicts-table-shell--skeleton" aria-label="Cargando conflictos">
    <table className="conflicts-table">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>Descripcion</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th aria-label="Acciones" />
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <tr key={index}>
            <td>
              <span className="panel-skeleton-line panel-skeleton-name" />
              <span className="panel-skeleton-line panel-skeleton-email" />
            </td>
            <td>
              <span className="panel-skeleton-line panel-skeleton-description" />
            </td>
            <td>
              <span className="panel-skeleton-pill" />
            </td>
            <td>
              <span className="panel-skeleton-select" />
            </td>
            <td>
              <span className="panel-skeleton-line panel-skeleton-date" />
            </td>
            <td>
              <span className="panel-skeleton-action" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const getAdminConflictScope = (usuario) => {
  const idSede = obtenerIdSede(usuario);
  const idEmpresa = obtenerIdEmpresa(usuario);
  const idUsuario = obtenerIdUsuario(usuario);

  return {
    idSede,
    idEmpresa,
    idUsuario,
    scopeKey: idSede
      ? 'sede:' + idSede
      : idEmpresa
        ? 'empresa:' + idEmpresa
      : 'usuario:' + (idUsuario || 'unknown'),
  };
};

const perteneceAlTenantAdmin = (conflicto, usuariosPorId, scope) => {
  const conflictoEmpresa = obtenerIdEmpresa(conflicto);
  const conflictoSede = obtenerIdSede(conflicto);
  const usuarioConflicto = usuariosPorId.get(Number(obtenerIdUsuario(conflicto)));
  const usuarioEmpresa = obtenerIdEmpresa(usuarioConflicto);
  const usuarioSede = obtenerIdSede(usuarioConflicto);

  if (scope.idSede) {
    return Number(conflictoSede || usuarioSede) === Number(scope.idSede);
  }

  if (scope.idEmpresa) {
    return Number(conflictoEmpresa || usuarioEmpresa) === Number(scope.idEmpresa);
  }

  return false;
};

export default function AdminPanelControl() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [conflictos, setConflictos] = useState([]);
  const [papelera, setPapelera] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [garagesList, setGaragesList] = useState([]);
  const [loadingConflictos, setLoadingConflictos] = useState(true);
  const [errorConflictos, setErrorConflictos] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const [mostrarPapelera, setMostrarPapelera] = useState(false);
  const [cargandoPapelera, setCargandoPapelera] = useState(false);
  const [modalSoporteOpen, setModalSoporteOpen] = useState(false);
  const [nuevoConflicto, setNuevoConflicto] = useState({ descripcion: "", prioridad: "Media" });
  const [enviandoConflicto, setEnviandoConflicto] = useState(false);
  const [mensajeSoporte, setMensajeSoporte] = useState(null);
  const [busquedaConflictos, setBusquedaConflictos] = useState("");

  const conflictScope = useMemo(() => getAdminConflictScope(usuario), [usuario]);

  const cargarPapelera = useCallback(async ({ force = false } = {}) => {
    setCargandoPapelera(true);
    const papeleraResponse = await ConflictosGetPapelera({ superAdmin: false, force, ...conflictScope });
    if (papeleraResponse.respuesta) {
      setPapelera(obtenerListado(papeleraResponse.datos));
    } else {
      setErrorConflictos("No se pudo cargar la papelera.");
    }
    setCargandoPapelera(false);
  }, [conflictScope]);

  useEffect(() => {
    let montado = true;

    const cargarDatos = async () => {
      setLoadingConflictos(true);
      setErrorConflictos("");

      try {
        const [conflictosResponse, papeleraResponse, usuariosResponse, garagesResponse, sedesResponse] = await Promise.all([
          ConflictosGetAll({ superAdmin: false, ...conflictScope }),
          ConflictosGetPapelera({ superAdmin: false, ...conflictScope }),
          UsuariosGetAll(),
          GaragesGetAll(),
          SedesGetAll(),
        ]);

        if (!montado) return;

        const adminIdSede = Number(usuario?.id_sede);
        const empresaAdmin = Number(usuario?.id_empresa);
        const tieneEmpresa = !isNaN(empresaAdmin) && empresaAdmin > 0;

        if (usuariosResponse.respuesta) {
          const usuariosList = obtenerListado(usuariosResponse.datos);

          let usuariosFiltrados = usuariosList;
          if (adminIdSede) {
            usuariosFiltrados = usuariosList.filter((u) => Number(u.id_sede ?? u.idSede) === adminIdSede);
          } else if (tieneEmpresa) {
            usuariosFiltrados = usuariosList.filter((u) => Number(u.id_empresa ?? u.idEmpresa) === empresaAdmin);
          }

          const userIdsSet = new Set(usuariosFiltrados.map((u) => Number(obtenerIdUsuario(u))));

          setUsuarios(usuariosFiltrados);

          if (conflictosResponse.respuesta) {
            const allConflictos = obtenerListado(conflictosResponse.datos);
            setConflictos(allConflictos.filter((c) => userIdsSet.has(Number(obtenerIdUsuario(c)))));
          } else {
            setErrorConflictos("No se pudieron cargar los conflictos.");
          }

          if (papeleraResponse.respuesta) {
            const allPapelera = obtenerListado(papeleraResponse.datos);
            setPapelera(allPapelera.filter((p) => userIdsSet.has(Number(obtenerIdUsuario(p)))));
          }
        } else {
          if (conflictosResponse.respuesta) {
            setConflictos(obtenerListado(conflictosResponse.datos));
          } else {
            setErrorConflictos("No se pudieron cargar los conflictos.");
          }

          if (papeleraResponse.respuesta) {
            setPapelera(obtenerListado(papeleraResponse.datos));
          }
        }

        const garArray = obtenerListado(garagesResponse.datos);

        let garagesFiltrados = garArray;
        if (adminIdSede) {
          garagesFiltrados = garArray.filter((g) => Number(g.id_sede ?? g.idSede) === adminIdSede);
        } else if (tieneEmpresa) {
          const sedesArray = obtenerListado(sedesResponse.datos);
          const sedesIdsEmpresa = new Set(
            sedesArray
              .filter((s) => Number(s.id_empresa) === empresaAdmin)
              .map((s) => Number(s.id))
          );
          garagesFiltrados = garArray.filter((g) =>
            sedesIdsEmpresa.has(Number(g.id_sede ?? g.idSede))
          );
        }

        setGaragesList(garagesFiltrados);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        if (montado) setErrorConflictos("Ocurrio un error al cargar los datos.");
      } finally {
        if (montado) setLoadingConflictos(false);
      }
    };

    cargarDatos();

    return () => {
      montado = false;
    };
  }, [usuario, conflictScope]);

  const usuariosPorId = useMemo(
    () => new Map(usuarios.map((usuario) => [Number(usuario.id ?? usuario.id_usuario), usuario])),
    [usuarios]
  );

  const conflictosTenant = useMemo(
    () => conflictos.filter((conflicto) => perteneceAlTenantAdmin(conflicto, usuariosPorId, conflictScope)),
    [conflictos, usuariosPorId, conflictScope]
  );

  const papeleraTenant = useMemo(
    () => papelera.filter((conflicto) => perteneceAlTenantAdmin(conflicto, usuariosPorId, conflictScope)),
    [papelera, usuariosPorId, conflictScope]
  );

  const conflictosOrdenados = useMemo(() => {
    const pesoEstado = { Pendiente: 0, "En Proceso": 1, Resuelto: 2 };
    const pesoPrioridad = { Alta: 0, Media: 1, Baja: 2 };

    return [...conflictosTenant].sort((a, b) => {
      const estadoDiff = (pesoEstado[a.estado] ?? 9) - (pesoEstado[b.estado] ?? 9);
      if (estadoDiff !== 0) return estadoDiff;

      const prioridadDiff = (pesoPrioridad[a.prioridad] ?? 9) - (pesoPrioridad[b.prioridad] ?? 9);
      if (prioridadDiff !== 0) return prioridadDiff;

      return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
    });
  }, [conflictosTenant]);

  const filtrarConflictos = useCallback((items) => {
    const query = busquedaConflictos.trim().toLowerCase();
    if (!query) return items;

    return items.filter((conflicto) => {
      const usuarioConflicto = usuariosPorId.get(Number(obtenerIdUsuario(conflicto)));
      const nombreUsuario = usuarioConflicto
        ? `${usuarioConflicto.nombre || ""} ${usuarioConflicto.apellido || ""} ${usuarioConflicto.email || ""}`
        : "";
      return [
        nombreUsuario,
        conflicto.descripcion,
        conflicto.prioridad,
        conflicto.estado,
        obtenerIdUsuario(conflicto),
      ].some((valor) => String(valor || "").toLowerCase().includes(query));
    });
  }, [busquedaConflictos, usuariosPorId]);

  const conflictosVisibles = useMemo(
    () => filtrarConflictos(conflictosOrdenados),
    [conflictosOrdenados, filtrarConflictos]
  );

  const papeleraVisible = useMemo(
    () => filtrarConflictos(papeleraTenant),
    [papeleraTenant, filtrarConflictos]
  );

  const pendientes = conflictosTenant.filter((conflicto) => conflicto.estado !== "Resuelto").length;

  const ocupacion = useMemo(() => {
    let totalOcupados = 0;
    let totalCapacidad = 0;
    garagesList.forEach((g) => {
      const ocupados =
        Number(g.ocupacion_reservas || 0) + Number(g.ocupacion_no_reservas || 0);
      totalOcupados += ocupados;
      const cap =
        Number(g.capacidad_reservas || 0) + Number(g.capacidad_para_no_reservas || 0);
      totalCapacidad += cap;
    });
    const pct = totalCapacidad > 0 ? Math.round((totalOcupados / totalCapacidad) * 100) : 0;
    return { porcentaje: pct, ocupados: totalOcupados, capacidad: totalCapacidad };
  }, [garagesList]);

  const handleCambiarEstado = async (conflicto, estado) => {
    setActualizandoId(conflicto.id);
    const payload = {
      id_usuario: obtenerIdUsuario(conflicto),
      descripcion: conflicto.descripcion,
      prioridad: conflicto.prioridad,
      estado,
      SuperAdmin: conflicto.SuperAdmin === true,
    };

    const resultado = await ConflictosUpdate(conflicto.id, payload);
    if (resultado.respuesta) {
      setConflictos((prev) => prev.map((item) => item.id === conflicto.id ? resultado.datos : item));
    }
    setActualizandoId(null);
  };

  const handleCrearConflictoSuperadmin = async (event) => {
    event.preventDefault();
    const descripcion = nuevoConflicto.descripcion.trim();
    const idUsuario = Number(obtenerIdUsuario(usuario));

    if (!descripcion) {
      setMensajeSoporte({ tipo: "error", texto: "Describi brevemente el mensaje." });
      return;
    }

    if (contarPalabras(descripcion) > MAX_PALABRAS) {
      setMensajeSoporte({ tipo: "error", texto: `La descripcion no puede tener mas de ${MAX_PALABRAS} palabras.` });
      return;
    }

    if (!Number.isFinite(idUsuario)) {
      setMensajeSoporte({ tipo: "error", texto: "No se pudo identificar tu usuario." });
      return;
    }

    setEnviandoConflicto(true);
    setErrorConflictos("");
    setMensajeSoporte(null);
    const resultado = await ConflictosCreate({
      id_usuario: idUsuario,
      descripcion,
      prioridad: nuevoConflicto.prioridad,
      estado: "Pendiente",
      SuperAdmin: true,
    });

    if (resultado.respuesta) {
      setModalSoporteOpen(false);
      setNuevoConflicto({ descripcion: "", prioridad: "Media" });
      setMensajeSoporte(null);
    } else {
      setMensajeSoporte({ tipo: "error", texto: resultado.datos?.message || "No se pudo enviar el mensaje." });
    }
    setEnviandoConflicto(false);
  };

  const abrirModalSoporte = () => {
    setMensajeSoporte(null);
    setModalSoporteOpen(true);
  };

  const cerrarModalSoporte = () => {
    if (enviandoConflicto) return;
    setModalSoporteOpen(false);
    setNuevoConflicto({ descripcion: "", prioridad: "Media" });
    setMensajeSoporte(null);
  };

  const handleEliminar = async (id) => {
    setActualizandoId(id);
    const resultado = await ConflictosDelete(id);
    if (resultado.respuesta) {
      setConflictos((prev) => prev.filter((item) => item.id !== id));
      await cargarPapelera({ force: true });
    }
    setActualizandoId(null);
  };

  const handleRestaurar = async (id) => {
    setActualizandoId(id);
    const resultado = await ConflictosRestore(id);
    if (resultado.respuesta) {
      setPapelera((prev) => prev.filter((item) => item.id !== id));
      setConflictos((prev) => [resultado.datos, ...prev.filter((item) => item.id !== id)]);
      setMostrarPapelera(false);
      await cargarPapelera({ force: true });
    }
    setActualizandoId(null);
  };

  const handleMostrarPapelera = () => {
    setMostrarPapelera(true);
    cargarPapelera({ force: true });
  };

  return (
    <div className="admin-panel">
      <Header />
      <header className="admin-panel__header">
        <button
          className="boton-back"
          onClick={() => navigate("/admin_dashboard", { replace: true })}
          aria-label="Volver al dashboard"
        >
          <ArrowLeft size={24} />
        </button>

        <div className='textoPanelControl'>
          <h1 className="admin-panel__title">Panel de Control</h1>
          <p className="admin-panel__subtitle">
            Supervision general de reservas, ocupacion y conflictos reportados.
          </p>
        </div>
      </header>

      {loadingConflictos ? (
        <PanelStatsSkeleton />
      ) : (
        <section className="panel-stats-card">
          <div className="panel-stats__header">
            <span className="panel-stats__label">Ocupacion Total</span>
            <BarChart3 className="panel-stats__icon" />
          </div>
          <div className="panel-stats__value">
            {`${ocupacion.porcentaje}%`}
          </div>
          <div className="panel-stats__progress-container">
            <div className="panel-stats__progress-bar" style={{ width: `${ocupacion.porcentaje}%` }} />
          </div>
        </section>
      )}

      <section className="conflicts-section">
        <div className="conflicts-section__title-container">
          <MessageSquareWarning className="conflicts-section__alert-icon" />
          <div>
            <h2 className="conflicts-section__title">
              Conflictos reportados ({pendientes})
            </h2>
            <p className="conflicts-section__subtitle">Casos abiertos por empleados y estado de seguimiento.</p>
          </div>
          <button
            type="button"
            className="admin-support-btn"
            onClick={abrirModalSoporte}
          >
            <MessageCircleQuestion size={16} />
            Enviar mensaje a soporte
          </button>
        </div>

        {errorConflictos && (
          <div className="conflicts-section__feedback conflicts-section__feedback--error" role="alert">
            {errorConflictos}
          </div>
        )}

        <div className="conflicts-toolbar">
          <button
            type="button"
            className={`conflicts-toolbar__btn ${!mostrarPapelera ? "active" : ""}`}
            onClick={() => setMostrarPapelera(false)}
          >
            Activos ({conflictosTenant.length})
          </button>
          <button
            type="button"
            className={`conflicts-toolbar__btn ${mostrarPapelera ? "active" : ""}`}
            onClick={handleMostrarPapelera}
          >
            <Trash2 size={15} />
            Papelera ({papeleraTenant.length})
          </button>
          <label className="conflicts-search">
            <Search size={16} />
            <input
              type="search"
              value={busquedaConflictos}
              onChange={(event) => setBusquedaConflictos(event.target.value)}
              placeholder="Buscar conflictos"
              aria-label="Buscar conflictos"
            />
          </label>
        </div>

        {loadingConflictos ? (
          <ConflictsTableSkeleton />
        ) : mostrarPapelera ? (
          cargandoPapelera ? (
            <ConflictsTableSkeleton rows={3} />
          ) : papeleraVisible.length === 0 ? (
            <div className="conflicts-section__feedback">No hay conflictos en tu papelera.</div>
          ) : (
            <div className="conflicts-table-shell">
              <table className="conflicts-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Descripcion</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Eliminado</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {papeleraVisible.map((conflicto) => {
                    const usuarioConflicto = usuariosPorId.get(Number(obtenerIdUsuario(conflicto)));
                    const nombreUsuario = usuarioConflicto
                      ? `${usuarioConflicto.nombre || ""} ${usuarioConflicto.apellido || ""}`.trim() || usuarioConflicto.email
                      : `Usuario #${obtenerIdUsuario(conflicto) || "-"}`;
                    const deshabilitado = actualizandoId === conflicto.id;

                    return (
                      <tr key={conflicto.id}>
                        <td>
                          <strong>{nombreUsuario}</strong>
                          {usuarioConflicto?.email && <span>{usuarioConflicto.email}</span>}
                        </td>
                        <td className="conflicts-table__description">{conflicto.descripcion}</td>
                        <td>
                          <span className={`conflict-priority conflict-priority--${prioridadClase(conflicto.prioridad)}`}>
                            {conflicto.prioridad || "Baja"}
                          </span>
                        </td>
                        <td>{conflicto.estado || "Pendiente"}</td>
                        <td>
                          <span className="conflicts-table__date">
                            <Clock3 size={14} />
                            {formatearFecha(obtenerFechaBorrado(conflicto))}
                          </span>
                        </td>
                        <td>
                          <button
                            className="conflict-restore-btn"
                            onClick={() => handleRestaurar(conflicto.id)}
                            disabled={deshabilitado}
                            aria-label="Restaurar conflicto"
                          >
                            <RotateCcw size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : conflictosVisibles.length === 0 ? (
          <div className="conflicts-section__feedback">No hay conflictos reportados.</div>
        ) : (
          <div className="conflicts-table-shell">
            <table className="conflicts-table">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Descripcion</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {conflictosVisibles.map((conflicto) => {
                  const usuario = usuariosPorId.get(Number(obtenerIdUsuario(conflicto)));
                  const nombreUsuario = usuario
                    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || usuario.email
                    : `Usuario #${obtenerIdUsuario(conflicto) || "-"}`;
                  const deshabilitado = actualizandoId === conflicto.id;

                  return (
                    <tr key={conflicto.id}>
                      <td>
                        <strong>{nombreUsuario}</strong>
                        {usuario?.email && <span>{usuario.email}</span>}
                      </td>
                      <td className="conflicts-table__description">{conflicto.descripcion}</td>
                      <td>
                        <span className={`conflict-priority conflict-priority--${prioridadClase(conflicto.prioridad)}`}>
                          {conflicto.prioridad || "Baja"}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`conflict-status-select conflict-status-select--${estadoClase(conflicto.estado)}`}
                          value={conflicto.estado || "Pendiente"}
                          onChange={(event) => handleCambiarEstado(conflicto, event.target.value)}
                          disabled={deshabilitado}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="Resuelto">Resuelto</option>
                        </select>
                      </td>
                      <td>
                        <span className="conflicts-table__date">
                          <Clock3 size={14} />
                          {formatearFecha(obtenerFechaConflicto(conflicto))}
                        </span>
                      </td>
                      <td>
                        <button
                          className="conflict-delete-btn"
                          onClick={() => handleEliminar(conflicto.id)}
                          disabled={deshabilitado}
                          aria-label="Eliminar conflicto"
                        >
                          {conflicto.estado === "Resuelto" ? <CheckCircle2 size={15} /> : <Trash2 size={15} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <TablaReservasPanleControl />
        </div>
        <div>
          <BotonReportes />
        </div>
      </section>
      <FooterEmpleado />

      {modalSoporteOpen && (
        <div className="admin-support-overlay" role="presentation" onMouseDown={cerrarModalSoporte}>
          <section
            className="admin-support-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-support-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-support-header">
              <div>
                <span>Soporte</span>
                <h2 id="admin-support-title">Enviar mensaje a soporte</h2>
              </div>
              <button type="button" className="admin-support-close" onClick={cerrarModalSoporte} aria-label="Cerrar soporte">
                <X size={20} />
              </button>
            </div>

            <form className="admin-support-form" onSubmit={handleCrearConflictoSuperadmin}>
              <label className="admin-support-field">
                <span>Prioridad</span>
                <select
                  value={nuevoConflicto.prioridad}
                  onChange={(event) => setNuevoConflicto((prev) => ({ ...prev, prioridad: event.target.value }))}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </label>

              <label className="admin-support-field">
                <span>Descripcion</span>
                <textarea
                  value={nuevoConflicto.descripcion}
                  onChange={(event) => setNuevoConflicto((prev) => ({ ...prev, descripcion: event.target.value }))}
                  placeholder="Contanos que paso"
                  rows={5}
                  maxLength={3000}
                />
                <span className={`admin-support-wordcount ${contarPalabras(nuevoConflicto.descripcion) > MAX_PALABRAS ? "admin-support-wordcount--exceeded" : ""}`}>
                  {contarPalabras(nuevoConflicto.descripcion)}/{MAX_PALABRAS} palabras
                </span>
              </label>

              {mensajeSoporte && (
                <div className={`admin-support-feedback admin-support-feedback--${mensajeSoporte.tipo}`} role="alert">
                  {mensajeSoporte.texto}
                </div>
              )}

              <button type="submit" className="admin-support-submit" disabled={enviandoConflicto}>
                {enviandoConflicto ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
