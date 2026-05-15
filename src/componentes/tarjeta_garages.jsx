import React from "react";
import "./tarjeta_garages.css";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

function TarjetaGarage({
  titulo,
  plazas,
  estado,
  capacidad,
  imagen,
  ultimoReporte,
  onClick,
}) {

  const navigate = useNavigate();

  return (

    <div className="tarjeta-garage" onClick={onClick}>

      <img
        src={imagen}
        alt={titulo}
        className="garage-img"
      />

      <div className="garage-header">

        <h3>{titulo}</h3>

        <span className="estado-garage">
          {estado}
        </span>

      </div>

      <p className="info-garage">

        {plazas} plazas • Último reporte: {ultimoReporte}

      </p>

      <div className="capacidad-container">

        <div className="barra-capacidad">

          <div
            className="barra-fill"
            style={{ width: capacidad }}
          ></div>

        </div>

        <span className="capacidad-texto">
          {capacidad} Capacidad
        </span>

      </div>

      <button
        className="btn-editar"
        onClick={(e) => {

          e.stopPropagation();

          navigate("/editar_zona");

        }}
      >
        <Pencil size={18} color="#000" />
      </button>

    </div>
  );
}

export default TarjetaGarage;