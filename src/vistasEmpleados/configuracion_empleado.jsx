import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Car,
  Check,
  Clock,
  Moon,
  Save,
  Sun,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";
import { useAuth } from "../contexts/useAuth";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import "./configuracion_empleado.css";

const STORAGE_KEY = "smartlot_empleado_config";

const defaultConfig = {
  notificaciones: true,
  recordatorioMinutos: "30",
  vehiculoPredeterminado: "",
  horaInicio: "08:00",
  horaFin: "18:00",
  tema: "claro",
};

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.vehiculos)) return datos.vehiculos;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const obtenerIdUsuario = (usuario) => usuario?.id ?? usuario?.id_usuario ?? usuario?._id;
const obtenerIdVehiculo = (vehiculo) => vehiculo?.id ?? vehiculo?.id_vehiculo ?? vehiculo?._id;

const obtenerEtiquetaVehiculo = (vehiculo) => {
  const marca = vehiculo?.marca?.nombre ?? vehiculo?.marca_nombre ?? vehiculo?.marca;
  const modelo = vehiculo?.modelo?.nombre ?? vehiculo?.modelo_nombre ?? vehiculo?.modelo;
  const patente = vehiculo?.patente ?? vehiculo?.placa ?? vehiculo?.matricula;
  const nombre = [marca, modelo].filter(Boolean).join(" ").trim() || "Vehiculo";
  return patente ? `${nombre} (${patente})` : nombre;
};

const cargarConfig = () => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? { ...defaultConfig, ...JSON.parse(guardado) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
};

export default function ConfiguracionEmpleado() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();
  const pageRef = useRef(null);
  const [config, setConfig] = useState(cargarConfig);
  const [vehiculos, setVehiculos] = useState([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const rutaAnterior = location.state?.from || "/empleados_dashboard";

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.45 } });
    tl.from(".configuracion-empleado-back", { x: -12, opacity: 0 })
      .from(".configuracion-empleado-heading > *", { y: 16, opacity: 0, stagger: 0.08 }, "-=0.2")
      .from(".configuracion-empleado-card", { y: 22, opacity: 0, stagger: 0.08 }, "-=0.15");
  }, { scope: pageRef });

  useEffect(() => {
    let montado = true;

    const cargarVehiculos = async () => {
      setLoadingVehiculos(true);
      const resultado = await VehiculosGetAll();
      if (!montado) return;

      if (resultado.respuesta) {
        const idUsuario = Number(obtenerIdUsuario(usuario));
        const vehiculosUsuario = obtenerListado(resultado.datos).filter((vehiculo) =>
          Number(vehiculo.id_usuario ?? vehiculo.idUsuario ?? vehiculo.usuario_id) === idUsuario
        );
        setVehiculos(vehiculosUsuario);
      }

      setLoadingVehiculos(false);
    };

    cargarVehiculos();

    return () => {
      montado = false;
    };
  }, [usuario]);

  const vehiculoActual = useMemo(
    () => vehiculos.find((vehiculo) => String(obtenerIdVehiculo(vehiculo)) === String(config.vehiculoPredeterminado)),
    [config.vehiculoPredeterminado, vehiculos]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setGuardado(false);
  };

  const handleTema = (tema) => {
    setConfig((prev) => ({ ...prev, tema }));
    setGuardado(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    document.documentElement.dataset.empleadoTheme = config.tema === "oscuro" ? "oscuro" : "claro";
    setGuardado(true);
    navigate(rutaAnterior, { replace: true });
  };

  return (
    <div className={`configuracion-empleado-page tema-${config.tema}`} ref={pageRef}>
      <HeaderEmpleado />

      <main className="configuracion-empleado-main">
        <button
          type="button"
          className="configuracion-empleado-back"
          onClick={() => navigate(rutaAnterior)}
          aria-label="Volver al panel"
        >
          <ArrowLeft size={20} />
        </button>

        <header className="configuracion-empleado-heading">
          <span>Preferencias</span>
          <h1>Configuracion</h1>
          <p>Define como queres reservar, recibir avisos y ver tu panel.</p>
        </header>

        <form className="configuracion-empleado-form" onSubmit={handleSubmit}>
          <section className="configuracion-empleado-card">
            <div className="configuracion-card-title">
              <span className="configuracion-card-icon"><Bell size={18} /></span>
              <div>
                <h2>Notificaciones</h2>
                <p>Recordatorios antes de tus reservas.</p>
              </div>
            </div>

            <label className="configuracion-toggle-row">
              <span>Recibir avisos</span>
              <input
                type="checkbox"
                name="notificaciones"
                checked={config.notificaciones}
                onChange={handleChange}
              />
              <span className="configuracion-switch" aria-hidden="true" />
            </label>

            <label className="configuracion-field">
              <span>Recordarme antes</span>
              <select
                name="recordatorioMinutos"
                value={config.recordatorioMinutos}
                onChange={handleChange}
                disabled={!config.notificaciones}
              >
                <option value="10">10 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
              </select>
            </label>
          </section>

          <section className="configuracion-empleado-card">
            <div className="configuracion-card-title">
              <span className="configuracion-card-icon"><Car size={18} /></span>
              <div>
                <h2>Reserva rapida</h2>
                <p>Estos datos se precargan en nueva reserva.</p>
              </div>
            </div>

            <label className="configuracion-field">
              <span>Vehiculo predeterminado</span>
              <select
                name="vehiculoPredeterminado"
                value={config.vehiculoPredeterminado}
                onChange={handleChange}
              >
                <option value="">{loadingVehiculos ? "Cargando vehiculos..." : "Sin preferencia"}</option>
                {vehiculos.map((vehiculo) => {
                  const id = obtenerIdVehiculo(vehiculo);
                  return (
                    <option key={id} value={id}>
                      {obtenerEtiquetaVehiculo(vehiculo)}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="configuracion-time-grid">
              <label className="configuracion-field">
                <span>Entrada habitual</span>
                <div className="configuracion-input-icon">
                  <Clock size={16} />
                  <input type="time" name="horaInicio" value={config.horaInicio} onChange={handleChange} />
                </div>
              </label>

              <label className="configuracion-field">
                <span>Salida habitual</span>
                <div className="configuracion-input-icon">
                  <Clock size={16} />
                  <input type="time" name="horaFin" value={config.horaFin} onChange={handleChange} />
                </div>
              </label>
            </div>

            <div className="configuracion-summary">
              <strong>{vehiculoActual ? obtenerEtiquetaVehiculo(vehiculoActual) : "Reserva sin vehiculo fijo"}</strong>
              <span>{config.horaInicio} - {config.horaFin}</span>
            </div>
          </section>

          <section className="configuracion-empleado-card">
            <div className="configuracion-card-title">
              <span className="configuracion-card-icon"><Sun size={18} /></span>
              <div>
                <h2>Apariencia</h2>
                <p>Modo visual del panel de empleado.</p>
              </div>
            </div>

            <div className="configuracion-segmented" role="group" aria-label="Tema">
              <button
                type="button"
                className={config.tema === "claro" ? "active" : ""}
                onClick={() => handleTema("claro")}
              >
                <Sun size={16} />
                Claro
              </button>
              <button
                type="button"
                className={config.tema === "oscuro" ? "active" : ""}
                onClick={() => handleTema("oscuro")}
              >
                <Moon size={16} />
                Oscuro
              </button>
            </div>
          </section>

          <div className="configuracion-actions">
            {guardado && (
              <span className="configuracion-saved">
                <Check size={16} />
                Guardado
              </span>
            )}
            <button type="submit" className="configuracion-save-btn">
              <Save size={18} />
              Guardar configuracion
            </button>
          </div>
        </form>
      </main>

      <FooterEmpleado />
    </div>
  );
}
