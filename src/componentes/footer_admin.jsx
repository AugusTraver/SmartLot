import "./footer_admin.css";
import{
    House, // home icono 
    CarFront, // gestion usuario icono 
    UsersRound,  // user icono
    ChartBarDecreasing  // panel de control 
}  from "lucide-react";
import {useNavigate } from "react-router-dom";
import FooterBotton from "./admin_dashboard_boton_footer"; // componete que se encarga del boton del footer que tiene titulo icono y el onclick 
function FooterAdmin (){

 const navigate = useNavigate(); 
 return (
    <footer className="footer-admin">
         <FooterBotton    
        titulo="DASHBOARD"
        icono={<UsersRound size={28}/>} 
        onClick={() => navigate("/gestion_de_empleados")}
        />
      <FooterBotton
        titulo="GARAGE"
        icono={<UsersRound size={28}/>} 
        onClick={() => navigate("/gestion_de_empleados")}
        />
    
          <FooterBotton
        titulo="GESTION"
        icono={<UsersRound size={28}/>} 
        onClick={() => navigate("/gestion_de_empleados")}
        />
       
          <FooterBotton
        titulo="PANEL"
        icono={<ChartBarDecreasing size={28}/>} 
        onClick={() => navigate("/gestion_de_empleados")}
        />
    </footer>
  );
}

export default FooterAdmin;