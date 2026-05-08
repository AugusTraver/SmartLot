import "./admin_dashboard.css";
import DashboardBoton from "../componentes/admin_dashboard_boton";
import {useNavigate } from "react-router-dom";
import Header from "../componentes/header_admin";   
import FooterAdmin from "../componentes/footer_admin";
import {UserPlus,Car,SlidersVertical,PersonStanding} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();   // esto sirve para poder navegar a otras paginas
     
return (
  <>
    <Header />
    
    <div className="admin-dashboard">
      <h1>Acciones Rapidas</h1>

      <div className="dashboard-grid">
        <DashboardBoton  
          icono={<UserPlus/>}    
          titulo="Gestionar de usuarios"
          descripcion="Gestionar y agregar nuevos empleados"
          onClick={() => navigate("/gestion_de_empleados")}
        />

        <DashboardBoton
         icono={<Car/>}
          titulo="Gestion de garages"
          descripcion="Gestión y definición de nuevos garages"
          onClick={() => navigate("/gestion-garages")}
        />

        <DashboardBoton
          icono={<SlidersVertical/>}
          titulo="Panel de control"
          descripcion="Información de vital importancia"
          onClick={() => navigate("/panel-control")}
        />

        <DashboardBoton
         icono={<PersonStanding/>}
          titulo="Control de acceso"
          descripcion="Control de entradas y salidas"
          onClick={() => navigate("/control-acceso")}
        />
      </div>
    </div>
    <FooterAdmin/>
  </>
);
}
export default AdminDashboard;
