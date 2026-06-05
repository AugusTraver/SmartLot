import React from "react";
import { Car } from "lucide-react";
import "./formulario_perfil.css"
export default function FormularioDetallesVehiculo({ data, onChange }) {
  return (
    <section className="form-card-seccion animate-section">
      <div className="form-card-header">
        <div className="icon-badge-box">
          <Car size={20} className="icon-accent" />
        </div>
        <h2>Detalles del Vehículo</h2>
      </div>

      <div className="form-grid-layout">
        <div className="form-control-group">
          <label htmlFor="modelo">Modelo del Vehículo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={data.modelo || ""}
            onChange={onChange}
            placeholder="Ej. Toyota Corolla"
          />
        </div>

        <div className="form-control-group">
          <label htmlFor="patente">Matrícula / Patente</label>
          <input
            type="text"
            id="patente"
            name="patente"
            value={data.patente || ""}
            onChange={onChange}
            placeholder="Ej. ABC 123 ó AA 123 BB"
          />
        </div>
      </div>

      <div className="access-status-badge">
        <span className="badge-dot active"></span>
        <span className="badge-text">PERMISO DE ACCESO ACTIVO</span>
      </div>
    </section>
  );
}