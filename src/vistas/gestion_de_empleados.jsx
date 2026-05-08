import  "./gestion_de_empleados.css";
import EmployeeCard from "../componentes/tarjeta_empleados.jsx"
import { useState } from "react";

function gestionEempleados(){
    const navigate = useNavigate(); 

const [tarjeta_empleados, setEmpleados] = useState(
[
    {
     "name": "Elena Rodriguez",
     "role": "Admin",
    "email": "elena.rodriguez@smartlot.com",
     "parkingSpot": "Plaza A-22 • Nivel Superior",
      "avatar": `https://i.pravatar.cc/150?u=${Date.now()}`
    }
    
]
) 
}

return (
    <div className="contenedor-app">
      <header className="cabecera-principal">
        <div className="logo-marca">
          <div className="icono-logo">P</div>
          <span className="nombre-marca">SmartLot</span>
        </div>
        <div className="acciones-cabecera">
          <Bell className="icono-campana" size={20} />
          <div className="miniatura-perfil">
            <img src="https://i.pravatar.cc/150?u=me" alt="Perfil" />
          </div>
        </div>
      </header>

      <main className="envoltorio-contenido">
        <button className="boton-volver">
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="titulo-vista">Gestión de Empleado</h1>
        <p className="subtitulo-vista">Administra el acceso y roles de todo el personal de SmartLot.</p>

        <button className="boton-agregar-empleado" onClick={agregarEmpleado}>
          <UserPlus size={20} />
          Agregar empleado
        </button>

        <section className="seccion-filtros">
          <div className="contenedor-barra-busqueda">
            <Search className="icono-busqueda" size={18} />
            <input type="text" placeholder="Buscar por nombre, email o cargo..." className="input-busqueda" />
          </div>
          
          <div className="controles-filtrado">
            <button className="filtro-desplegable">
              Filtrar por sede
              <ChevronDown size={18} />
            </button>
            <button className="boton-configuracion-filtro">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </section>

        <div className="lista-empleados">
          {empleados.map(emp => (
            <TarjetaEmpleado key={emp.id} empleado={emp} />
          ))}
        </div>
      </main>
    </div>
  );




  export default gestionEempleados 