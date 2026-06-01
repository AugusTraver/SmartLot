import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Calendar, Clock, Car, Plus } from "lucide-react";
import "./Form_reserva.css"; // Estilos específicos del componente

// Registrar el hook oficial de GSAP
gsap.registerPlugin(useGSAP);

export default function FormularioReserva({ onSubmit, loading }) {
  const formScopeRef = useRef(null);

  // Estado interno aislado para evitar re-renders en la vista padre
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    idVehiculo: ""
  });

  // Animación premium de entrada optimizada por GPU
  useGSAP(() => {
    gsap.from(".animate-card-target", {
      opacity: 0,
      yPercent: 10,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "all" // Limpia los estilos inline al finalizar la animación
    });
  }, { scope: formScopeRef });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Enviamos los datos limpios al manejador del padre
    onSubmit({
      fecha: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      idVehiculo: parseInt(formData.idVehiculo, 10)
    });
  };

  return (
    <form 
      ref={formScopeRef} 
      onSubmit={handleFormSubmit} 
      className="reserva-form-card animate-card-target"
    >
      {/* Campo: Fecha de Reserva */}
      <div className="form-field-group">
        <label className="form-field-label" htmlFor="fecha">Fecha de Reserva</label>
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

      {/* Fila de Horas (Inicio y Fin) */}
      <div className="form-time-fields-row">
        {/* Hora Inicio */}
        <div className="form-field-group">
          <label className="form-field-label" htmlFor="horaInicio">Hora Inicio</label>
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

        {/* Hora Fin */}
        <div className="form-field-group">
          <label className="form-field-label" htmlFor="horaFin">Hora Fin</label>
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

      {/* Campo: Vehículo Select */}
      <div className="form-field-group">
        <label className="form-field-label" htmlFor="idVehiculo">Vehículo</label>
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
            <option value="" disabled hidden>Seleccioná un vehículo</option>
            <option value="1">Audi A4 (2841-LMN)</option>
            <option value="2">Tesla Model 3 (9921-XYZ)</option>
          </select>
        </div>
      </div>

      {/* Botón de acción principal */}
      <div className="form-submit-container">
        <button type="submit" className="submit-reservation-button" disabled={loading}>
          <Plus size={18} />
          <span>{loading ? "Procesando..." : "Confirmar reserva"}</span>
        </button>
      </div>
    </form>
  );
}