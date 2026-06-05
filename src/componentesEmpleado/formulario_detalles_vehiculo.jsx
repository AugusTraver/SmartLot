import React from "react";
import { Car } from "lucide-react";
import "./formulario_vehiculo.css";

export default function FormularioDetallesVehiculo({ data = {}, onChange }) {
  return (
    <section className="vehiculo-card-seccion formulario-seccion animate-section">
      {/* Encabezado Bento Premium */}
      <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "rgb(239, 246, 255)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Car size={20} style={{ color: " rgb(59, 130, 246)" }} />
        </div>
        <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
          Detalles del Vehículo
        </h3>
      </div>

      {/* Grilla de 2 columnas paralelas idéntica a tu diseño */}
      <div className="formulario-grid-vehiculo">
        <div className="vehiculo-input-grupo">
          <label htmlFor="modelo">Modelo del Vehículo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            className="formulario-input"
            value={data.modelo || ""}
            onChange={onChange}
            placeholder="Ej. Toyota Corolla"
            autoComplete="off"
          />
        </div>

        <div className="vehiculo-input-grupo">
          <label htmlFor="patente">Matrícula / Patente</label>
          <input
            type="text"
            id="patente"
            name="patente"
            className="formulario-input"
            value={data.patente || ""}
            onChange={onChange}
            placeholder="Ej. ABC 123 ó AA 123 BB"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Badge de Acceso con Animación Pulso GPU */}
      <div className="access-status-badge">
        <span className="badge-dot active"></span>
        <span className="badge-text">Permiso de acceso activo</span>
      </div>
    </section>
  );
}