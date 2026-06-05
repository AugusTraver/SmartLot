// src/componentesEmpleado/formulario_detalles_vehiculo.jsx
import React from "react";
import { Car } from "lucide-react";
import "./formulario_vehiculo.css";

export default function FormularioDetallesVehiculo({ vehiculoData = {}, onChange }) {
  return (
    <section className="vehiculo-card-seccion formulario-seccion animate-section">
      <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "rgb(239, 246, 255)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Car size={20} style={{ color: "rgb(59, 130, 246)" }} />
        </div>
        <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
          Detalles del Vehículo
        </h3>
      </div>

      <div className="formulario-grid-vehiculo">
        <div className="vehiculo-input-grupo">
          <label htmlFor="modelo">Modelo del Vehículo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            className="formulario-input"
            value={vehiculoData.modelo || ""}
            onChange={onChange}
            placeholder="Ej. Toyota Corolla"
            autoComplete="off"
            required
          />
        </div>

        <div className="vehiculo-input-grupo">
          <label htmlFor="patente">Matrícula / Patente</label>
          <input
            type="text"
            id="patente"
            name="patente"
            className="formulario-input"
            value={vehiculoData.patente || ""}
            onChange={onChange}
            placeholder="Ej. AA123BB"
            autoComplete="off"
            required
          />
        </div>
      </div>

      <div className="access-status-badge">
        <span className={`badge-dot ${vehiculoData.patente ? 'active' : ''}`}></span>
        <span className="badge-text">
          {vehiculoData.patente ? 'Permiso de acceso activo' : 'Sin vehículo registrado'}
        </span>
      </div>
    </section>
  );
}