import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./vistas/admin_ dashboard";   
import GestionUsuarios from "./vistas/gestion_de_empleados";
//import GestionGarages from "./vistas/GestionGarages";
//import PanelControl from "./vistas/PanelControl";
//import ControlAcceso from "./vistas/ControlAcceso";

//importo todas las vitas para poder defintirles sus rutas 

function app() 
{
  return (
    <BrowserRouter>   //  esto es el contenedor principal para manejar las rutas de smartLot
      <Routes>
        <Route path="/" element={<AdminDashboard />} /> // ruta principal que muestra el dashboard
        <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
        <Route path="/gestion-garages" element={<GestionGarages />} />
        <Route path="/panel-control" element={<PanelControl />} />
        <Route path="/control-acceso" element={<ControlAcceso />} />
      </Routes>
    </BrowserRouter>
  );

}