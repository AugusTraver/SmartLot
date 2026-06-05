// src/componentesAdmin/formulario_detallesVehiculo.jsx
import React from "react";
import { Car } from "lucide-react";
import "./formulario_perfil.css"

export default function FormularioDetallesVehiculo({ data = {}, onChange }) {
  return (
    <section className="formulario-seccion animate-section">
      <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", justify: "center" }}>
          <Car size={20} style={{ color: "#10b981" }} />
        </div>
        <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>Detalles del Vehículo</h3>
      </div>

      <div className="formulario-grid">
        <div className="formulario-grupo">
          <label htmlFor="modelo">Modelo del Vehículo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            className="formulario-input"
            value={data.modelo || ""}
            onChange={onChange}
            placeholder="Ej. Toyota Corolla"
          />
        </div>

        <div className="formulario-grupo">
          <label htmlFor="patente">Matrícula / Patente</label>
          <input
            type="text"
            id="patente"
            name="patente"
            className="formulario-input"
            value={data.patente || ""}
            onChange={onChange}
            placeholder="Ej. ABC 123 ó AA 123 BB"
          />
        </div>
      </div>

      {/* Badge de estado premium adaptado a la estética de SmartLot */}
      <div className="access-status-badge" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #f0f0f0" }}>
        <span className="badge-dot active" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></span>
        <span className="badge-text" style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", letterSpacing: "0.02em" }}>PERMISO DE ACCESO ACTIVO</span>
      </div>
    </section>
  );
}