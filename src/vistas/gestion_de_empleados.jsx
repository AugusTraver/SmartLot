import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, ArrowLeft, ChevronDown, SlidersHorizontal, MoreVertical } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import "./gestion_de_empleados.css";
import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";
import BotonGenerico from "../componentes/boton_generico";

gsap.registerPlugin(useGSAP);

const GestionEmpleados = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Estado para controlar la búsqueda
  const [searchTerm, setSearchTerm] = useState("");

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
      name: "Marta Casablancas",
      role: "Empleado",
      email: "julian.c@smartlot.com",
      parkingSpot: "Plaza B-10 • Nivel Inferior",
      avatar: "https://i.pravatar.cc/150?u=22"
    },
    {
      id: 3,
      name: "Carlos Valery",
      role: "Empleado",
      email: "ana.v@smartlot.com",
      parkingSpot: "Plaza C-04 • Nivel Superior",
      avatar: "https://i.pravatar.cc/150?u=33"
    },
    {
      id: 4,
      name: "Juana Perez",
      role: "Empleado",
      email: "m.perez@smartlot.com",
      parkingSpot: "Plaza D-01 • Nivel Superior",
      avatar: "https://i.pravatar.cc/150?u=44"
    }
  ]);

  // Lógica de filtrado reactivo: nombre, email o cargo
  const empleadosFiltrados = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return empleados.filter((emp) => 
      emp.name.toLowerCase().includes(query) || 
      emp.email.toLowerCase().includes(query) || 
      emp.role.toLowerCase().includes(query)
    );
  }, [searchTerm, empleados]);

  // Animación de entrada inicial del layout[cite: 4, 6]
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
    tl.from(".animate-header", { y: 30, opacity: 0, stagger: 0.1 })
      .from(".animate-toolbar", { y: 20, opacity: 0 }, "-=0.5");
  }, { scope: containerRef });

  // Animación reactiva cuando cambian los resultados de búsqueda[cite: 6]
  useGSAP(() => {
    if (empleadosFiltrados.length > 0) {
      gsap.fromTo(".card-empleado-v3", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [empleadosFiltrados]);

  return (
    <div className="gestion-empleados" ref={containerRef}>
      <Header />

      <main className="envoltorio-contenido">
        <header className="header-seccion">
          <div className="header-left-group animate-header">
            <button className="boton-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>
            <div className="textos-titulos">
              <h1 className="titulo-vista">Gestión de Empleados</h1>
              <p className="subtitulo-vista">Administra el acceso y roles de todo el personal de SmartLot.</p>
            </div>
          </div>
          <div className="animate-header btn-container-mobile">
            <BotonGenerico
              className="btn-primario"
              onClick={() => navigate('/agregar_empleado')}
            >
              <UserPlus size={20} />
              <span>Agregar empleado</span>
            </BotonGenerico>
          </div>
        </header>

        <section className="barra-herramientas animate-toolbar">
          <div className="contenedor-busqueda">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o cargo..." 
              className="input-moderno" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filtros-grupo">
            <button className="btn-selector-sede">
              <span className="texto-sede">Filtrar por sede</span>
              <div className="iconos-flecha">
                {/* Doble Chevron solicitado por el usuario */}
                <ChevronDown size={18} className="chevron-icon" />
                <ChevronDown size={18} className="chevron-icon" />
              </div>
            </button>

            <button className="btn-icon-filtros">
              <SlidersHorizontal size={22} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        <div className="grid-bento">
          {empleadosFiltrados.length > 0 ? (
            empleadosFiltrados.map((emp) => (
              <article key={emp.id} className="card-empleado-v3">
                <div className="card-header-v3">
                  <img src={emp.avatar} alt={emp.name} className="avatar-v3" />
                  <span className={`role-badge-v3 ${emp.role.toLowerCase()}`}>{emp.role}</span>
                </div>

                <div className="card-body-v3">
                  <h3 className="emp-name-v3">{emp.name}</h3>
                </div>

                <div className="parking-section-v3">
                  <p className="parking-label-v3">ESTADO DE ESTACIONAMIENTO</p>
                  <div className="parking-pill-v3">
                    <div className="p-icon-box">P</div>
                    <div className="parking-details-v3">
                      <span className="spot-v3">{emp.parkingSpot}</span>
                      <span className="level-v3">{emp.parkingLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer-v3">
                  <div className="status-indicator">
                    <div className="green-dot"></div>
                    <span>Activo hoy</span>
                  </div>
                  <div className="footer-bottom-row">
                    <span className="email-v3">{emp.email}</span>
                    <button className="btn-more-v3"><MoreVertical size={20} /></button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="no-results animate-header" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <p className="text-lg">No se encontraron empleados que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </main>

      <FooterAdmin />
    </div>
  );
};

export default GestionEmpleados;