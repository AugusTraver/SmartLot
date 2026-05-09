    import React from "react";
    import "./tarjeta_garages.css"
    import { useNavigate } from "react-router-dom";
    import { Pencil } from "lucide-react";
    
function TarjetaGarage({ titulo,plazas,estado,capacidad,imagen,ultimoReporte,onClick }) 
{
    const navigate = useNavigate();
   return (

    <div
      className="tarjeta-garage"
      onClick={onClick}
    >
      <img
        src={Garage_1}
        alt={titulo}
        className="garage-img"
      />
      <h3>{titulo}</h3>
      <p>Plazas: {plazas}</p>
      <p>Estado: {estado}</p>
      <p>Capacidad: {capacidad}</p>
      <p>Último Reporte: {ultimoReporte}</p>
      
      <button
        className="btn-editar"
        onClick={(e) => {   // el "e" es el evento del click, y con "e.stopPropagation()" evitamos que el click en el boton se propague al contenedor padre (la tarjeta) y solo ejecute la función de editar sin abrir la vista de detalles del garage

          e.stopPropagation();

          navigate("/editar_garage");

        }}>
        <Pencil size={18} />

      </button>

    </div>
  );
}

export default TarjetaGarage;