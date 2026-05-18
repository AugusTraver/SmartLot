import { useState } from "react";
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
  Wrench,
  WifiOff,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BotonGenerico from "../componentes/boton_generico";

const estados = [
  {
    id: "activo",
    label: "Activo",
    detalle: "Operando normal",
    icono: CheckCircle2,
  },
  {
    id: "mantenimiento",
    label: "Mantenimiento",
    detalle: "Revisión técnica",
    icono: Wrench,
  },
  {
    id: "desconectado",
    label: "Desconectado",
    detalle: "Sin conexión",
    icono: WifiOff,
  },
];

function EditarZona() {
  const navigate = useNavigate();
  const [estadoActivo, setEstadoActivo] = useState("activo");
  const [plazasVip, setPlazasVip] = useState(12);
  const [plazasEstandar, setPlazasEstandar] = useState(45);

  const totalPlazas = plazasVip + plazasEstandar;

  const volverAGarages = () => {
    navigate("/gestion_garages");
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    navigate("/gestion_garages");
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
              <input type="text" placeholder="Garage B, Exterior Norte" />
            </div>

            <div className="campos-grid">
              <div className="campo-formulario">
                <label>Nivel / Planta</label>
                <select>
                  <option>Piso 2</option>
                  <option>Piso 1</option>
                  <option>Subsuelo</option>
                </select>
              </div>

              <div className="campo-formulario">
                <label>Total de plazas</label>
                <input type="number" value={totalPlazas} readOnly />
              </div>
            </div>

            <div className="campo-formulario">
              <label>Ubicación</label>
              <textarea rows="4" placeholder="Ubicación del garage" />
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
              {estados.map((estado) => {
                const Icono = estado.icono;

                return (
                  <button
                    key={estado.id}
                    type="button"
                    className={`estado-btn estado-${estado.id} ${
                      estadoActivo === estado.id ? "activo" : ""
                    }`}
                    onClick={() => setEstadoActivo(estado.id)}
                  >
                    <Icono size={21} />
                    <strong>{estado.label}</strong>
                    <span>{estado.detalle}</span>
                  </button>
                );
              })}
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
              <span>Total asignado</span>
              <strong>{totalPlazas} plazas</strong>
            </div>

            <div className="plazas-grid">
              <div className="plaza-item">
                <div className="plaza-top">
                  <div className="plaza-icon">
                    <Star size={18} />
                  </div>

                  <span className="plaza-tag">VIP</span>
                </div>

                <h4>Plazas VIP</h4>
                <p>Ubicaciones preferenciales.</p>

                <div className="contador">
                  <button
                    type="button"
                    onClick={() => setPlazasVip((valor) => Math.max(0, valor - 1))}
                    disabled={plazasVip === 0}
                  >
                    <Minus size={16} />
                  </button>

                  <span>{plazasVip}</span>

                  <button
                    type="button"
                    onClick={() => setPlazasVip((valor) => valor + 1)}
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

                  <span className="plaza-tag">ESTÁNDAR</span>
                </div>

                <h4>Estándar</h4>
                <p>Plazas de uso general.</p>

                <div className="contador">
                  <button
                    type="button"
                    onClick={() =>
                      setPlazasEstandar((valor) => Math.max(0, valor - 1))
                    }
                    disabled={plazasEstandar === 0}
                  >
                    <Minus size={16} />
                  </button>

                  <span>{plazasEstandar}</span>

                  <button
                    type="button"
                    onClick={() => setPlazasEstandar((valor) => valor + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="acciones-formulario">
            <BotonGenerico
              type="button"
              className="btn-cancelar"
              onClick={volverAGarages}
            >
              <X size={18} />
              <span>Cancelar</span>
            </BotonGenerico>

            <BotonGenerico type="submit" className="btn-guardar">
              <Save size={18} />
              <span>Guardar cambios</span>
            </BotonGenerico>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditarZona;