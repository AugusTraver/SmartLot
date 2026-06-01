import "./empleados_dashboard.css";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import { useNavigate } from "react-router-dom";

function EmpleadoDashboard()
{   
  const navigate = useNavigate();

  return (
    <div>
        <HeaderEmpleado/>
        <h1>Sebastian Lopez</h1>
        <div>
            <h2>Mis Reservas Actuales </h2>
            <button>Ver todas</button>
        </div>
          <button onClick={() => navigate("/nueva_reserva")}>
            + Nueva Reserva 
          </button>


    </div>
  );

}

export default EmpleadoDashboard
