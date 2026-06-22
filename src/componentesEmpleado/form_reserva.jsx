import { useState, useEffect } from "react";
import { Calendar, Car, Clock, Plus, Warehouse } from "lucide-react";
import "./form_reserva.css";
import { getDiaDesdeFecha, getDiaDisplay } from "../helpers/diasSemana";
import useLiveValidation from "../hooks/useLiveValidation";
import FieldValidation from "../components/FieldValidation";

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

  const getSchema = () => ({
    fecha: [
      { rule: (v) => v?.length > 0, message: "Requerido" },
      { rule: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v), message: "Formato YYYY-MM-DD" },
    ],
    horaInicio: [
      { rule: (v) => v?.length > 0, message: "Requerido" },
    ],
    horaFin: [
      { rule: (v) => v?.length > 0, message: "Requerido" },
      () => ({ rule: () => !formData.horaInicio || !formData.horaFin || formData.horaInicio < formData.horaFin, message: "Debe ser posterior a inicio" }),
    ],
    idGarage: [
      { rule: (v) => v !== "", message: "Selecciona un garage" },
    ],
    idVehiculo: [
      { rule: (v) => v !== "", message: "Selecciona un vehículo" },
    ],
  });

  const { isValid, touched, touch } = useLiveValidation(formData, getSchema());

  const buildConditions = (fieldName) => {
    const schema = getSchema();
    if (!schema[fieldName]) return [];
    const value = formData[fieldName];
    return schema[fieldName].map((item) => {
      if (typeof item === "function") {
        const result = item(value);
        return { label: result.message, met: result.rule(value) };
      }
      return { label: item.message, met: item.rule(value) };
    });
  };

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

    if (!isValid) {
      setError("Corrige los errores antes de confirmar.");
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
            <FieldValidation conditions={buildConditions("fecha")} isTouched={touched.fecha} />
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
                onChange={(e) => { handleChange(e); touch("horaInicio"); }}
                required
                autoComplete="off"
              />
            </div>
            <FieldValidation conditions={buildConditions("horaInicio")} isTouched={touched.horaInicio} />
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
                onChange={(e) => { handleChange(e); touch("horaFin"); }}
                required
                autoComplete="off"
              />
            </div>
            <FieldValidation conditions={buildConditions("horaFin")} isTouched={touched.horaFin} />
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
              onChange={(e) => { handleChange(e); touch("idGarage"); }}
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
          <FieldValidation conditions={buildConditions("idGarage")} isTouched={touched.idGarage} />
          
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
              onChange={(e) => { handleChange(e); touch("idVehiculo"); }}
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
          <FieldValidation conditions={buildConditions("idVehiculo")} isTouched={touched.idVehiculo} />
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
