import "./admin_dashboard.css";
import DashboardBoton from "../componentes/admin_dashboard_boton";
import {useNavigate } from "react-router-dom";
import Header from "../componentes/admin_dashboard_header";   


function AdminDashboard() {
    const navigate = useNavigate();   // esto sirve para poder navegar a otras paginas
     
return (
  <>
    <Header />

    <div className="admin-dashboard">
      <h1>Acciones Rapidas</h1>

      <div className="dashboard-grid">
        <DashboardBoton  
          titulo="Gestionar de usuarios"
          descripcion="Gestionar y agregar nuevos empleados"
          onClick={() => navigate("/gestion_de_empleados")}
        />

        <DashboardBoton
          titulo="Gestion de garages"
          descripcion="Gestión y definición de nuevos garages"
          onClick={() => navigate("/gestion-garages")}
        />

        <DashboardBoton
          titulo="Panel de control"
          descripcion="Información de vital importancia"
          onClick={() => navigate("/panel-control")}
        />

        <DashboardBoton
          titulo="Control de acceso"
          descripcion="Control de entradas y salidas"
          onClick={() => navigate("/control-acceso")}
        />
      </div>
    </div>
  </>
);
}
export default AdminDashboard;
