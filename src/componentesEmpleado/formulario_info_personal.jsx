// src/componentesEmpleado/formulario_info_personal.jsx
import React from "react";
import { User } from "lucide-react";

export default function FormularioInfoPersonal({ data = {} }) {
  return (
    <section
      className=" inforpersonal-contenedor formulario-seccion animate-section" 
      style={{ border: "none", padding: 0, margin: 0 }}
    >
      <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "#eff6ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <User size={20} style={{ color: "#3b82f6" }} />
        </div>
        <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
          Información Personal
        </h3>
      </div>

      <div className="formulario-grid">
        <div className="formulario-fila-doble">
          <div className="formulario-grupo">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              className="formulario-input"
              value={data.nombre || ""}
              readOnly
              disabled
              style={{ cursor: "not-allowed", opacity: 0.75 }}
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              className="formulario-input"
              value={data.apellido || ""}
              readOnly
              disabled
              style={{ cursor: "not-allowed", opacity: 0.75 }}
            />
          </div>
        </div>

        <div className="formulario-grupo">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className="formulario-input"
            value={data.email || ""}
            readOnly
            disabled
            style={{ cursor: "not-allowed", opacity: 0.75 }}
          />
        </div>

        <div className="formulario-grupo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            className="formulario-input"
            value={data.telefono || ""}
            readOnly
            disabled
            style={{ cursor: "not-allowed", opacity: 0.75 }}
          />
        </div>
      </div>
    </section>
  );
}