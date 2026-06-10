import { useState } from "react";
import { Calendar, Car, Clock, Plus, Warehouse } from "lucide-react";
import "./form_reserva.css";

const obtenerIdVehiculo = (vehiculo) => vehiculo?.id ?? vehiculo?.id_vehiculo ?? vehiculo?._id;
const obtenerIdGarage = (garage) => garage?.id_garage ?? garage?.idGarage ?? garage?.id ?? garage?._id;

const obtenerEtiquetaVehiculo = (vehiculo) => {
  const marca = vehiculo?.marca?.nombre ?? vehiculo?.marca_nombre ?? vehiculo?.marca;
  const modelo = vehiculo?.modelo?.nombre ?? vehiculo?.modelo_nombre ?? vehiculo?.modelo;
  const patente = vehiculo?.patente ?? vehiculo?.placa ?? vehiculo?.matricula;
  const nombre = [marca, modelo].filter(Boolean).join(" ").trim() || "Vehiculo";
  return patente ? `${nombre} (${patente})` : nombre;
};

const obtenerEtiquetaGarage = (garage) =>
  garage?.nombre || garage?.descripcion || `Garage ${obtenerIdGarage(garage)}`;

const obtenerFechaLocalHoy = () => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormularioReserva({ onSubmit, loading, vehiculos = [], garages = [] }) {
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
    idGarage: garages.length === 1 ? String(obtenerIdGarage(garages[0])) : "",
    idVehiculo: preferencias.vehiculoPredeterminado || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fecha)) {
      setError("La fecha debe tener un formato valido.");
      return;
    }

    if (formData.horaInicio >= formData.horaFin) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setError("");
    const fechaEntrada = `${formData.fecha} ${formData.horaInicio}:00`;
    const fechaSalida = `${formData.fecha} ${formData.horaFin}:00`;
    const garageSeleccionado = garages.find(
      (garage) => Number(obtenerIdGarage(garage)) === Number(formData.idGarage)
    );
    const vehiculoSeleccionado = vehiculos.find(
      (vehiculo) => Number(obtenerIdVehiculo(vehiculo)) === Number(formData.idVehiculo)
    );

    onSubmit({
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
      idGarage: parseInt(formData.idGarage, 10),
      id_garage: parseInt(formData.idGarage, 10),
      idVehiculo: parseInt(formData.idVehiculo, 10),
      id_vehiculo: parseInt(formData.idVehiculo, 10),
      _metaData: {
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        ubicacion: obtenerEtiquetaGarage(garageSeleccionado),
        vehiculo: obtenerEtiquetaVehiculo(vehiculoSeleccionado),
      },
    });
  };

  return (
    <div className="reserva-container-wrapper">
      <form onSubmit={handleFormSubmit} className="reserva-form-card">
        <div className="form-field-group">
          <label className="form-field-label" htmlFor="fecha">Fecha de reserva</label>
          <div className="form-input-icon-wrapper">
            <Calendar className="form-input-icon" size={18} />
            <input
              id="fecha"
              name="fecha"
              type="date"
              className="form-text-input"
              value={formData.fecha}
              min={obtenerFechaLocalHoy()}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-time-fields-row">
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

        <div className="form-field-group">
          <label className="form-field-label" htmlFor="idGarage">Garage</label>
          <div className="form-input-icon-wrapper">
            <Warehouse className="form-input-icon" size={18} />
            <select
              id="idGarage"
              name="idGarage"
              className="form-dropdown-select"
              value={formData.idGarage}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Selecciona un garage</option>
              {garages.map((garage) => {
                const id = obtenerIdGarage(garage);
                return (
                  <option key={id} value={id}>
                    {obtenerEtiquetaGarage(garage)}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="form-field-group">
          <label className="form-field-label" htmlFor="idVehiculo">Vehiculo</label>
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
              <option value="" disabled hidden>Selecciona un vehiculo</option>
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
            disabled={loading || vehiculos.length === 0 || garages.length === 0}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>
              {loading
                ? "Procesando..."
                : vehiculos.length === 0
                  ? "Sin vehiculos disponibles"
                  : garages.length === 0
                    ? "Sin garages disponibles"
                    : "Confirmar reserva"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
