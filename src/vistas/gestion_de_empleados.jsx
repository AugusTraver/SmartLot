import "./gestion_de_empleados.css";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, UserPlus, ArrowLeft, 
  ChevronDown, SlidersHorizontal, MoreHorizontal,
  Mail, MapPin, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "../componentes/admin_dashboard_header";

// Registro del hook para React
gsap.registerPlugin(useGSAP);

const GestionEmpleados = () => {
  const navigate = useNavigate();
  const container = useRef(null);

  // Mock de datos para la interfaz
  const [empleados] = useState([
    {
      id: 1,
      name: "Elena Rodriguez",
      role: "Admin",
      email: "elena.rodriguez@smartlot.com",
      parkingSpot: "Plaza A-22 • Nivel Superior",
      avatar: "https://i.pravatar.cc/150?u=11"
    },
    {
      id: 2,
      name: "Julian Casablancas",
      role: "Editor",
      email: "julian.c@smartlot.com",
      parkingSpot: "Plaza B-10 • Nivel Inferior",
      avatar: "https://i.pravatar.cc/150?u=22"
    },
    {
      id: 3,
      name: "Ana Valery",
      role: "Seguridad",
      email: "ana.v@smartlot.com",
      parkingSpot: "Plaza C-04 • Nivel Superior",
      avatar: "https://i.pravatar.cc/150?u=33"
    }
  ]);

  return (

    <div className="view-wrapper" ref={container}>
      {/* Elemento decorativo de fondo para dar profundidad */}
      <div className="ambient-light"></div>

      <main className="envoltorio-contenido">
        {/* Encabezado de la Vista */}
        <div className="header-seccion anim-header">
            <button className="boton-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="textos">
                <h1 className="titulo-vista">Gestión de Empleados</h1>
                <p className="subtitulo-vista">Panel de control de accesos y jerarquías del sistema.</p>
            </div>
            <button className="btn-primario">
              <UserPlus size={18} />
              <p className="textoAgregarEmpelado">Agregar Empleado</p>
            </button>
        </div>

        {/* Herramientas de filtrado */}
        <section className="barra-herramientas anim-bar">
          <div className="contenedor-busqueda">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Buscar empleado..." className="input-moderno" />
          </div>
          <div className="filtros-grupo">
            <button className="btn-secundario">
                Sede Central <ChevronDown size={16} />
            </button>
            <button className="btn-icon">
                <SlidersHorizontal size={20} />
            </button>
          </div>
        </section>

        {/* Grid Bento de Empleados */}
        <div className="grid-bento">
          {empleados.map(emp => (
            <div key={emp.id} className="card-empleado">
               <div className="card-inner">
                  <div className="top-section"> 
                    <img src={emp.avatar} alt={emp.name} className="avatar-big" />
                    <button className="btn-more">
                        <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <div className="mid-section">
                    <div className="role-chip">
                        <ShieldCheck size={12} />
                        {emp.role}
                    </div>
                    <h3>{emp.name}</h3>
                  </div>
                  <div className="bottom-section">
                    <div className="info-row">
                        <Mail size={14} />
                        <span>{emp.email}</span>
                    </div>
                    <div className="info-row parking">
                        <MapPin size={14} />
                        <span>{emp.parkingSpot}</span>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GestionEmpleados;