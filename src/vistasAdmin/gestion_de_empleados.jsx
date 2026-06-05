import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import {
  Search,
  UserPlus,
  ArrowLeft,
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Trash2,
  Car,
  Archive,
  X,
  RotateCcw
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";

import "./gestion_de_empleados.css";
import Header from "../componentesAdmin/header_admin";
import FooterAdmin from "../componentesAdmin/footer_admin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { UsuariosGetAll, UsuariosGetByGarage, UsuariosDelete, UsuariosPatchEstado } from "../servicies/API_Usuario";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import { ModelosGetAll } from "../servicies/API_Modelo";
import { SedesGetAll } from "../servicies/API_Sede";
import { GaragesGetAll } from "../servicies/API_Garage";

gsap.registerPlugin(useGSAP);

const obtenerListadoUsuarios = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.usuarios)) return datos.usuarios;
  if (Array.isArray(datos?.garages)) return datos.garages;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const obtenerRol = (idRol) => {
  const roles = {
    1: "Admin",
    2: "Empleado",
    3: "Garagista",
    4: "Superadmin",
  };
  return roles[Number(idRol)] || "Empleado";
};

const obtenerIdUsuario = (usuario) => usuario.id ?? usuario.id_usuario ?? usuario._id;

const obtenerSede = (idSede, sedesMap) => {
  if (!idSede) return "Sin sede";
  return sedesMap[Number(idSede)] || `Sede ${idSede}`;
};

const obtenerIdGarageUsuario = (usuario) =>
  usuario.id_garage ??
  usuario.idGarage ??
  usuario.garage_id ??
  usuario.garageId ??
  usuario.garage?.id_garage ??
  usuario.garage?.idGarage ??
  usuario.garage?.id ??
  usuario.garage?._id;

const obtenerNombreGarageUsuario = (usuario) =>
  usuario.garage_nombre ??
  usuario.nombre_garage ??
  usuario.nombreGarage ??
  usuario.garage?.nombre ??
  usuario.garage?.descripcion;

const obtenerGarage = (usuario, garagesMap) => {
  const nombreGarage = obtenerNombreGarageUsuario(usuario);
  if (nombreGarage) return nombreGarage;

  const idGarage = obtenerIdGarageUsuario(usuario);
  if (idGarage === undefined || idGarage === null || idGarage === "") return "Sin garage";

  return garagesMap[Number(idGarage)] || `Garage ${idGarage}`;
};

const completarGarageUsuario = (usuario, garagesPorUsuario) => {
  const idUsuario = obtenerIdUsuario(usuario);
  const idGarageAsignado = garagesPorUsuario.get(Number(idUsuario));

  if (!idGarageAsignado || obtenerIdGarageUsuario(usuario)) return usuario;

  return {
    ...usuario,
    id_garage: idGarageAsignado,
  };
};

const normalizarEmpleado = (usuario, vehiculo = null, modeloNombre = null, sedesMap = {}, garagesMap = {}) => {
  const id = obtenerIdUsuario(usuario);
  const patente = vehiculo?.patente || usuario.patente;
  const modeloName = modeloNombre || usuario.modelo;
  const modeloLabel = modeloName ? `Modelo ${modeloName}` : null;

  return {
    id,
    name: `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || "Empleado sin nombre",
    role: obtenerRol(usuario.id_rol),
    email: usuario.email || "Sin email",
    tel: usuario.telefono || "Sin teléfono",
    parkingSpot: patente ? `Patente ${patente}` : "Sin vehículo",
    parkingLevel: obtenerSede(usuario.id_sede, sedesMap),
    textoSede: obtenerSede(usuario.id_sede, sedesMap),
    sede: obtenerSede(usuario.id_sede, sedesMap),
    garage: obtenerGarage(usuario, garagesMap),
    vehicleModel: modeloLabel,
    activo: usuario.activo !== false,
  };
};

const EmpleadosActionSkeleton = () => (
  <div className="animate-header btn-container-mobile">
    <span className="empleados-btn-skeleton" />
  </div>
);

const EmpleadosToolbarSkeleton = () => (
  <section className="barra-herramientas animate-toolbar" aria-label="Cargando filtros de empleados">
    <div className="empleados-search-skeleton" />
    <div className="filtros-grupo">
      <span className="empleados-select-skeleton" />
      <span className="empleados-filter-skeleton" />
    </div>
  </section>
);

// SKELETON COMPACTO ADAPTADO PARA TU INTERRUPTOR
const RoleSwitchSkeleton = () => (
  <div className="role-switch-skeleton" />
);

const EmpleadosSkeletonGrid = () => (
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
  const { usuario } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchArchivedTerm, setSearchArchivedTerm] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedGarage, setSelectedGarage] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sedesMap, setSedesMap] = useState({});
  const [garagesMap, setGaragesMap] = useState({});
  const [showArchived, setShowArchived] = useState(false);
  const [filtroRolSwitch, setFiltroRolSwitch] = useState("Empleado");

  useEffect(() => {
    setSelectedSede("");
    setSelectedGarage("");
  }, [filtroRolSwitch]);

  useEffect(() => {
    let estaMontado = true;

    const cargarEmpleados = async () => {
      setLoading(true);
      setError("");

      try {
        const [responseUsuarios, responseVehiculos, responseModelos, responseSedes, responseGarages] = await Promise.all([
          UsuariosGetAll(),
          VehiculosGetAll(),
          ModelosGetAll(),
          SedesGetAll(),
          GaragesGetAll(),
        ]);

        if (!estaMontado) return;

        if (!responseUsuarios.respuesta) {
          setError("No se pudieron cargar los empleados.");
          setLoading(false);
          return;
        }

        const todosLosUsuarios = obtenerListadoUsuarios(responseUsuarios.datos);
        const vehiculos = responseVehiculos.respuesta ? obtenerListadoUsuarios(responseVehiculos.datos) : [];
        const modelos = responseModelos.respuesta ? obtenerListadoUsuarios(responseModelos.datos) : [];
        const todasLasSedes = responseSedes.respuesta ? obtenerListadoUsuarios(responseSedes.datos) : [];
        const todosLosGarages = obtenerListadoUsuarios(responseGarages.datos);

        const usuarios = todosLosUsuarios.filter((u) => {
          const idSede = u.id_sede ?? u.idSede;
          const idRol = Number(u.id_rol);
          return Number(idSede) === Number(usuario?.id_sede) && idRol !== 1 && idRol !== 4;
        });

        const sedes = todasLasSedes.filter((s) => Number(s.id) === Number(usuario?.id_sede));

        const garages = todosLosGarages.filter((g) => {
          const idSede = g.id_sede ?? g.idSede;
          return Number(idSede) === Number(usuario?.id_sede);
        });

        const vehiculosPorUsuario = new Map(vehiculos.map((v) => [v.id_usuario, v]));
        const modeloNombrePorId = new Map(modelos.map((m) => [m.id, m.nombre]));

        const sedeNombrePorId = Object.fromEntries(sedes.map((s) => [Number(s.id), s.nombre]));
        setSedesMap(sedeNombrePorId);

        const mapaDeGarajesIndexado = {};
        const idsGarages = [];
        garages.forEach((g) => {
          const idLimpio = g.id_garage ?? g.idGarage ?? g.id ?? g._id;
          if (idLimpio !== undefined && idLimpio !== null) {
            const idGarage = Number(idLimpio);
            idsGarages.push(idGarage);
            mapaDeGarajesIndexado[idGarage] = g.nombre || g.descripcion || `Garage ${idLimpio}`;
          }
        });
        setGaragesMap(mapaDeGarajesIndexado);

        const garagistasPorGarage = await Promise.all(
          idsGarages.map(async (idGarage) => {
            const response = await UsuariosGetByGarage(idGarage);
            return {
              idGarage,
              usuarios: response.respuesta ? obtenerListadoUsuarios(response.datos) : [],
            };
          })
        );

        if (!estaMontado) return;

        const garagesPorUsuario = new Map();
        garagistasPorGarage.forEach(({ idGarage, usuarios: usuariosGarage }) => {
          usuariosGarage.forEach((usuarioGarage) => {
            const idUsuario = obtenerIdUsuario(usuarioGarage);
            if (idUsuario !== undefined && idUsuario !== null) {
              garagesPorUsuario.set(Number(idUsuario), idGarage);
            }
          });
        });

        setEmpleados(
          usuarios.map((usuario) => {
            const usuarioConGarage = completarGarageUsuario(usuario, garagesPorUsuario);
            const vehiculo = vehiculosPorUsuario.get(obtenerIdUsuario(usuarioConGarage));
            const modeloNombre = vehiculo ? modeloNombrePorId.get(vehiculo.id_modelo) : null;
            return normalizarEmpleado(usuarioConGarage, vehiculo, modeloNombre, sedeNombrePorId, mapaDeGarajesIndexado);
          })
        );
      } catch (err) {
        console.error("Error crítico en la carga de datos:", err);
        setError("Ocurrió un error inesperado al procesar la información.");
      } finally {
        if (estaMontado) setLoading(false);
      }
    };

    cargarEmpleados();

    return () => {
      estaMontado = false;
    };
  }, []);

  useEffect(() => {
    if (!showArchived) {
      setSearchArchivedTerm("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") setShowArchived(false);
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [showArchived]);

  const handleArchivarEmpleado = async (id, name) => {
    const result = await Swal.fire({
      title: "@Archivar a este empleado?",
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
      title: "@Eliminar permanentemente?",
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

  const sedesDisponibles = useMemo(() => {
    const empleadosDeRol = empleados.filter(
      (emp) => emp.role === "Empleado" && emp.activo !== false && emp.sede !== "Sin sede"
    );
    return Array.from(new Set(empleadosDeRol.map((emp) => emp.sede))).filter(Boolean);
  }, [empleados]);

  const garagesDisponibles = useMemo(() => {
    const garajistasActivos = empleados.filter(
      (emp) => emp.role === "Garagista" && emp.activo !== false && emp.garage !== "Sin garage"
    );
    return Array.from(new Set(garajistasActivos.map((emp) => emp.garage))).filter(Boolean);
  }, [empleados]);

  const empleadosFiltrados = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return empleados.filter((emp) => {
      const coincideBusqueda =
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query);

      let coincideUbicacion = true;
      if (filtroRolSwitch === "Empleado") {
        coincideUbicacion = !selectedSede || (selectedSede === "Todas" && emp.sede !== "Sin sede") || emp.sede === selectedSede;
      } else {
        coincideUbicacion = !selectedGarage || (selectedGarage === "Todas" && emp.garage !== "Sin garage") || emp.garage === selectedGarage;
      }

      const coincideRolSwitch = emp.role === filtroRolSwitch;

      return coincideBusqueda && coincideUbicacion && coincideRolSwitch && emp.activo !== false;
    });
  }, [searchTerm, selectedSede, selectedGarage, filtroRolSwitch, empleados]);

  const empleadosArchivados = useMemo(() => {
    const query = searchArchivedTerm.toLowerCase().trim();
    return empleados.filter((emp) => {
      const esInactivo = emp.activo === false;
      if (!query) return esInactivo;

      const coincideBusqueda =
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query);

      return esInactivo && coincideBusqueda;
    });
  }, [searchArchivedTerm, empleados]);

  const totalArchivadosReal = useMemo(
    () => empleados.filter((emp) => emp.activo === false).length,
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
              <h1 className="titulo-vista">Gestión de Empleados</h1>
              <p className="subtitulo-vista">
                Administra todo el personal.
              </p>
            </div>
          </div>
          <div className="animate-header btn-container-mobile header-actions-group">
            <BotonGenerico
              className="btn-archivados"
              onClick={() => setShowArchived(true)}
              aria-label="Ver empleados archivados"
            >
              <Archive size={20} />
              <span>Archivados</span>
              {totalArchivadosReal > 0 && (
                <span className="archived-count-badge">{totalArchivadosReal}</span>
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
        </header>

        {loading ? (
          <EmpleadosToolbarSkeleton />
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



            {/* POSICIÓN FIJA ORIGINAL: El renderizado condicional del Switch o su Skeleton según la API */}
            {loading ? (
              <RoleSwitchSkeleton />
            ) : (
              <div className="role-switch-container">
                <div className={`role-switch-slider ${filtroRolSwitch === "Garagista" ? "slide-right" : ""}`} />
                <button
                  type="button"
                  className={`role-switch-btn ${filtroRolSwitch === "Empleado" ? "active" : ""}`}
                  onClick={() => setFiltroRolSwitch("Empleado")}
                >
                  <span style={{ color: filtroRolSwitch === "Empleado" ? "white" : "#64748B" }}>Empleados</span>
                </button>
                <button
                  type="button"
                  className={`role-switch-btn ${filtroRolSwitch === "Garagista" ? "active" : ""}`}
                  onClick={() => setFiltroRolSwitch("Garagista")}
                >
                  <span style={{ color: filtroRolSwitch === "Garagista" ? "white" : "#64748B" }}>Garagistas</span>
                </button>
              </div>
            )}
            <div className="filtros-grupo">
              <div className="select-wrapper">
                {filtroRolSwitch === "Empleado" ? (
                  <select
                    className="btn-selector-sede"
                    value={selectedSede}
                    onChange={(e) => setSelectedSede(e.target.value)}
                  >
                    <option value="">Filtrar por sede</option>
                    <option value="Todas">Todas las sedes</option>
                    {sedesDisponibles.map((sede) => (
                      <option key={sede} value={sede}>
                        {sede}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className="btn-selector-sede"
                    value={selectedGarage}
                    onChange={(e) => setSelectedGarage(e.target.value)}
                  >
                    <option value="">Filtrar por garage</option>
                    <option value="Todas">Todos los garages</option>
                    {garagesDisponibles.map((garage) => (
                      <option key={garage} value={garage}>
                        {garage}
                      </option>
                    ))}
                  </select>
                )}
                <ChevronDown size={18} className="chevron-select-icon" />
              </div>

              {((filtroRolSwitch === "Empleado" && selectedSede) || (filtroRolSwitch === "Garagista" && selectedGarage)) && (
                <button
                  className="btn-icon-filtros"
                  type="button"
                  onClick={() => {
                    setSelectedSede("");
                    setSelectedGarage("");
                  }}
                  aria-label="Restablecer filtros"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              )}
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
                      <span>{filtroRolSwitch === "Empleado" ? emp.sede : emp.garage}</span>
                    </div>
                  </div>

                  {filtroRolSwitch === "Empleado" && (
                    <div className="parking-section-v3">
                      <div className="parking-pill-v3">
                        <div className="p-icon-box"><Car size={25} /></div>
                        <div className="parking-details-v3">
                          <span className="spot-v3">{emp.parkingSpot}</span>
                          <span className="level-v3">{emp.vehicleModel || emp.parkingLevel}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card-footer-v3">
                    <div className="status-indicator">
                      <div className="green-dot"></div>
                      <span>Activo hoy</span>
                    </div>
                    <div className="footer-bottom-row">
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="email-v3">{emp.email}</span>
                        <span className="empTel">Tel: {emp.tel}</span>
                      </div>
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
                  <p>No hay personal cargado bajo esta categoría</p>
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

            <div className="modal-archive-search-container" style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-color, #e2e8f0)" }}>
              <div className="contenedor-busqueda" style={{ width: "100%" }}>
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Buscar archivados por nombre, email o cargo..."
                  className="input-moderno"
                  value={searchArchivedTerm}
                  onChange={(e) => setSearchArchivedTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-archive-body">
              {totalArchivadosReal === 0 ? (
                <div className="empty-archived">
                  <Archive size={48} className="empty-archived-icon" />
                  <p className="empty-archived-text">No hay empleados archivados</p>
                  <p className="empty-archived-sub">
                    Los empleados que archives aparecerán aquí.
                  </p>
                </div>
              ) : empleadosArchivados.length === 0 ? (
                <div className="no-results" style={{ padding: "40px 20px", textAlign: "center" }}>
                  <p>No se encontraron archivados para "{searchArchivedTerm}"</p>
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
                      <span>{emp.role === "Empleado" ? emp.sede : emp.garage}</span>
                    </div>

                    {emp.role === "Empleado" && (
                      <div className="parking-section-v3">
                        <div className="parking-pill-v3">
                          <div className="p-icon-box"><Car size={25} /></div>
                          <div className="parking-details-v3">
                            <span className="spot-v3">{emp.parkingSpot}</span>
                            <span className="level-v3">{emp.vehicleModel || emp.parkingLevel}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="card-footer-v3">
                      <div className="status-indicator archived-status">
                        <div className="gray-dot"></div>
                        <span>Inactivo</span>
                      </div>
                      <div className="footer-bottom-row">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span className="email-v3">{emp.email}</span>
                          <span className="empTel">Tel: {emp.tel}</span>
                        </div>
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