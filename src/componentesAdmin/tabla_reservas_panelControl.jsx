import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { ReservasGetAll } from '../servicies/API_Reserva';
import { UsuariosGetAll } from '../servicies/API_Usuario';
import { GaragesGetAll } from '../servicies/API_Garage';
import { SedesGetAll } from '../servicies/API_Sede';
import "./tabla_reservas_panelControl.css";

const AVATAR_COLORS = ["blue", "orange", "green", "purple", "pink", "teal"];
const ITEMS_PER_PAGE = 3;

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.reservas)) return datos.reservas;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const extraerFechaStr = (datetime) => {
  if (!datetime) return "";
  const conEspacio = datetime.split(" ");
  if (conEspacio.length > 1) return conEspacio[0];
  return datetime.split("T")[0];
};

const extraerHoraLocal = (fechaStr) => {
  if (!fechaStr) return "--:--";
  const valor = String(fechaStr);
  if (/^\d{2}:\d{2}/.test(valor)) return valor.slice(0, 5);
  if (valor.includes("T")) {
    const hora = valor.split("T")[1]?.slice(0, 5);
    return hora || "--:--";
  }
  const partes = valor.split(" ");
  if (partes.length > 1) return partes[1].slice(0, 5);
  return "--:--";
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
  if (esMismaFecha(fechaReserva, manana)) return "Mañana";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(fechaReserva);
};

export default function TablaReservasPanleControl() {
  const { usuario } = useAuth();
  const [reservasCrudas, setReservasCrudas] = useState([]);
  const [usuariosMap, setUsuariosMap] = useState({});
  const [garagesList, setGaragesList] = useState([]);
  const [garagesMap, setGaragesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeChip, setActiveChip] = useState("Todas");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let montado = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [resRes, usuRes, garRes, sedesRes] = await Promise.all([
          ReservasGetAll(),
          UsuariosGetAll(),
          GaragesGetAll(),
          SedesGetAll(),
        ]);

        if (!montado) return;

        const usuariosArray = obtenerListado(usuRes.datos);
        const uMap = {};
        usuariosArray.forEach((u) => {
          const id = u.id ?? u.id_usuario ?? u._id;
          uMap[id] = u;
        });
        setUsuariosMap(uMap);

        const garArray = obtenerListado(garRes.datos);

        const adminIdSede = Number(usuario?.id_sede);
        const empresaAdmin = Number(usuario?.id_empresa);
        const tieneEmpresa = !isNaN(empresaAdmin) && empresaAdmin > 0;

        let garagesFiltrados = garArray;
        if (adminIdSede) {
          garagesFiltrados = garArray.filter((g) => Number(g.id_sede ?? g.idSede) === adminIdSede);
        } else if (tieneEmpresa) {
          const sedesArray = obtenerListado(sedesRes.datos);
          const sedesIdsEmpresa = new Set(
            sedesArray
              .filter((s) => Number(s.id_empresa) === empresaAdmin)
              .map((s) => Number(s.id))
          );
          garagesFiltrados = garArray.filter((g) =>
            sedesIdsEmpresa.has(Number(g.id_sede ?? g.idSede))
          );
        }

        const gMap = {};
        garagesFiltrados.forEach((g) => {
          const id = g.id_garage ?? g.idGarage ?? g.id ?? g._id;
          gMap[id] = g.nombre || g.name || g.descripcion || "Garage";
        });
        setGaragesMap(gMap);
        setGaragesList(garagesFiltrados);

        const reservasArray = obtenerListado(resRes.datos);
        setReservasCrudas(reservasArray);
      } catch (err) {
        console.error("Error al cargar datos del panel:", err);
        if (montado) setError("Error al conectar con el servidor.");
      } finally {
        if (montado) setLoading(false);
      }
    };

    fetchData();
    return () => { montado = false; };
  }, [usuario]);

  const reservasNormalizadas = useMemo(() => {
    const adminIdSede = Number(usuario?.id_sede);
    const empresaAdmin = Number(usuario?.id_empresa);
    const adminSinSede = !adminIdSede || isNaN(adminIdSede);
    const tieneEmpresa = !isNaN(empresaAdmin) && empresaAdmin > 0;

    const userIdsPermitidos = new Set();
    Object.values(usuariosMap).forEach((u) => {
      const userId = Number(u.id ?? u.id_usuario ?? u._id);
      if (!adminSinSede) {
        if (Number(u.id_sede ?? u.idSede) === adminIdSede) {
          userIdsPermitidos.add(userId);
        }
      } else if (tieneEmpresa) {
        if (Number(u.id_empresa ?? u.idEmpresa) === empresaAdmin) {
          userIdsPermitidos.add(userId);
        }
      } else {
        userIdsPermitidos.add(userId);
      }
    });

    const filtrarActivo = !adminSinSede || tieneEmpresa;
    let reservasScope = reservasCrudas;
    if (filtrarActivo && userIdsPermitidos.size > 0) {
      reservasScope = reservasCrudas.filter((r) => {
        const idUsuario = Number(r.id_usuario ?? r.idUsuario ?? r.usuario_id);
        return userIdsPermitidos.has(idUsuario);
      });
    }

    return reservasScope.map((r) => {
      const idUsuario = r.id_usuario ?? r.idUsuario ?? r.usuario_id;
      const userData = usuariosMap[idUsuario] ?? {};
      const nombre = userData.nombre ?? "";
      const apellido = userData.apellido ?? "";
      const nombreCompleto = `${nombre} ${apellido}`.trim() || "Usuario";
      const iniciales = ((nombre[0] ?? "") + (apellido[0] ?? "")).toUpperCase() || "?";
      const colorIdx = Number(idUsuario) % AVATAR_COLORS.length;

      const idGarage = r.id_garage ?? r.idGarage ?? r.garage_id;
      const garageNombre = garagesMap[idGarage] ?? "Garage";

      const fechaEntrada = r.fecha_entrada ?? r.fechaEntrada ?? r.fecha_inicio;
      const fechaSalida = r.fecha_salida ?? r.fechaSalida ?? r.fecha_fin;

      const fechaStr = extraerFechaStr(fechaEntrada);
      const fechaDisplay = formatearFecha(fechaStr);
      const horaInicio = extraerHoraLocal(fechaEntrada);
      const horaFin = extraerHoraLocal(fechaSalida);

      const plaza = r.plaza ?? r.nro_plaza ?? r.numero_plaza ?? r.espacio ?? "—";
      const zona = r.nombre_zona ?? r.zona ?? r.nivel ?? r.sector ?? "—";

      return {
        id: r.id ?? r.id_reserva,
        iniciales,
        nombre: nombreCompleto,
        color: AVATAR_COLORS[colorIdx],
        plaza,
        zona,
        id_garage: idGarage,
        garage_nombre: garageNombre,
        fecha: fechaDisplay,
        hora: `${horaInicio} - ${horaFin}`,
        email: userData.email ?? "",
        telefono: userData.telefono ?? "",
        userId: idUsuario,
      };
    });
  }, [reservasCrudas, usuariosMap, garagesMap, usuario]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeChip]);

  const chips = useMemo(() => {
    const nombresGarages = garagesList
      .map((g) => g.nombre || g.name || g.descripcion || "Garage")
      .filter(Boolean);
    return ["Todas", "Hoy", ...nombresGarages];
  }, [garagesList]);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return reservasNormalizadas.filter((item) => {
      const coincideBusqueda =
        !query ||
        item.nombre.toLowerCase().includes(query) ||
        item.plaza.toLowerCase().includes(query) ||
        item.zona.toLowerCase().includes(query) ||
        item.garage_nombre.toLowerCase().includes(query);

      let coincideChip = true;
      if (activeChip === "Hoy") {
        coincideChip = item.fecha.toLowerCase().includes("hoy");
      } else if (activeChip !== "Todas") {
        coincideChip = item.garage_nombre === activeChip;
      }

      return coincideBusqueda && coincideChip;
    });
  }, [reservasNormalizadas, searchTerm, activeChip]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  }, [filteredData]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(p => Math.max(p - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage(p => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const pageButtons = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <div className="reservations-container">
      <div className="filter-bar">
        <div className="filter-bar__title-row">
          <ClipboardList size={22} className="filter-bar__title-icon" />
          <h2 className="reservations-title">Tabla de reservas</h2>
        </div>
        <div className="filter-bar__search-wrap">
          <Search size={20} className="filter-bar__search-icon" />
          <input
            type="text"
            placeholder="Buscar usuario, plaza o garage..."
            className="filter-bar__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!loading && (
        <div className="chips-group">
          {chips.map((chip) => (
            <button
              key={chip}
              className={`chip ${activeChip === chip ? "chip--active" : ""}`}
              onClick={() => setActiveChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className="reservations-table-wrapper">
        <table className="reservations-table">
          <thead className="reservations-table__head" onClick={() => setIsOpen(o => !o)}>
            <tr>
              <th>
                <span className="reservations-table__head-toggle">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  USUARIO
                </span>
              </th>
              <th>PLAZA / ZONA</th>
              <th>FECHA / HORA</th>
            </tr>
          </thead>
          {isOpen && (
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="reservations-table__empty">
                    Cargando reservas...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="reservations-table__empty">
                    {error}
                  </td>
                </tr>
              ) : reservasNormalizadas.length === 0 ? (
                <tr>
                  <td colSpan="3" className="reservations-table__empty">
                    No hay reservas disponibles
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="reservations-table__empty">
                    No se encontraron reservas para &quot;{searchTerm}&quot;
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="reservations-table__row">
                    <td data-label="USUARIO">
                      <div className="user-info">
                        <div className={`user-info__avatar user-info__avatar--${item.color}`}>
                          {item.iniciales}
                        </div>
                        <div
                          className="user-info__trigger"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            if (window.innerHeight - rect.bottom < 280) {
                              e.currentTarget.classList.add("user-info__trigger--up");
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.classList.remove("user-info__trigger--up");
                          }}
                        >
                          <span className="user-info__name">{item.nombre}</span>
                          {(item.email || item.telefono) && (
                            <div className="user-info__popover">
                              <div className="user-info__popover-header">
                                <div className="user-info__popover-avatar">{item.iniciales}</div>
                                <div>
                                  <div className="user-info__popover-name">{item.nombre}</div>
                                  {item.email && <div className="user-info__popover-email">{item.email}</div>}
                                </div>
                              </div>
                              <div className="user-info__popover-details">
                                {item.telefono && <span className="user-info__popover-detail">{item.telefono}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="PLAZA / ZONA">
                      <div className="cell-block">
                        <span className="cell-block__title">{item.plaza}</span>
                        <span className="cell-block__subtitle">{item.zona}</span>
                      </div>
                    </td>
                    <td data-label="FECHA / HORA">
                      <div className="cell-block">
                        <span className="cell-block__title">{item.fecha}</span>
                        <span className="cell-block__subtitle">{item.hora}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {isOpen && (
        <footer className="pagination">
          <span className="pagination__info">
            {loading
              ? "Cargando..."
              : totalPages <= 1
                ? `Mostrando ${filteredData.length} de ${reservasNormalizadas.length} reservas`
                : `Página ${currentPage} de ${totalPages} (${filteredData.length} reservas)`
            }
          </span>
          {totalPages > 1 && (
            <div className="pagination__controls">
              <button
                className="pagination__btn"
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>
              {pageButtons.map(page => (
                <button
                  key={page}
                  className={`pagination__btn ${currentPage === page ? "pagination__btn--active" : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination__btn"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                aria-label="Siguiente página"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </footer>
      )}
    </div>
  );
}
