import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Calendar, Car, Clock, Plus } from "lucide-react";
import "./form_reserva.css";

// Helper utilities optimizadas con optional chaining limpio
const obtenerIdVehiculo = (vehiculo) => vehiculo?.id ?? vehiculo?.id_vehiculo ?? vehiculo?._id;

const obtenerEtiquetaVehiculo = (vehiculo) => {
  const marca = vehiculo?.marca?.nombre ?? vehiculo?.marca_nombre ?? vehiculo?.marca;
  const modelo = vehiculo?.modelo?.nombre ?? vehiculo?.modelo_nombre ?? vehiculo?.modelo;
  const patente = vehiculo?.patente ?? vehiculo?.placa ?? vehiculo?.matricula;
  const nombre = [marca, modelo].filter(Boolean).join(" ").trim() || "Vehículo";
  return patente ? `${nombre} (${patente})` : nombre;
};

export default function FormularioReserva({ onSubmit, loading, vehiculos = [] }) {
  const formScopeRef = useRef(null);
  const preferencias = (() => {
    try {
      return JSON.parse(localStorage.getItem("smartlot_empleado_config")) || {};
    } catch {
      return {};
    }
  })();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: preferencias.horaInicio || "",
    horaFin: preferencias.horaFin || "",
    idVehiculo: preferencias.vehiculoPredeterminado || "",
  });

  // Animación de entrada premium optimizada para la GPU
  useGSAP(() => {
    gsap.from(".animate-card-target", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power4.out",
      clearProps: "transform, opacity",
    });
  }, { scope: formScopeRef });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formData.horaInicio >= formData.horaFin) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setError("");
    onSubmit({
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      idVehiculo: parseInt(formData.idVehiculo, 10),
    });
  };

  return (
    <div ref={formScopeRef} className="reserva-container-wrapper">


      <form
        onSubmit={handleFormSubmit}
        className="reserva-form-card animate-card-target"
      >
        <div className="form-field-group">
          <label className="form-field-label" htmlFor="fecha">FECHA DE RESERVA</label>
          <div className="form-input-icon-wrapper">
            <Calendar className="form-input-icon" size={18} />
            <input
              id="fecha"
              name="fecha"
              type="date"
              className="form-text-input"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
        </div>
{/* Fila controlada para campos de hora en paralelo */}
<div className="form-time-fields-row">
  
  {/* Campo: Hora Inicio */}
  <div className="form-field-group">
    <label className="form-field-label" htmlFor="horaInicio">
      Hora Inicio
    </label>
    <div className="form-input-icon-wrapper">
      <Clock className="form-input-icon" size={18} />
      <input
        id="horaInicio"
        name="horaInicio"
        type="time"
        className="form-text-input"
        value={formData.horaInicio}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  {/* Campo: Hora Fin */}
  <div className="form-field-group">
    <label className="form-field-label" htmlFor="horaFin">
      Hora Fin
    </label>
    <div className="form-input-icon-wrapper">
      <Clock className="form-input-icon" size={18} />
      <input
        id="horaFin"
        name="horaFin"
        type="time"
        className="form-text-input"
        value={formData.horaFin}
        onChange={handleChange}
        required
      />
    </div>
  </div>

</div>

        <div className="form-field-group">
          <label className="form-field-label" htmlFor="idVehiculo">VEHÍCULO</label>
          <div className="form-input-icon-wrapper">
            <Car className="form-input-icon" size={18} />
            <select
              id="idVehiculo"
              name="idVehiculo"
              className="form-dropdown-select"
              value={formData.idVehiculo}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Selecciona un vehículo</option>
              {vehiculos.map((vehiculo) => {
                const id = obtenerIdVehiculo(vehiculo);
                return (
                  <option key={id} value={id}>
                    {obtenerEtiquetaVehiculo(vehiculo)}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {error && <p className="form-error-message" role="alert">{error}</p>}

        <div className="form-submit-container">
          <button 
            type="submit" 
            className="submit-reservation-button" 
            disabled={loading || vehiculos.length === 0}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>
              {loading ? "Procesando..." : vehiculos.length === 0 ? "Sin vehículos disponibles" : "Confirmar reserva"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
