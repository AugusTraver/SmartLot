import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./vistasAdmin/admin_dashboard";   
import GestionEmpleados from "./vistasAdmin/gestion_de_empleados";
import GestionGarages from "./vistasAdmin/gestion_garages";
import EditarZona from "./vistasAdmin/editar_zona";
import AgregarEmpleado from "./vistasAdmin/agregar_empleado";
import AgregarGarajista from "./vistasAdmin/agregar_garajista";
import AgregarZona from "./vistasAdmin/agregar_zona";
import LandingPage from "./vistasLanding/Landing";
import Auth from "./vistasLanding/Auth";
import EmpleadoDashboard from "./vistasEmpleados/empleados_dashboard";
import NuevaReserva from "./vistasEmpleados/nueva_reserva";

function App() 
{                              
  return (               
    
    <BrowserRouter>            {/*  esto es el contenedor principal para manejar las rutas de smartLot */}
      <Routes>
    
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          {/*Empleado*/}
           <Route path="/empleados_dashboard" element={<EmpleadoDashboard />} />
           <Route path="/nueva_reserva" element={<NuevaReserva />} />
            
          {/*Admin} */}
            

          {/* Rutas para gestión de empleados */}
          <Route path="/gestion_de_empleados" element={<GestionEmpleados />} />
          <Route path="/agregar_empleado" element={<AgregarEmpleado/>} />
          <Route path="/agregar_garajista" element={<AgregarGarajista/>} />
          
          {/* Rutas para gestión de garages */}
         <Route path="/gestion_garages" element={<GestionGarages />} />
          <Route path="/agregar_zona" element={<AgregarZona />} /> 
         <Route path="/editar_zona" element={<EditarZona />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App
