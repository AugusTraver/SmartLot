import logo from "../Imagenes/Logo_SmartLot-removebg-preview.png";
import "../componentesAdmin/header_admin.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "../components/UserDropdown";

const aplicarTemaEmpleado = () => {
  try {
    const config = JSON.parse(localStorage.getItem("smartlot_empleado_config")) || {};
    document.documentElement.dataset.empleadoTheme = config.tema === "oscuro" ? "oscuro" : "claro";
  } catch {
    document.documentElement.dataset.empleadoTheme = "claro";
  }
};

function HeaderEmpleado() {
  const navigate = useNavigate();

  useEffect(() => {
    aplicarTemaEmpleado();
  }, []);

  return (
    <>
      <div className="header">
        <div className="header-left">

          <div className="logo-smartlot" >
            <img onClick={() => navigate("/empleados_dashboard")} src={logo} alt="logo SmartLot"  style={{ cursor: 'pointer' }}/>
          </div>
          
        </div>
        <div className="header-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30 " fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <UserDropdown />
        </div>
      </div>
      <div className="header-spacer" aria-hidden="true" />
    </>
  );
}

export default HeaderEmpleado;
