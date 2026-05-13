import "./gestion_de_empleados.css";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  ArrowLeft,
  ChevronDown,
  SlidersHorizontal,
  MoreHorizontal,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";
import BotonGenerico from "../componentes/boton_generico";

const GestionEmpleados = () => {
  const navigate = useNavigate();
  const container = useRef(null);

  // Mock de empleados
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
      role: "Empleado",
      email: "julian.c@smartlot.com",
      parkingSpot: "Plaza B-10 • Nivel Inferior",
      avatar: "https://i.pravatar.cc/150?u=22"
    },
    {
      id: 3,
      name: "Ana Valery",
      role: "Empleado",
      email: "ana.v@smartlot.com",
      parkingSpot: "Plaza C-04 • Nivel Superior",
      avatar: "https://i.pravatar.cc/150?u=33"
    }
  ]);

  // Animaciones Premium con limpieza automática
  

  return (
    <div className="gestion-empleados" ref={container}>
      <Header />
      <FooterAdmin />

      <div className="ambient-light"></div>

      {/* Main sin restricciones de ancho en CSS */}
      <main className="envoltorio-contenido">

        {/* HEADER: Sin el div 'textos' intermedio para mejor control flex */}
        <header className="header-seccion anim-header">
          <button className="boton-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>

          <h1 className="titulo-vista">Gestión de Empleados</h1>

          <BotonGenerico className="btn-primario" onClick={() => navigate('/agregar_empleado')}>
            <UserPlus size={18} />
            <span className="textoAgregarEmpelado">Agregar Empleado</span>
          </BotonGenerico>
        </header>

        {/* TOOLBAR: Buscador crece al máximo disponible */}
        <section className="barra-herramientas anim-bar">
          <div className="contenedor-busqueda">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar empleado por nombre, email o cargo..."
              className="input-moderno"
            />
          </div>

          <div className="filtros-grupo">
            <button className="btn-selector-sede">
              <span className="texto-sede">Filtrar por sede</span>
              <div className="iconos-flecha">
                <ChevronDown size={18} className="chevron-icon" />
                <ChevronDown size={18} className="chevron-icon" />
              </div>
            </button>

            <button className="btn-icon-filtros">
              <SlidersHorizontal size={22} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        {/* GRID: Fluida de borde a borde */}
        <div className="grid-bento">
          {empleados.map(emp => (
            <article key={emp.id} className="card-empleado">
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
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GestionEmpleados;