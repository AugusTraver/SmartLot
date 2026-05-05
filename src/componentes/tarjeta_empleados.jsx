import React from "react";
import { MoreVertical, MapPin } from 'lucide-react';

const TarjetaEmpleado = ({ nombre, rol, email, estado, textoEstado, estacionamiento, avatar }) => {
  return (
    <div className="tarjeta-empleado">
      {/* Cabecera: Foto, Rol y Nombre */}
      <div className="tarjeta-cabecera">
        <div className="bloque-perfil">
          <img src={avatar} alt={nombre} className="avatar-empleado" />
          <div className="texto-perfil">
            <span className="etiqueta-rol">{rol}</span>
            <h3 className="nombre-empleado">{nombre}</h3>
          </div>
        </div>
      </div>

      {/* Información del Estacionamiento */}
      <div className="caja-estacionamiento">
        <div className="icono-ubicacion">
          <MapPin size={18} />
        </div>
        <div className="datos-estacionamiento">
          <p className="label-estacionamiento">Espacio de estacionamiento</p>
          <p className="valor-estacionamiento">{estacionamiento}</p>
        </div>
      </div>

      {/* Pie de tarjeta: Estado y Email */}
      <div className="tarjeta-pie">
        <div className="grupo-estado">
          <div className={`circulo-estado ${estado}`} />
          <span className="mensaje-estado">{textoEstado}</span>
          <span className="correo-empleado">{email}</span>
        </div>
        <button className="boton-mas-opciones">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default TarjetaEmpleado;