// src/componentesEmpleado/formulario_detalles_vehiculo.jsx
import React, { useState, useEffect, useRef } from "react";
import { Car } from "lucide-react";
import { ModelosGetAll } from "../servicies/API_Modelo"; 
import "./formulario_vehiculo.css";

export default function FormularioDetallesVehiculo({ vehiculoData = {}, onChange }) {
  const [modelosGlobales, setModelosGlobales] = useState([]); 
  const [sugerencias, setSugerencias] = useState([]); 
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    async function cargarCatalogo() {
      try {
        if (typeof ModelosGetAll === "function") {
          const resultadoAPI = await ModelosGetAll();
          const arrayModelos = resultadoAPI?.datos || [];
          
          if (Array.isArray(arrayModelos)) {
            setModelosGlobales(arrayModelos);
          } else if (arrayModelos && typeof arrayModelos === "object") {
            const fallback = arrayModelos.data || Object.values(arrayModelos);
            setModelosGlobales(Array.isArray(fallback) ? fallback : []);
          }
        }
      } catch (error) {
        console.error("SmartLot Aislamiento: Error de red en ModelosGetAll", error);
        setModelosGlobales([]); 
      }
    }
    cargarCatalogo();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFiltradoModelo = (e) => {
    if (!e || !e.target) return;
    const valor = e.target.value;
    
    if (typeof onChange === "function") {
      onChange(e);
    }

    if (valor.trim().length > 0 && modelosGlobales.length > 0) {
      const filtrados = modelosGlobales.filter((item) => {
        if (!item) return false;
        const nombreFinal = item.nombre || item.nombre_modelo || item.modelo || String(item);
        return nombreFinal.toLowerCase().includes(valor.toLowerCase());
      });
      setSugerencias(filtrados);
      setMostrarSugerencias(true);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  };

  const handleSeleccionarItem = (item) => {
    if (!item) return;
    const textoFinal = item.nombre || item.nombre_modelo || item.modelo || String(item);
    
    if (typeof onChange === "function") {
      onChange({
        target: {
          name: "modelo",
          value: textoFinal,
        },
      });
    }
    setMostrarSugerencias(false);
  };

  return (
    <section className="vehiculo-card-seccion formulario-seccion animate-section">
      <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "rgb(239, 246, 255)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Car size={20} style={{ color:  "rgb(59, 130, 246)" }} />
        </div>
        <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
          Detalles del Vehículo
        </h3>
      </div>

      <div className="formulario-grid-vehiculo">
        <div className="vehiculo-input-grupo" ref={autocompleteRef} style={{ position: "relative" }}>
          <label htmlFor="modelo">Modelo del Vehículo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            className="formulario-input"
            value={vehiculoData?.modelo || ""}
            onChange={handleFiltradoModelo}
            onFocus={() => vehiculoData?.modelo && setMostrarSugerencias(true)}
            placeholder="Ej. Toyota Corolla"
            autoComplete="off"
            required
          />

          {mostrarSugerencias && sugerencias.length > 0 && (
            <ul className="autocomplete-suggestions-panel">
              {sugerencias.map((item, index) => {
                if (!item) return null;
                const textoVisual = item.nombre || item.nombre_modelo || item.modelo || String(item);
                return (
                  <li 
                    key={item.id || index} 
                    className="autocomplete-item"
                    onClick={() => handleSeleccionarItem(item)}
                  >
                    {textoVisual}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="vehiculo-input-grupo">
          <label htmlFor="patente">Matrícula / Patente</label>
          <input
            type="text"
            id="patente"
            name="patente"
            className="formulario-input"
            value={vehiculoData?.patente || ""}
            onChange={onChange}
            placeholder="Ej. AA123BB"
            autoComplete="off"
            required
          />
        </div>
      </div>

      <div className="access-status-badge">
        <span className={`badge-dot ${vehiculoData?.patente ? 'active' : ''}`}></span>
        <span className="badge-text">
          {vehiculoData?.patente ? 'Permiso de acceso activo' : 'Sin vehículo registrado'}
        </span>
      </div>
    </section>
  );
}