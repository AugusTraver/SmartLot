import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BotonGenerico from "../componentes/boton_generico";
import { GaragesUpdate } from "../servicies/API_Garage";

const parseEstadoBool = (estado) => {
  if (estado === 1 || estado === true || estado === "1" || estado === "activo" || estado === "Abierto" || estado === "abierto" || estado === "true") return true;
  return false;
};

function EditarZona() {
  const navigate = useNavigate();
  const location = useLocation();
  const garageData = location.state?.garage;

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
  console.log("[EditarZona] garageData.estado:", garageData?.estado, "→ parseEstadoBool:", parseEstadoBool(garageData?.estado));

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!garageData) {
      navigate("/gestion_garages", { replace: true });
    }
  }, [garageData, navigate]);


  const volverAGarages = () => {
    navigate("/gestion_garages");
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones personalizadas
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

    const id = garageData.id_garage ?? garageData.idGarage ?? garageData.id ?? garageData._id;

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
            Ajusta la información operativa, el estado y la capacidad del garage
            seleccionado.
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
                onClick={() => { console.log("[Estado] Click Activo"); setEstadoActivo(true); }}
              >
                <CheckCircle2 size={21} />
                <strong>Activo</strong>
                <span>Operando normal</span>
              </button>
              <button
                type="button"
                className={`estado-btn estado-desconectado ${!estadoActivo ? "activo" : ""}`}
                onClick={() => { console.log("[Estado] Click Inactivo"); setEstadoActivo(false); }}
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
                    onClick={() =>
                      setCapacidadNoReservas((valor) => Math.max(0, valor - 1))
                    }
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
           <div className="bloque-titulo">
              <span className="bloque-icono">
                <PersonStanding size={20} />
              </span>
              <h3>Garagistas Encargados</h3>
            </div>
              <div className="campo-formulario">
               <div className="grid-bento">

            {error && (
              <div className="empleados-feedback empleados-feedback-error">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && empleadosFiltrados.length > 0
              ? empleadosFiltrados.map((emp) => (
                <article key={emp.id} className="card-empleado-v3">
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

                 
                  <div className="card-footer-v3">
                    <div className="status-indicator">
                      <div className="green-dot"></div>
                      <span>Activo hoy</span>
                    </div>
                    <div className="footer-bottom-row">
                      <span className="email-v3">{emp.email}</span>
                      <BotonGenerico
                        className="btn-eliminar-v3"
                        onClick={() => handleEliminarEmpleado(emp.id)}
                        aria-label={`Eliminar empleado ${emp.name}`} // Requisito a11y crítico para botones con solo iconos
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
                <p>No hay empleados subidos aun</p>
              </div>
            )}
          </div>
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