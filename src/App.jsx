import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./vistas/admin_dashboard";   
import GestionEmpleados from "./vistas/gestion_de_empleados";
import GestionGarages from "./vistas/gestion_garages";
import EditarZona from "./vistas/editar_zona";
import AgregarEmpleado from "./vistas/agregar_empleado";
import AgregarZona from "./vistas/agregar_zona";
//import PanelControl from "./vistas/PanelControl";
//import ControlAcceso from "./vistas/ControlAcceso";

//importo todas las vitas para poder defintirles sus rutas 

function App() 
{                              
  return (               
    
    <BrowserRouter>            {/*  esto es el contenedor principal para manejar las rutas de smartLot */}
      <Routes>
        <Route path="/" element={<AdminDashboard />} />   {/*ruta principal que muestra el dashboard*/ }

          {/* Rutas para gestión de empleados */}
          <Route path="/gestion_de_empleados" element={<GestionEmpleados />} />
          <Route path="/agregar_empleado" element={<AgregarEmpleado/>} />
          
          {/* Rutas para gestión de garages */}
         <Route path="/gestion_garages" element={<GestionGarages />} />
         
          <Route path="/agregar_zona" element={<AgregarZona />} /> 
         <Route path="/editar_zona" element={<EditarZona />} />

          {/*
         <Route path="/panel-control" element={<PanelControl />} />
         <Route path="/control-acceso" element={<ControlAcceso />} />
         */}
      </Routes>
    </BrowserRouter>
  );

}

export default App