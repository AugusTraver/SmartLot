import React from 'react';
import "./buton_agregar_empleados.css";

// Icono de Check estilizado
const CheckIcon = ({ size = 20, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <path 
      d="M20 6L9 17L4 12" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

function Buttom({ Contenido, onClick }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="btn-guardar-empleado"
    >
      <CheckIcon size={20} className="btn-icon" />
      <span>{Contenido}</span>
    </button>
  );
}

export default Buttom;