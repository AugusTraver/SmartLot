import "./footer_empleado.css";
import {
  House,
  BookCheck,
  ClipboardClock,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import FooterBottonEmpleado from "./boton_footer_empleado";

function FooterEmpleado() {
  const navigate = useNavigate();
  const location = useLocation();

  const isPathActive = (path) => location.pathname === path;

  return (
    <footer className="footer-empleado">
      <FooterBottonEmpleado
        titulo="INICIO"
        icono={<House size={28} />}
        onClick={() => navigate("/empleados_dashboard")}
        isActive={isPathActive("/empleados_dashboard")}
      />
      <FooterBottonEmpleado
        titulo="RESERVA"
        icono={<BookCheck size={28} />}
        onClick={() => navigate("/nueva_reserva")}
        isActive={isPathActive("/nueva_reserva")}
      />
      <FooterBottonEmpleado
        titulo="HISTORIAL"
        icono={<ClipboardClock size={28} />}
        onClick={() => navigate("/historial_reserva")}
        isActive={isPathActive("/historial_reserva")}
      />
      <FooterBottonEmpleado
        titulo="PERFIL"
        icono={<UserRound size={28} />}
        onClick={() => navigate("/perfil_empleado")}
        isActive={isPathActive("/perfil_empleado")}
      />
    </footer>
  );
}

export default FooterEmpleado;
