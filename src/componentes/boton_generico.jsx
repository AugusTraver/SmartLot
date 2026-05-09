import React from 'react';
import "./boton_generico.css";

// La prop 'children' representa todo lo que se pone entre <BotonGenerico> y </BotonGenerico>
function BotonGenerico({ children, onClick, className = "" }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className={`boton-base-smartlot ${className}`}
    >
      {children}
    </button>
  );
}

export default BotonGenerico;