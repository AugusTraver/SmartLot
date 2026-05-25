import { useState, useEffect, useMemo } from "react";
import "./editar_zona.css";
import Header from "../componentes/header_admin";
import {
  ArrowLeft,
  Star,
  CarFront,
  Minus,
  Plus,
  Building2,
  MapPin,
  Layers,
  CheckCircle2,
  WifiOff,
  Save,
  X,
  PersonStanding,
  ShieldAlert,
  Trash2, 
  Mail
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BotonGenerico from "../componentes/boton_generico";
import { GaragesUpdate } from "../servicies/API_Garage";
import { UsuariosGetByGarage, UsuariosDelete } from '../servicies/API_Usuario';

const parseEstadoBool = (estado) => {
  if (estado === 1 || estado === true || estado === "1" || estado === "activo" || estado === "Abierto" || estado === "abierto" || estado === "true") return true;
  return false;
};

const obtenerListadoUsuarios = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  return [];
};

function EditarZona() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoGarajistas, setCargandoGarajistas] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const garageData = location.state?.garage;

  const handleEliminarEmpleado = async (id, nombre) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${nombre || "este garajista"}? Esta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    try {
      const response = await UsuariosDelete(id); 

      if (response.respuesta) {
        setUsuarios((prev) => prev.filter((user) => (user.id ?? user.id_usuario) !== id));
        alert("Garajista eliminado con éxito.");
      } else {
        alert("El servidor rechazó la solicitud. No se pudo eliminar al garajista.");
      }
    } catch (err) {
      console.error("Error al eliminar el garajista en el servidor:", err);
      alert("Hubo un error de red o de servidor. Por favor, inténtalo de nuevo.");
    }
  };

  const obtenerIdGarage = (garage) => garage?.id_garage ?? garage?.idGarage ?? garage?.id ?? garage?._id;

  const [estadoActivo, setEstadoActivo] = useState(() => {
    return garageData ? parseEstadoBool(garageData.estado) : true;
  });
  const [capacidad, setCapacidad] = useState(() => {
    return garageData ? Number(garageData.capacidad || 0) : 0;
  });
  const [capacidadReservas, setCapacidadReservas] = useState(() => {
    return garageData ? Number(garageData.capacidad_reservas || 0) : 0;
  });
  const [capacidadNoReservas, setCapacidadNoReservas] = useState(() => {
    return garageData ? Number(garageData.capacidad_para_no_reservas || 0) : 0;
  });
  const [nombreGarage, setNombreGarage] = useState(() => {
    return garageData ? (garageData.nombre || '') : 'Garage B';
  });
  const [piso, setPiso] = useState(() => {
    return garageData ? (garageData.piso || '') : 'Piso 2';
  });
  const [ubicacion, setUbicacion] = useState(() => {
    return garageData ? (garageData.ubicacion || '') : '';
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!garageData) {
      navigate("/gestion_garages", { replace: true });
    }
  }, [garageData, navigate]);

  useEffect(() => {
    let estaMontado = true;

    const cargarGarajistasDelGarage = async () => {
      const garageId = obtenerIdGarage(garageData);
      if (!garageId) return;

      setCargandoGarajistas(true);
      const response = await UsuariosGetByGarage(garageId);
      
      if (!estaMontado) return;

      if (response.respuesta) {
        const listaLimpia = obtenerListadoUsuarios(response.datos);
        setUsuarios(listaLimpia);
      }
      setCargandoGarajistas(false);
    };

    cargarGarajistasDelGarage();

    return () => {
      estaMontado = false;
    };
  }, [garageData]);

  const garajistasAsignados = useMemo(() => {
    return usuarios.filter(user => Number(user.id_rol) === 3);
  }, [usuarios]);

  const volverAGarages = () => {
    navigate("/gestion_garages");
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombreGarage.trim()) {
      setError('❌ El nombre del garage es requerido.');
      return;
    }
    if (nombreGarage.trim().length < 3) {
      setError('❌ El nombre del garage debe tener al menos 3 caracteres.');
      return;
    }

    if (piso === undefined || piso === null || piso.toString().trim() === "") {
      setError('❌ El nivel/planta es requerido.');
      return;
    }
    const pisoNum = Number(piso);
    if (isNaN(pisoNum) || !Number.isInteger(pisoNum)) {
      setError('❌ El nivel/planta debe ser un número entero válido.');
      return;
    }

    if (!ubicacion.trim()) {
      setError('❌ La ubicación es requerida.');
      return;
    }
    if (ubicacion.trim().length < 5) {
      setError('❌ La ubicación debe tener al menos 5 caracteres.');
      return;
    }

    if (capacidad <= 0) {
      setError('❌ La capacidad total debe ser mayor a 0.');
      return;
    }

    if (capacidadReservas < 0 || capacidadNoReservas < 0) {
      setError('❌ Las capacidades no pueden ser negativas.');
      return;
    }

    if (capacidadReservas + capacidadNoReservas !== capacidad) {
      setError(
        `❌ SUMA INVÁLIDA: La capacidad total (${capacidad}) debe ser exactamente igual a la suma de reservas (${capacidadReservas}) y no reservas (${capacidadNoReservas}).`
      );
      return;
    }

    if (!garageData?.id_sede) {
      setError('❌ No se encontró la sede asociada al garage.');
      return;
    }

    setLoading(true);

    const payload = {
       id_sede: garageData.id_sede,
       nombre: nombreGarage.trim(),
       piso: Number(piso),
       ubicacion: ubicacion.trim(),
       estado: estadoActivo,
       capacidad: Number(capacidad),
       capacidad_reservas: Number(capacidadReservas),
       capacidad_para_no_reservas: Number(capacidadNoReservas)
    };

    const id = obtenerIdGarage(garageData);

    const response = await GaragesUpdate(id, payload);
    setLoading(false);

    if (response.respuesta) {
      navigate("/gestion_garages", { replace: true });
    } else {
      const errorMsg = response.datos?.message || response.datos || 'Error desconocido al actualizar en la BD.';
      setError(`❌ Error al actualizar la zona: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    }
  };

  return (
    <div className="editar-zona">
      <Header />

      <main className="contenido-editar-zona">
        <section className="editar-zona-top">
          <button
            className="boton-back-editar"
            onClick={volverAGarages}
            aria-label="Volver a gestión de garages"
          >
            <ArrowLeft size={20} />
          </button>

          <p>CONFIGURACIÓN</p>
          <h1>Edición de garage</h1>
          <span>
            Ajusta la información operativa, el estado y la capacidad del garage seleccionado.
          </span>
        </section>

        <form className="formulario-editar-zona" onSubmit={guardarCambios}>
          <section className="bloque-formulario">
            <div className="bloque-titulo">
              <span className="bloque-icono">
                <Building2 size={20} />
              </span>
              <h3>Información general</h3>
            </div>

            <div className="campo-formulario">
              <label>Nombre del garage</label>
              <input
                type="text"
                placeholder="Garage B, Exterior Norte"
                value={nombreGarage}
                onChange={(e) => setNombreGarage(e.target.value)}
              />
            </div>

            <div className="campos-grid">
              <div className="campo-formulario">
                <label>Nivel / Planta</label>
                <input
                  type="text"
                  value={piso}
                  onChange={(e) => setPiso(e.target.value)}
                  placeholder="Ej: Piso 1, Subsuelo"
                />
              </div>

              <div className="campo-formulario">
                <label>Total de plazas</label>
                <input
                  type="number"
                  value={capacidad === 0 ? '' : capacidad}
                  onChange={(e) => setCapacidad(Number(e.target.value) || 0)}
                  min="1"
                />
              </div>
            </div>

            <div className="campo-formulario">
              <label>Ubicación</label>
              <textarea
                rows="4"
                placeholder="Ubicación del garage"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              />
            </div>
          </section>

          <section className="bloque-formulario">
            <div className="bloque-titulo">
              <span className="bloque-icono">
                <MapPin size={20} />
              </span>
              <h3>Estado operativo</h3>
            </div>

            <div className="estado-container">
              <button
                type="button"
                className={`estado-btn estado-activo ${estadoActivo ? "activo" : ""}`}
                onClick={() => setEstadoActivo(true)}
              >
                <CheckCircle2 size={21} />
                <strong>Activo</strong>
                <span>Operando normal</span>
              </button>
              <button
                type="button"
                className={`estado-btn estado-desconectado ${!estadoActivo ? "activo" : ""}`}
                onClick={() => setEstadoActivo(false)}
              >
                <WifiOff size={21} />
                <strong>Inactivo</strong>
                <span>Sin conexión</span>
              </button>
            </div>
          </section>

          <section className="bloque-formulario">
            <div className="bloque-titulo">
              <span className="bloque-icono">
                <Layers size={20} />
              </span>
              <h3>Gestión de plazas</h3>
            </div>

            <div className="plazas-resumen">
              <span>Capacidad total de la zona</span>
              <strong>{capacidad} plazas</strong>
            </div>

            <div className="plazas-grid">
              <div className="plaza-item">
                <div className="plaza-top">
                  <div className="plaza-icon">
                    <Star size={18} />
                  </div>
                  <span className="plaza-tag">RESERVAS</span>
                </div>

                <h4>Capacidad Reservas</h4>
                <p>Ubicaciones para usuarios con reserva.</p>

                <div className="contador">
                  <button
                    type="button"
                    onClick={() => setCapacidadReservas((valor) => Math.max(0, valor - 1))}
                    disabled={capacidadReservas === 0}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{capacidadReservas}</span>
                  <button
                    type="button"
                    onClick={() => setCapacidadReservas((valor) => valor + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="plaza-item">
                <div className="plaza-top">
                  <div className="plaza-icon">
                    <CarFront size={18} />
                  </div>
                  <span className="plaza-tag">NO RESERVAS</span>
                </div>

                <h4>Capacidad No Reservas</h4>
                <p>Plazas de uso general por llegada.</p>

                <div className="contador">
                  <button
                    type="button"
                    onClick={() => setCapacidadNoReservas((valor) => Math.max(0, valor - 1))}
                    disabled={capacidadNoReservas === 0}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{capacidadNoReservas}</span>
                  <button
                    type="button"
                    onClick={() => setCapacidadNoReservas((valor) => valor + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bloque-formulario">
            <div className="seccion-garajistas-zona">
              <div className="bloque-titulo" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span className="bloque-icono">
                    <PersonStanding size={20} />
                  </span>
                  <h3>Garajistas Asignados</h3>
                </div>
                <BotonGenerico
                  type="button"
                  className="btn-agregar-garajista-zona"
                  onClick={() => {
                    const garageId = obtenerIdGarage(garageData);
                    navigate("/agregar_garajista", { 
                      state: { 
                        id_garage: garageId,
                        garage: garageData
                      } 
                    })
                  }}
                >
                  <Plus size={16} />
                  <span>Agregar Garajista</span>
                </BotonGenerico>
              </div>

              {cargandoGarajistas ? (
                <div className="gz-no-results">
                  <p>Buscando personal asignado en la base de datos...</p>
                </div>
              ) : garajistasAsignados.length > 0 ? (
                /* CORRECCIÓN VISUAL: Grilla e identificación de clases 100% exclusivas e independientes */
                <div className="gz-garajistas-grid">
                  {garajistasAsignados.map((garajista) => {
                    const nombreCompleto = `${garajista.nombre || ''} ${garajista.apellido || ''}`.trim() || "Garajista sin nombre";
                    const garajistaId = garajista.id || garajista.id_usuario;
                    return (
                      <article key={garajistaId} className="gz-garajista-card">
                        <div className="gz-card-header">
                          <h3 className="gz-garajista-name">{nombreCompleto}</h3>
                          <span className="gz-role-badge">Garajista</span>
                        </div>
                        
                        <div className="gz-sede-line">
                          <span>ID: #{garajistaId}</span>
                        </div>

                        <div className="gz-parking-section">
                          <p className="gz-parking-label">CONTACTO OPERATIVO</p>
                          <div className="gz-parking-pill">
                            <div className="gz-icon-box"><Mail size={16}/></div>
                            <div className="gz-parking-details">
                              <span className="gz-spot-text">{garajista.email || 'Sin email'}</span>
                              <span className="gz-level-text">Tel: {garajista.telefono || 'Sin teléfono'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="gz-footer-row">
                          <BotonGenerico
                            className="gz-btn-eliminar"
                            onClick={() => handleEliminarEmpleado(garajistaId, nombreCompleto)}
                            aria-label={`Eliminar garajista ${nombreCompleto}`} 
                          >
                            <Trash2 size={16} className="gz-trash-icon" />
                          </BotonGenerico>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="gz-no-results" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={32} style={{ color: '#94a3b8' }} />
                  <p>No hay ningún garajista asignado operando en este garage actualmente.</p>
                </div>
              )}
            </div>
          </section>

          {error && <div className="error-message" style={{ color: '#d32f2f', padding: '12px', marginBottom: '16px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #d32f2f' }}>{error}</div>}

          <div className="acciones-formulario">
            <BotonGenerico
              type="button"
              className="btn-cancelar"
              onClick={volverAGarages}
            >
              <X size={18} />
              <span>Cancelar</span>
            </BotonGenerico>

            <BotonGenerico type="submit" className="btn-guardar" disabled={loading}>
              <Save size={18} />
              <span>{loading ? "Guardando..." : "Guardar cambios"}</span>
            </BotonGenerico>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditarZona;