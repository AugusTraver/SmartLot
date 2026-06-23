import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  MessageSquareWarning,
  Trash2
} from 'lucide-react';
import "./admin_panel_de_control.css";
import Header from '../componentesAdmin/header_admin';
import FooterEmpleado from '../componentesAdmin/footer_admin';
import BotonReportes from "../componentesAdmin/boton_reportes";
import TablaReservasPanleControl from "../componentesAdmin/tabla_reservas_panelControl";
import { ConflictosDelete, ConflictosGetAll, ConflictosUpdate } from "../servicies/API_Conflicto";
import { UsuariosGetAll } from "../servicies/API_Usuario";
import { GaragesGetAll } from "../servicies/API_Garage";
import { SedesGetAll } from "../servicies/API_Sede";
import { useAuth } from '../contexts/useAuth';

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.conflictos)) return datos.conflictos;
  if (Array.isArray(datos?.usuarios)) return datos.usuarios;
  return [];
};

const obtenerIdUsuario = (item) => item?.id_usuario ?? item?.idUsuario ?? item?.usuario_id;

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

export default function AdminPanelControl() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [conflictos, setConflictos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [garagesList, setGaragesList] = useState([]);
  const [loadingConflictos, setLoadingConflictos] = useState(true);
  const [errorConflictos, setErrorConflictos] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);

  useEffect(() => {
    let montado = true;

    const cargarDatos = async () => {
      setLoadingConflictos(true);
      setErrorConflictos("");

      try {
        const [conflictosResponse, usuariosResponse, garagesResponse, sedesResponse] = await Promise.all([
          ConflictosGetAll(),
          UsuariosGetAll(),
          GaragesGetAll(),
          SedesGetAll(),
        ]);

        if (!montado) return;

        if (conflictosResponse.respuesta) {
          setConflictos(obtenerListado(conflictosResponse.datos));
        } else {
          setErrorConflictos("No se pudieron cargar los conflictos.");
        }

        if (usuariosResponse.respuesta) {
          setUsuarios(obtenerListado(usuariosResponse.datos));
        }

        const garArray = obtenerListado(garagesResponse.datos);

        const adminIdSede = Number(usuario?.id_sede);
        const empresaAdmin = Number(usuario?.id_empresa);
        const tieneEmpresa = !isNaN(empresaAdmin) && empresaAdmin > 0;

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
  }, [usuario]);

  const usuariosPorId = useMemo(
    () => new Map(usuarios.map((usuario) => [Number(usuario.id ?? usuario.id_usuario), usuario])),
    [usuarios]
  );

  const conflictosOrdenados = useMemo(() => {
    const pesoEstado = { Pendiente: 0, "En Proceso": 1, Resuelto: 2 };
    const pesoPrioridad = { Alta: 0, Media: 1, Baja: 2 };

    return [...conflictos].sort((a, b) => {
      const estadoDiff = (pesoEstado[a.estado] ?? 9) - (pesoEstado[b.estado] ?? 9);
      if (estadoDiff !== 0) return estadoDiff;

      const prioridadDiff = (pesoPrioridad[a.prioridad] ?? 9) - (pesoPrioridad[b.prioridad] ?? 9);
      if (prioridadDiff !== 0) return prioridadDiff;

      return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
    });
  }, [conflictos]);

  const pendientes = conflictos.filter((conflicto) => conflicto.estado !== "Resuelto").length;

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
    };

    const resultado = await ConflictosUpdate(conflicto.id, payload);
    if (resultado.respuesta) {
      setConflictos((prev) => prev.map((item) => item.id === conflicto.id ? resultado.datos : item));
    }
    setActualizandoId(null);
  };

  const handleEliminar = async (id) => {
    setActualizandoId(id);
    const resultado = await ConflictosDelete(id);
    if (resultado.respuesta) {
      setConflictos((prev) => prev.filter((item) => item.id !== id));
    }
    setActualizandoId(null);
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

      <section className="stats-card">
        <div className="stats-card__header">
          <span className="stats-card__label">Ocupacion Total</span>
          <BarChart3 className="stats-card__icon" />
        </div>
        <div className="stats-card__value">
          {loadingConflictos ? "--" : `${ocupacion.porcentaje}%`}
        </div>
        <div className="stats-card__progress-container">
          <div className="stats-card__progress-bar" style={{ width: `${ocupacion.porcentaje}%` }} />
        </div>
      </section>

      <section className="conflicts-section">
        <div className="conflicts-section__title-container">
          <MessageSquareWarning className="conflicts-section__alert-icon" />
          <div>
            <h2 className="conflicts-section__title">
              Conflictos reportados ({pendientes})
            </h2>
            <p className="conflicts-section__subtitle">Casos abiertos por empleados y estado de seguimiento.</p>
          </div>
        </div>

        {errorConflictos && (
          <div className="conflicts-section__feedback conflicts-section__feedback--error" role="alert">
            {errorConflictos}
          </div>
        )}

        {loadingConflictos ? (
          <div className="conflicts-section__feedback">Cargando conflictos...</div>
        ) : conflictosOrdenados.length === 0 ? (
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
                {conflictosOrdenados.map((conflicto) => {
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
                          {formatearFecha(conflicto.fecha_creacion)}
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
    </div>
  );
}
