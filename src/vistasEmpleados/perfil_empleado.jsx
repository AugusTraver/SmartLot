// src/vistasEmpleados/perfil_empleado.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Hooks y Contextos de SmartLot
import { useAuth } from "../contexts/useAuth";

// IMPORTACIONES CORREGIDAS AL 100% (Alineadas con la firma real de tus archivos)
import FormularioInfoPersonal from "../componentesEmpleado/formulario_info_personal";
import FormularioDetallesVehiculo from "../componentesEmpleado/formulario_detalles_vehiculo";

// Estilos unificados del módulo de empleado
import "../componentesEmpleado/formulario_perfilPersonal.css";

// Registro obligatorio del motor de animación
gsap.registerPlugin(useGSAP);

const esNombreGenerico = (nombre) => {
  const genericos = ["user", "usuario", "admin", "empleado"];
  return genericos.includes(nombre?.toLowerCase().trim());
};

const obtenerNombreUsuario = (usuario) => {
  const nombre = esNombreGenerico(usuario?.nombre) ? "" : usuario?.nombre;
  const nombreCompleto = [nombre, usuario?.apellido].filter(Boolean).join(" ").trim();
  
  return (
    nombreCompleto ||
    usuario?.nombre_usuario ||
    usuario?.nombreUsuario ||
    usuario?.username ||
    usuario?.email?.split("@")[0] ||
    "Empleado"
  );
};

export default function PerfilEmpleado() {
  const navigate = useNavigate();
  const mainScopeRef = useRef(null);
  
  // Consumimos el estado global real de la sesión
  const { usuario, loading } = useAuth();

  // Estado local blindado contra nulos
  const [empleadoData, setEmpleadoData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    modelo: "",
    patente: ""
  });

  // Sincronización segura de los datos una vez que la API responde
  useEffect(() => {
    if (usuario) {
      setEmpleadoData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        // Soporte tanto para campos planos como anidados de la base de datos de SmartLot
        modelo: usuario.modelo || usuario.vehiculo?.modelo || "",
        patente: usuario.patente || usuario.vehiculo?.patente || ""
      });
    }
  }, [usuario]);

  // Memoización premium para evitar lag en el re-render de inputs
  const nombreIdentificador = useMemo(() => obtenerNombreUsuario(empleadoData), [empleadoData]);

  // Handler genérico reactivo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoData((prev) => ({ ...prev, [name]: value }));
  };

  // Orquestación secuencial de GSAP con salvaguarda para estados de carga asíncronos
  useGSAP(() => {
    if (loading || !usuario) return; // Evitamos capturar selectores inexistentes durante la carga

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".animate-back", { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.4 })
      .fromTo(".textosTitulosPerfil", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .fromTo(".formulario-seccion", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, "-=0.3")
      .fromTo(".action-buttons-group", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
  }, { dependencies: [loading, usuario], scope: mainScopeRef });

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    console.log("Payload unificado enviado a SmartLot API (Node/MySQL):", empleadoData);
    // Aquí puedes meter tu llamada asíncrona mediante tu apiClient.put o post
  };

  // Render condicional ergonómico para evitar que la UI destelle vacía
  if (loading) {
    return (
      <div className="perfilUsuario-Contenedor" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", fontWeight: 600, fontFamily: "sans-serif" }}>Cargando datos de perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfilUsuario-Contenedor" ref={mainScopeRef}>
      <main className="perfilUsuario-contenido">
        
        {/* Top bar de navegación */}
        <div className="top-navigation-bar">
          <div className="animate-back">
            <button
              className="boton-back"
              onClick={() => navigate("/empleados_dashboard")}
              aria-label="Volver al panel principal"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <header className="textosTitulosPerfil">
            <h1>Perfil de Empleado</h1>
            <p className="subtitulo-dinamico">Gestionando a: {nombreIdentificador}</p>
          </header>
        </div>

        {/* Formulario unificado */}
        <form onSubmit={handleGuardarCambios} className="perfil-form-wrapper">
          
          {/* Subcomponentes puros modulares independientes */}
          <FormularioInfoPersonal data={empleadoData} onChange={handleInputChange} />
          
          <FormularioDetallesVehiculo data={empleadoData} onChange={handleInputChange} />

          {/* Botonera Premium integrada */}
          <div className="action-buttons-group">
            <button type="submit" className="btn-primary-action">
              <Save size={18} />
              <span>Guardar Cambios</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary-action" 
              onClick={() => navigate("/logout")}
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}