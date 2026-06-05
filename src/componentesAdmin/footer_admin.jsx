import "./footer_admin.css";
import {
    House, 
    CarFront, 
    UsersRound,  
    ChartBarDecreasing  
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Importamos useLocation
import FooterBotton from "./admin_dashboard_boton_footer";

function FooterEmpleado() {
    const navigate = useNavigate();
    const location = useLocation(); // Obtenemos la ruta actual

    // Función auxiliar para verificar si la ruta está activa
    const isPathActive = (path) => location.pathname === path;

    return (
        <footer className="footer-admin">
            <FooterBotton    
                titulo="DASHBOARD"
                icono={<House size={28}/>} 
                onClick={() => navigate("/admin_dashboard")}
                isActive={isPathActive("/admin_dashboard")} // Se activa si estamos en la raíz
            />
            <FooterBotton
                titulo="GARAGE"
                icono={<CarFront size={28}/>} 
                onClick={() => navigate("/gestion_garages")}
                isActive={isPathActive("/gestion_garages")}
            />
            <FooterBotton
                titulo="GESTION"
                icono={<UsersRound size={28}/>} 
                onClick={() => navigate("/gestion_de_empleados")}
                isActive={isPathActive("/gestion_de_empleados")}
            />
            <FooterBotton
                titulo="PANEL"
                icono={<ChartBarDecreasing size={28}/>} 
                onClick={() => navigate("/panel_de_control")}
                isActive={isPathActive("/panel_de_control")}
            />
        </footer>
    );
}

export default FooterEmpleado;