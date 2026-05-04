import "./admin_dashboard.css";
import DashboardBoton from "../componentes/admin_dashboard_boton";
import {useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();   // esto sirve para poder navegar a otras paginas


  return (
    <div className="admin-dashboard">
      <h1>Acciones Rapidas </h1>
      <DashboardBoton
        titulo="Gestionar de usuarios"
        descripcion="Gestionar y agregar nuevos empleados"
        onClick={() => navigate("/gestion-usuarios")}
      />
      <DashboardBoton
        titulo="Gestion de garages "
        descripcion="Gestión y definición de nuevos garages "
        onClick={() => navigate("/gestion-garages")}
      />
        <DashboardBoton
        titulo="Panel de control "
        descripcion="Información de vital importancia "
        onClick={() => navigate("/panel-control")}
      />
            <DashboardBoton
        titulo="Control de acceso  "
        descripcion="Control de entradas y salidas"
        onClick={() => navigate("/control-acceso")}
      />

    </div>
  );
}
export default AdminDashboard;