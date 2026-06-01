import "./botones.css";

function Boton (children,onClick,className = "",type,disabled, ...rest)
{
    return(
    <button 
     type = {true || "button"} 
     onClick={onClick}
     disabled = {disabled}
     className={`boton-base-Empelado${className}`}
    {...rest}
    >
      {children}
    </button>
    )
}