import "./footer_superadmin.css";
import {
  House,
  Building2,
  MapPin,
  MessageSquareWarning,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import FooterBotton from "./superadmin_dashboard_boton_footer";

function FooterSuperadmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const isPathActive = (path) => location.pathname === path;

  return (
    <footer className="footer-superadmin">
      <FooterBotton
        titulo="DASHBOARD"
        icono={<House size={28} />}
        onClick={() => navigate("/superadmin_dashboard")}
        isActive={isPathActive("/superadmin_dashboard")}
      />
      <FooterBotton
        titulo="EMPRESAS"
        icono={<Building2 size={28} />}
        onClick={() => navigate("/superadmin/gestion_empresas")}
        isActive={isPathActive("/superadmin/gestion_empresas")}
      />
      <FooterBotton
        titulo="SEDES"
        icono={<MapPin size={28} />}
        onClick={() => navigate("/superadmin/gestion_sedes")}
        isActive={isPathActive("/superadmin/gestion_sedes")}
      />
      <FooterBotton
        titulo="USUARIOS"
        icono={<Users size={28} />}
        onClick={() => navigate("/superadmin/gestion_usuarios")}
        isActive={isPathActive("/superadmin/gestion_usuarios")}
      />
      <FooterBotton
        titulo="CONFLICTOS"
        icono={<MessageSquareWarning size={28} />}
        onClick={() => navigate("/superadmin/conflictos")}
        isActive={isPathActive("/superadmin/conflictos")}
      />
    </footer>
  );
}

export default FooterSuperadmin;
