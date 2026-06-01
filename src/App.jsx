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
import GaragistaDashboard from "./vistasGaragista/garagista_dashboard";

function App() 
{                              
  return (               
    
    <BrowserRouter>            {/*  esto es el contenedor principal para manejar las rutas de smartLot */}
      <Routes>
             {/* Rutas para la página de inicio y autenticación */}
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

            {/* Rutas para empleados  */}
             <Route path="/empleados_dashboard" element={<EmpleadoDashboard />} />
            <Route path="/nueva_reserva" element={<NuevaReserva />} />

            {/* Rutas para garagista  */}
            <Route path="/garagista_dashboard" element={<GaragistaDashboard />} />
          
            {/* Rutas para Admin  */}
           <Route path="/admin_dashboard" element={<AdminDashboard />} />
         

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
