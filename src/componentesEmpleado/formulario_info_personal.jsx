// src/componentesEmpleado/formulario_info_personal.jsx
import React from "react";
import { User } from "lucide-react";
import "./formulario_PerfilPersonal.css"
export default function FormularioInfoPersonal({ data = {}, onChange }) {
  return (
    <fieldset 
      className="formulario-seccion animate-section" 
      style={{ border: "none", padding: 0, margin: 0 }}
    >
      {/* Accesibilidad de alto estándar para lectores de pantalla */}
      <legend className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>
        Formulario de Información Personal del Empleado
      </legend>

      {/* Encabezado con Icono Premium (Sintaxis corregida) */}
      <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "#eff6ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <User size={20} style={{ color: "#3b82f6" }} />
        </div>
        <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
          Información Personal
        </h3>
      </div>

      {/* Contenedor principal vertical */}
      <div className="formulario-grid">
        
        {/* Fila unificada: Nombre y Apellido */}
        <div className="formulario-fila-doble">
          <div className="formulario-grupo">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="formulario-input"
              value={data.nombre || ""}
              onChange={onChange}
              placeholder="Ej. Juan"
              autoComplete="given-name"
            />
          </div>

          <div className="formulario-grupo">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="formulario-input"
              value={data.apellido || ""}
              onChange={onChange}
              placeholder="Ej. Pérez"
              autoComplete="family-name"
            />
          </div>
        </div>


        <div className="formulario-grupo">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className="formulario-input"
            value={data.email || ""}
            onChange={onChange}
            placeholder="juan.perez@empresa.com"
            autoComplete="email"
          />
        </div>

        <div className="formulario-grupo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            className="formulario-input"
            value={data.telefono || ""}
            onChange={onChange}
            placeholder="Ej. +54 11 2345 6789"
            autoComplete="tel"
            inputMode="tel" 
          />
        </div>
      </div>
    </fieldset>
  );
}