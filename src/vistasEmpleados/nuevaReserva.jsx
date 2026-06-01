import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"
import Header from "../componentesAdmin/header_admin";
return (
    
    <div className="nuevaReserva-contenedor">

      <div>
        <Header/>
      </div>
        <button className="boton-back" onClick={() => navigate("/")}>
            <ArrowLeft size={24} />
        </button>

       <div className="textosTitulos">
        <h1>Nueva Reserva</h1>
        <p>Reserva tu plaza de estacionamiento para tu próxima jornada.</p>

       </div>

    </div>



)