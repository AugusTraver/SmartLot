import { useState, useEffect } from "react";
import { Calendar, Car, Clock, Plus, Warehouse } from "lucide-react";
import "./form_reserva.css";
import { getDiaDesdeFecha, getDiaDisplay } from "../helpers/diasSemana";

const obtenerIdVehiculo = (vehiculo) => vehiculo?.id ?? vehiculo?.id_vehiculo ?? vehiculo?._id;
const obtenerIdGarage = (garage) => garage?.id_garage ?? garage?.idGarage ?? garage?.id ?? garage?._id;

const obtenerEtiquetaVehiculo = (vehiculo) => {
  const marca = vehiculo?.marca?.nombre ?? vehiculo?.marca_nombre ?? vehiculo?.marca;
  const modelo = vehiculo?.modelo?.nombre ?? vehiculo?.modelo_nombre ?? vehiculo?.modelo;
  const patente = vehiculo?.patente ?? vehiculo?.placa ?? vehiculo?.matricula;
  const nombre = [marca, modelo].filter(Boolean).join(" ").trim() || "Vehiculo";
  return patente ? `${nombre} (${patente})` : nombre;
};

const obtenerEtiquetaGarage = (garage) => {
  const nombre = garage?.nombre || garage?.name || garage?.descripcion || garage?.ubicacion || garage?.nombre_garage || garage?.garage_nombre || garage?.nombre_zona || garage?.direccion;
  return nombre || "Garage";
};

const obtenerFechaLocalHoy = () => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormularioReserva({ onSubmit, loading, vehiculos = [], garages = [], initialData }) {
  const preferences = (() => {
    try {
      return JSON.parse(localStorage.getItem("smartlot_empleado_config")) || {};
    } catch {
      return {};
    }
  })();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: initialData?.horaInicio || preferences.horaInicio || "",
    horaFin: initialData?.horaFin || preferences.horaFin || "",
    idGarage: initialData?.idGarage
      ? String(initialData.idGarage)
      : "",
    idVehiculo: initialData?.idVehiculo
      ? String(initialData.idVehiculo)
      : (preferences.vehiculoPredeterminado || ""),
    dia: "",
  });

  const garageSeleccionadoObj = garages.find(
    (garage) => String(obtenerIdGarage(garage)) === String(formData.idGarage)
  );
  
  const ubicacionGarageActual = garageSeleccionadoObj?.ubicacion || 
                                garageSeleccionadoObj?.direccion || 
                                garageSeleccionadoObj?.nombre_zona || 
                                garageSeleccionadoObj?.descripcion;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const diaApi = getDiaDesdeFecha(formData.fecha);
    setFormData((prev) => {
      if (prev.dia === diaApi) return prev;
      return { ...prev, dia: diaApi };
    });
  }, [formData.fecha]);

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
      dia: formData.dia,
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
              autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {formData.dia && (
          <div className="dia-indicador-reserva">
            <span className="dia-indicador-label">Día de la reserva</span>
            <span className="dia-indicador-valor">{getDiaDisplay(formData.dia)}</span>
          </div>
        )}

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
          
          {/* BLOQUE NUEVO MODIFICADO: Estilos con fondo azul e interior de alto contraste */}
          {formData.idGarage && ubicacionGarageActual && (
            <div 
              style={{
                marginTop: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: "500",
                display: "flex",
                gap: "0.35rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                backgroundColor: "rgb(255, 255, 255)",
                color: "#ffffff",
                border: "1px solid rgb(59, 130, 246)",

              }}
            >
              <span style={{ color: "#1164e8ff", opacity: 0.9 }}>Ubicacion:</span>
              <span style={{ color: "#4481e2ff", fontWeight: "600" }}>{ubicacionGarageActual}</span>
            </div>
          )}
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
