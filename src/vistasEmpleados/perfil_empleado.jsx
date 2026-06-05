import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import FormularioInfoPersonal from "../componentesAdmin/formulario_infoPersonal";
import FormularioDetallesVehiculo from "../componentesAdmin/formulario_detallesVehiculo";
import "./perfil_empleado.css"
// Registro obligatorio del ciclo de vida de animación para React
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

export default function PerfilEmpleado({ usuarioInicial }) {
  const navigate = useNavigate();
  const mainScopeRef = useRef(null);

  // Estado unificado para control mutor de formularios hijos
  const [empleadoData, setEmpleadoData] = useState(usuarioInicial || {
    nombre: "Carlos",
    apellido: "Mendoza",
    email: "carlos.mendoza@empresa.com",
    telefono: "+54 11 5555 1234",
    modelo: "Honda Civic 2023",
    patente: "AF 123 MP"
  });

  // Memoización del identificador para evitar recalculación en re-renders de inputs
  const nombreIdentificador = useMemo(() => obtenerNombreUsuario(empleadoData), [empleadoData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoData((prev) => ({ ...prev, [name]: value }));
  };

  // Orquestación de animación escalonada con limpieza de memoria automática
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".animate-back", { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.4 })
      .fromTo(".textosTitulosPerfil", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .fromTo(".animate-section", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, "-=0.3")
      .fromTo(".animate-actions", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
  }, { scope: mainScopeRef });

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    // Integración limpia para lógica asíncrona hacia backend (Node/Express/MySQL)
    console.log("Payload enviado a base de datos:", empleadoData);
  };

  return (
    <div className="perfilUsuario-Contenedor" ref={mainScopeRef}>
      <main className="perfilUsuario-contenido">
        
        {/* Barra superior de navegación */}
        <div className="top-navigation-bar">
          <div className="animate-back">
            <button
              className="boton-back"
              onClick={() => navigate("/empleados_dashboard")}
              aria-label="Volver al panel de empleados"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <header className="textosTitulosPerfil">
            <h1>Perfil del Empleado</h1>
            <p className="subtitulo-dinamico">Gestionando a: {nombreIdentificador}</p>
          </header>
        </div>

        {/* Formulario estructurado */}
        <form onSubmit={handleGuardarCambios} className="perfil-form-wrapper">
          <FormularioInfoPersonal data={empleadoData} onChange={handleInputChange} />
          
          <FormularioDetallesVehiculo data={empleadoData} onChange={handleInputChange} />

          {/* Botonera de acciones del Dashboard */}
          <div className="action-buttons-group animate-actions">
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