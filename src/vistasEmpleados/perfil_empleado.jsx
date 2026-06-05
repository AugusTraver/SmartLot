// src/vistasEmpleados/perfil_empleado.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";

// Hooks y Contextos de SmartLot
import { useAuth } from "../contexts/useAuth";
import apiClient from "../servicies/apiClient";

// Importación de subformularios estructurados
import FormularioInfoPersonal from "../componentesEmpleado/formulario_info_personal";
import FormularioDetallesVehiculo from "../componentesEmpleado/formulario_detalles_vehiculo";

// Archivo de estilos con mayúsculas y minúsculas exactas
import "../componentesEmpleado/formulario_PerfilPersonal.css";

gsap.registerPlugin(useGSAP);

export default function PerfilEmpleado() {
  const navigate = useNavigate();
  const mainScopeRef = useRef(null);
  
  const { usuario, setUsuario, loading } = useAuth();

  // Estados locales independientes blindados con strings vacíos
  const [personalData, setPersonalData] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const [vehiculoData, setVehiculoData] = useState({ modelo: "", patente: "" });
  const [guardando, setGuardando] = useState(false);

  // Sincronización segura del estado global de useAuth hacia los formularios
  useEffect(() => {
    if (usuario) {
      // Intentamos leer tanto de la raíz como de un subobjeto por si viene anidado de la API
      const infoUsuario = usuario.usuario || usuario.empleado || usuario;

      setPersonalData({
        nombre: infoUsuario.nombre || usuario.nombre || "",
        apellido: infoUsuario.apellido || usuario.apellido || "",
        email: infoUsuario.email || usuario.email || "",
        telefono: infoUsuario.telefono || usuario.telefono || ""
      });

      setVehiculoData({
        modelo: usuario.vehiculo?.modelo || infoUsuario.modelo || usuario.modelo || "",
        patente: usuario.vehiculo?.patente || infoUsuario.patente || usuario.patente || ""
      });
    }
  }, [usuario]);

  const handleVehiculoChange = (e) => {
    const { name, value } = e.target;
    setVehiculoData((prev) => ({ ...prev, [name]: value }));
  };

  // Orquestación limpia de transiciones aceleradas por hardware para GSAP
  useGSAP(() => {
    if (loading || !usuario) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".animate-back", { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.4 })
      .fromTo(".textosTitulosPerfil", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .fromTo(".formulario-seccion", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, "-=0.3")
      .fromTo(".action-buttons-group", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
  }, { dependencies: [loading, usuario], scope: mainScopeRef });

  // Lógica unificada de guardado y persistencia en base de datos
  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);

    try {
      // 🚀 EXTRACCIÓN MÁXIMA DE ID DE USUARIO: Busca en todas las variantes relacionales posibles
      const subUsuario = usuario?.usuario || usuario?.empleado || {};
      const idUsuarioFinal = usuario?.id_usuario || usuario?.id || subUsuario.id_usuario || subUsuario.id;

      if (!idUsuarioFinal) {
        throw new Error("No se pudo detectar el ID del usuario activo en la sesión.");
      }

      let response;
      const idVehiculoExistente = usuario?.id_vehiculo || usuario?.vehiculo?.id || usuario?.vehiculo?.id_vehiculo || subUsuario.id_vehiculo;

      if (idVehiculoExistente) {
        // MODO ACTUALIZAR (PUT)
        response = await apiClient.put(`/api/vehiculo/${idVehiculoExistente}`, {
          modelo: vehiculoData.modelo,
          patente: vehiculoData.patente
        });
      } else {
        // MODO CREAR (POST): Enviamos el ID de usuario real extraído sin dar lugar a undefined
        response = await apiClient.post('/api/vehiculo', {
          modelo: vehiculoData.modelo,
          patente: vehiculoData.patente,
          id_usuario: idUsuarioFinal
        });
      }

      // Re-estructuramos la respuesta del backend para inyectarla en el estado global
      const datosVehiculoBackend = response.data?.vehiculo || response.data || {};
      const vehiculoActualizado = {
        id: idVehiculoExistente || datosVehiculoBackend.id || datosVehiculoBackend.id_vehiculo,
        id_vehiculo: idVehiculoExistente || datosVehiculoBackend.id_vehiculo || datosVehiculoBackend.id,
        modelo: vehiculoData.modelo,
        patente: vehiculoData.patente
      };

      // Sincronizamos useAuth para que todo el panel de SmartLot conozca los nuevos datos
      setUsuario((prev) => ({
        ...prev,
        id_vehiculo: vehiculoActualizado.id_vehiculo,
        vehiculo: vehiculoActualizado
      }));

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Detalles del vehículo guardados',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error("Error al persistir cambios en SmartLot:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar/actualizar',
        text: error.message || error.response?.data?.message || 'Ocurrió un inconveniente con el servidor al procesar el vehículo.',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrarSesion = async () => {
    try {
      await apiClient.post('/api/usuario/logout');
    } catch (err) {}
    setUsuario(null);
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="perfilUsuario-Contenedor" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", fontWeight: 600, fontFamily: "sans-serif" }}>Cargando sesión segura...</p>
      </div>
    );
  }

  return (
    <div className="perfilUsuario-Contenedor" ref={mainScopeRef}>
      <main className="perfilUsuario-contenido">
        
        <div className="top-navigation-bar">
          <div className="animate-back">
            <button
              className="boton-back"
              onClick={() => navigate("/empleados_dashboard")}
              aria-label="Volver"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <header className="textosTitulosPerfil">
            <h1>Mi Perfil</h1>
            <p className="subtitulo-dinamico">
              Sesión activa: {personalData.nombre} {personalData.apellido}
            </p>
          </header>
        </div>

        <form onSubmit={handleGuardarCambios} className="perfil-form-wrapper">
          <FormularioInfoPersonal data={personalData} />
          
          <FormularioDetallesVehiculo 
            vehiculoData={vehiculoData} 
            onChange={handleVehiculoChange} 
          />

          <div className="action-buttons-group">
            <button type="submit" className="btn-primary-action" disabled={guardando}>
              <span>{guardando ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary-action" 
              onClick={handleCerrarSesion}
              style={{ color: '#e11d48', backgroundColor: '#fff1f2' }}
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