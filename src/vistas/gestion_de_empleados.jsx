import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  ArrowLeft,
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Trash2,
  Car,
  CarFront,
  Archive,
  X,
  RotateCcw
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";

import "./gestion_de_empleados.css";
import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";
import BotonGenerico from "../componentes/boton_generico";
import { UsuariosGetAll, UsuariosDelete, UsuariosPatchEstado } from "../servicies/API_Usuario";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import { ModelosGetAll } from "../servicies/API_Modelo";
import { SedesGetAll } from "../servicies/API_Sede";

gsap.registerPlugin(useGSAP);


const obtenerListadoUsuarios = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.usuarios)) return datos.usuarios;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const obtenerRol = (idRol) => {
  const roles = {
    1: "Admin",
    2: "Empleado",
    3: "Garagista",
  };

  return roles[Number(idRol)] || "Empleado";
};

const obtenerSede = (idSede, sedesMap) => {
  if (!idSede) return "Sin sede";
  return sedesMap[Number(idSede)] || `Sede ${idSede}`;
};

const normalizarEmpleado = (usuario, vehiculo = null, modeloNombre = null, sedesMap = {}) => {
  const id = usuario.id ?? usuario.id_usuario ?? usuario._id;
  const patente = vehiculo?.patente || usuario.patente;
  const modeloName = modeloNombre || usuario.modelo;
  const modeloLabel = modeloName ? `Modelo ${modeloName}` : null;

  return {
    id,
    name: `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || "Empleado sin nombre",
    role: obtenerRol(usuario.id_rol),
    email: usuario.email || "Sin email",
    parkingSpot: patente ? `Patente ${patente}` : "Sin vehículo",
    parkingLevel: obtenerSede(usuario.id_sede, sedesMap),
    sede: obtenerSede(usuario.id_sede, sedesMap),
    vehicleModel: modeloLabel,
    activo: usuario.activo !== false,
  };
};

const EmpleadosActionSkeleton = () => ( // Muestra un botón esquelético para simular la carga de acciones disponibles
  <div className="animate-header btn-container-mobile">
    <span className="empleados-btn-skeleton" />
  </div>
);

const EmpleadosToolbarSkeleton = () => (  // Muestra un conjunto de elementos esqueléticos para simular la carga de la barra de herramientas de empleados
  <section className="barra-herramientas animate-toolbar" aria-label="Cargando filtros de empleados">
    <div className="empleados-search-skeleton" />

    <div className="filtros-grupo">
      <span className="empleados-select-skeleton" />
      <span className="empleados-filter-skeleton" />
    </div>
  </section>
);

const EmpleadosSkeletonGrid = () => ( // Muestra 6 tarjetas esqueléticas para simular la carga de empleados
  <div className="grid-bento" aria-label="Cargando empleados">
    {Array.from({ length: 6 }).map((_, index) => (
      <article className="card-empleado-skeleton" key={index}>
        <div className="empleado-skeleton-header">
          <span className="empleado-skeleton-line empleado-skeleton-name" />
          <span className="empleado-skeleton-badge" />
        </div>

        <span className="empleado-skeleton-line empleado-skeleton-sede" />

        <div className="empleado-skeleton-parking">
          <span className="empleado-skeleton-line empleado-skeleton-label" />
          <div className="empleado-skeleton-pill">
            <span className="empleado-skeleton-parking-icon" />
            <div className="empleado-skeleton-parking-lines">
              <span className="empleado-skeleton-line empleado-skeleton-spot" />
              <span className="empleado-skeleton-line empleado-skeleton-level" />
            </div>
          </div>
        </div>

        <div className="empleado-skeleton-footer">
          <span className="empleado-skeleton-line empleado-skeleton-status" />
          <span className="empleado-skeleton-line empleado-skeleton-email" />
        </div>
      </article>
    ))}
  </div>
);

const GestionEmpleados = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSede, setSelectedSede] = useState("Todas");
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sedesMap, setSedesMap] = useState({});
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    let estaMontado = true;

    const cargarEmpleados = async () => {
      setLoading(true);
      setError("");

      const [responseUsuarios, responseVehiculos, responseModelos, responseSedes] = await Promise.all([
        UsuariosGetAll(),
        VehiculosGetAll(),
        ModelosGetAll(),
        SedesGetAll(),
      ]);

      if (!estaMontado) return;

      if (!responseUsuarios.respuesta) {
        setError("No se pudieron cargar los empleados.");
        setLoading(false);
        return;
      }

      const usuarios = obtenerListadoUsuarios(responseUsuarios.datos);
      const vehiculos = responseVehiculos.respuesta
        ? Array.isArray(responseVehiculos.datos)
          ? responseVehiculos.datos
          : obtenerListadoUsuarios(responseVehiculos.datos)
        : [];
      const modelos = responseModelos.respuesta
        ? Array.isArray(responseModelos.datos)
          ? responseModelos.datos
          : obtenerListadoUsuarios(responseModelos.datos)
        : [];
      const sedes = responseSedes.respuesta
        ? Array.isArray(responseSedes.datos)
          ? responseSedes.datos
          : obtenerListadoUsuarios(responseSedes.datos)
        : [];

      const vehiculosPorUsuario = new Map(
        vehiculos.map((vehiculo) => [vehiculo.id_usuario, vehiculo])
      );
      const modeloNombrePorId = new Map(
        modelos.map((modelo) => [modelo.id, modelo.nombre])
      );
      const sedeNombrePorId = Object.fromEntries(
        sedes.map((sede) => [Number(sede.id), sede.nombre])
      );
      setSedesMap(sedeNombrePorId);

      setEmpleados(
        usuarios.map((usuario) => {
          const vehiculo = vehiculosPorUsuario.get(usuario.id ?? usuario.id_usuario ?? usuario._id);
          const modeloNombre = vehiculo ? modeloNombrePorId.get(vehiculo.id_modelo) : null;

          return normalizarEmpleado(usuario, vehiculo, modeloNombre, sedeNombrePorId);
        })
      );
      setLoading(false);
    };

    cargarEmpleados();

    return () => {
      estaMontado = false;
    };
  }, []);
  useEffect(() => {
    if (!showArchived) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setShowArchived(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showArchived]);

  const handleArchivarEmpleado = async (id, name) => {
    const result = await Swal.fire({
      title: "¿Archivar a este empleado?",
      text: `${name || "Este empleado"} quedará inactivo y se moverá a archivados.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, archivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await UsuariosPatchEstado(id, false);

      if (response.respuesta) {
        gsap.to(`.card-id-${id}`, {
          scale: 0.9,
          opacity: 0,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            setEmpleados((prev) =>
              prev.map((emp) =>
                emp.id === id ? { ...emp, activo: false } : emp
              )
            );
          }
        });
      } else {
        Swal.fire("Error", "No se pudo archivar al empleado.", "error");
      }
    } catch (err) {
      console.error("Error al archivar el empleado:", err);
      Swal.fire("Error de red", "Hubo un error al conectar con el servidor.", "error");
    }
  };

  const handleRestaurarEmpleado = async (id, name) => {
    try {
      const response = await UsuariosPatchEstado(id, true);

      if (response.respuesta) {
        setEmpleados((prev) =>
          prev.map((emp) =>
            emp.id === id ? { ...emp, activo: true } : emp
          )
        );
        Swal.fire({
          title: "Restaurado",
          text: `${name || "El empleado"} ha sido restaurado correctamente.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "No se pudo restaurar al empleado.", "error");
      }
    } catch (err) {
      console.error("Error al restaurar el empleado:", err);
      Swal.fire("Error de red", "Hubo un error al conectar con el servidor.", "error");
    }
  };

  const handleEliminarPermanente = async (id, name) => {
    const result = await Swal.fire({
      title: "¿Eliminar permanentemente?",
      text: `${name || "Este empleado"} será eliminado del sistema. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await UsuariosDelete(id);

      if (response.respuesta) {
        setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
        Swal.fire("Eliminado", "El empleado ha sido eliminado permanentemente.", "success");
      } else {
        Swal.fire("Error", "No se pudo eliminar al empleado.", "error");
      }
    } catch (err) {
      console.error("Error al eliminar el empleado:", err);
      Swal.fire("Error de red", "Hubo un error al conectar con el servidor.", "error");
    }
  };
  const sedesDisponibles = useMemo(
    () => Array.from(new Set(empleados.map((emp) => emp.sede))).filter(Boolean),
    [empleados]
  );

  const empleadosFiltrados = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return empleados.filter((emp) => {
      const coincideBusqueda =
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query);

      const coincideSede = selectedSede === "Todas" || emp.sede === selectedSede;

      return coincideBusqueda && coincideSede && emp.activo !== false;
    });
  }, [searchTerm, selectedSede, empleados]);

  const empleadosArchivados = useMemo(
    () => empleados.filter((emp) => emp.activo === false),
    [empleados]
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
      tl.from(".animate-header", { y: 30, opacity: 0, stagger: 0.1 }).from(
        ".animate-toolbar",
        { y: 20, opacity: 0 },
        "-=0.5"
      );
    },
    { scope: containerRef }
  );

  useGSAP(() => {
    if (empleadosFiltrados.length > 0) {
      gsap.fromTo(
        ".card-empleado-v3",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }
  }, [empleadosFiltrados]);

  useGSAP(() => {
    if (showArchived) {
      gsap.fromTo(
        ".modal-archive-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(
        ".modal-archive-panel",
        { y: 30, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", delay: 0.05 }
      );
    }
  }, [showArchived]);

  return (
    <div className="gestion-empleados" ref={containerRef}>
      <Header />

      <main className="envoltorio-contenido">
        <header className="header-seccion">
          <div className="header-left-group animate-header">
            <button className="boton-back" onClick={() => navigate("/")}>
              <ArrowLeft size={24} />
            </button>
            <div className="textos-titulos">
              <h1 className="titulo-vista">Gestion de Empleados</h1>
              <p className="subtitulo-vista">
                Administra el acceso y roles de todo el personal.
              </p>
            </div>
          </div>
          {loading ? (
            <EmpleadosActionSkeleton />
          ) : (
            <div className="animate-header btn-container-mobile header-actions-group">
              <BotonGenerico
                className="btn-archivados"
                onClick={() => setShowArchived(true)}
                aria-label="Ver empleados archivados"
              >
                <Archive size={20} />
                <span>Archivados</span>
                {empleadosArchivados.length > 0 && (
                  <span className="archived-count-badge">{empleadosArchivados.length}</span>
                )}
              </BotonGenerico>
              <BotonGenerico
                className="btn-primario"
                onClick={() => navigate("/agregar_empleado")}
              >
                <UserPlus size={20} />
                <span>Agregar empleado</span>
              </BotonGenerico>
            </div>
          )}
        </header>

        {loading ? (
          <EmpleadosToolbarSkeleton /> // Muestra la barra de herramientas esquelética mientras se cargan los empleados
        ) : (
          <section className="barra-herramientas animate-toolbar">
            <div className="contenedor-busqueda">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o cargo..."
                className="input-moderno"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filtros-grupo">
              <div className="select-wrapper">
                <select
                  className="btn-selector-sede"
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                >
                  <option value="Todas">Todas las sedes</option>
                  {sedesDisponibles.map((sede) => (
                    <option key={sede} value={sede}>
                      {sede}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="chevron-select-icon" />
              </div>

              <button
                className="btn-icon-filtros"
                type="button"
                onClick={() => setSelectedSede("Todas")}
                aria-label="Restablecer filtros de sede"
              >
                <SlidersHorizontal size={18} strokeWidth={2.5} />
              </button>
            </div>
          </section>
        )}

        {loading ? (
          <EmpleadosSkeletonGrid />
        ) : (
          <div className="grid-bento">

            {error && (
              <div className="empleados-feedback empleados-feedback-error">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && empleadosFiltrados.length > 0
              ? empleadosFiltrados.map((emp) => (
                <article key={emp.id} className={`card-empleado-v3 card-id-${emp.id}`}>
                  <div className="card-header-v3">
                    <h3 className="emp-name-v3">{emp.name}</h3>
                    <span className="role-badge-v3">{emp.role}</span>
                  </div>

                  <div className="card-body-v3">
                    <div className="empleado-sede-line">
                      <MapPin size={14} />
                      <span>{emp.sede}</span>
                    </div>
                  </div>

                  <div className="parking-section-v3">
                    <p className="parking-label-v3">VEHÍCULO</p>
                    <div className="parking-pill-v3">
                      <div className="p-icon-box"><Car size={25} /></div>
                      <div className="parking-details-v3">
                        <span className="spot-v3">{emp.parkingSpot}</span>
                        <span className="level-v3">{emp.vehicleModel || emp.parkingLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer-v3">
                    <div className="status-indicator">
                      <div className="green-dot"></div>
                      <span>Activo hoy</span>
                    </div>
                    <div className="footer-bottom-row">
                      <span className="email-v3">{emp.email}</span>
                      <BotonGenerico
                        className="btn-eliminar-v3"
                        onClick={() => handleArchivarEmpleado(emp.id, emp.name)}
                        aria-label={`Archivar empleado ${emp.name}`}
                      >
                        <Trash2 size={18} className="trash-icon-v3" />
                      </BotonGenerico>
                    </div>
                  </div>
                </article>
              ))
              : null}

            {!loading && !error && empleadosFiltrados.length === 0 && (
              <div className="no-results">
                {searchTerm ? (
                  <p>No se encontraron resultados para "{searchTerm}"</p>
                ) : (
                  <p>No hay empleados subidos aun</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {showArchived && (
        <div className="modal-archive-overlay" onClick={() => setShowArchived(false)}>
          <div className="modal-archive-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-archive-header">
              <div className="modal-archive-title-group">
                <Archive size={24} />
                <h2>Empleados Archivados</h2>
              </div>
              <button
                className="modal-archive-close"
                onClick={() => setShowArchived(false)}
                aria-label="Cerrar archivados"
              >
                <X size={22} />
              </button>
            </div>

            <div className="modal-archive-body">
              {empleadosArchivados.length === 0 ? (
                <div className="empty-archived">
                  <Archive size={48} className="empty-archived-icon" />
                  <p className="empty-archived-text">No hay empleados archivados</p>
                  <p className="empty-archived-sub">
                    Los empleados que archives aparecerán aquí.
                  </p>
                </div>
              ) : (
                empleadosArchivados.map((emp) => (
                  <article key={emp.id} className="card-archivado">
                    <div className="card-archivado-top">
                      <div className="card-archivado-info">
                        <h3 className="archivado-name">{emp.name}</h3>
                        <span className="role-badge-v3">{emp.role}</span>
                      </div>
                      <span className="badge-archivado">Archivado</span>
                    </div>

                    <div className="empleado-sede-line">
                      <MapPin size={14} />
                      <span>{emp.sede}</span>
                    </div>

                    <div className="parking-section-v3">
                      <p className="parking-label-v3">VEHÍCULO</p>
                      <div className="parking-pill-v3">
                        <div className="p-icon-box"><Car size={25} /></div>
                        <div className="parking-details-v3">
                          <span className="spot-v3">{emp.parkingSpot}</span>
                          <span className="level-v3">{emp.vehicleModel || emp.parkingLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer-v3">
                      <div className="status-indicator archived-status">
                        <div className="gray-dot"></div>
                        <span>Inactivo</span>
                      </div>
                      <div className="footer-bottom-row">
                        <span className="email-v3">{emp.email}</span>
                        <div className="archivado-actions">
                          <BotonGenerico
                            className="btn-restaurar"
                            onClick={() => handleRestaurarEmpleado(emp.id, emp.name)}
                            aria-label={`Restaurar empleado ${emp.name}`}
                          >
                            <RotateCcw size={16} />
                            <span>Restaurar</span>
                          </BotonGenerico>
                          <BotonGenerico
                            className="btn-eliminar-archivado"
                            onClick={() => handleEliminarPermanente(emp.id, emp.name)}
                            aria-label={`Eliminar permanentemente ${emp.name}`}
                          >
                            <Trash2 size={16} />
                          </BotonGenerico>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <FooterAdmin />
    </div>
  );
};

export default GestionEmpleados;


