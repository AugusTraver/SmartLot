// src/vistasEmpleados/perfil_empleado.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";
import Header from "../componentesEmpleado/header_empleado"

// Contexto Global de Autenticación
import { useAuth } from "../contexts/useAuth";
import apiClient from "../servicies/apiClient";

// Importación de submódulos
import FormularioInfoPersonal from "../componentesEmpleado/formulario_info_personal";
import FormularioDetallesVehiculo from "../componentesEmpleado/formulario_detalles_vehiculo";

import "./perfil_empleado.css";

gsap.registerPlugin(useGSAP);

export default function PerfilEmpleado() {
  const navigate = useNavigate();
  const mainScopeRef = useRef(null);
  
  // Extraemos los datos de sesión y el mutador global de estado
  const { usuario, setUsuario, loading } = useAuth();

  // Estados locales independientes
  const [personalData, setPersonalData] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const [vehiculoData, setVehiculoData] = useState({ modelo: "", patente: "" });
  const [guardando, setGuardando] = useState(false);

  // Sincronización robusta con la sesión del empleado
  useEffect(() => {
    if (usuario) {
      setPersonalData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        telefono: usuario.telefono || ""
      });

      // Mapeo seguro si el vehículo viene anidado en el objeto de sesión de SmartLot
      setVehiculoData({
        modelo: usuario.vehiculo?.modelo || usuario.modelo || "",
        patente: usuario.vehiculo?.patente || usuario.patente || ""
      });
    }
  }, [usuario]);

  // Handler reactivo exclusivo para las propiedades del vehículo mutables
  const handleVehiculoChange = (e) => {
    const { name, value } = e.target;
    setVehiculoData((prev) => ({ ...prev, [name]: value }));
  };

  // Orquestación limpia de animaciones GSAP
  useGSAP(() => {
    if (loading || !usuario) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".animate-back", { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.4 })
      .fromTo(".textosTitulosPerfil", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .fromTo(".formulario-seccion", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, "-=0.3")
      .fromTo(".action-buttons-group", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
  }, { dependencies: [loading, usuario], scope: mainScopeRef });

  // Lógica Funcional: Persistir o Actualizar el Auto en la BD mediante API
  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);

    try {
      let response;
      const tieneVehiculoPrevio = usuario?.id_vehiculo || usuario?.vehiculo?.id;

      if (tieneVehiculoPrevio) {
        // RUTA 1: Actualización (PUT) si el empleado ya tenía un coche registrado
        const idVehiculo = usuario.id_vehiculo || usuario.vehiculo.id;
        response = await apiClient.put(`/api/vehiculo/${idVehiculo}`, {
          modelo: vehiculoData.modelo,
          patente: vehiculoData.patente
        });
      } else {
        // RUTA 2: Creación (POST) si es un vehículo completamente nuevo para el usuario
        response = await apiClient.post('/api/vehiculo', {
          modelo: vehiculoData.modelo,
          patente: vehiculoData.patente,
          id_usuario: usuario.id // Asociamos al id del empleado autenticado
        });
      }

      // Sincronizamos el estado global de la sesión con los datos nuevos
      const vehiculoActualizado = response.data?.vehiculo || { 
        id: tieneVehiculoPrevio || response.data?.id,
        modelo: vehiculoData.modelo, 
        patente: vehiculoData.patente 
      };

      setUsuario((prev) => ({
        ...prev,
        id_vehiculo: vehiculoActualizado.id,
        vehiculo: vehiculoActualizado
      }));

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Vehículo guardado correctamente',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error("Error al guardar el vehículo:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de sincronización',
        text: error.response?.data?.message || 'No se pudo conectar con el servidor de SmartLot.',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setGuardando(false);
    }
  };

  // Cierre de sesión asíncrono y seguro integrado al Contexto de tu Dropdown
  const handleCerrarSesion = async () => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Cerrando sesión de forma segura...',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    try {
      await apiClient.post('/api/usuario/logout');
    } catch (err) {
      // Forzamos salida local aunque el endpoint del servidor falle o expire
    }

    setUsuario(null);
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="perfilUsuario-Contenedor" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", fontWeight: 600, fontFamily: "sans-serif" }}>Cargando datos de perfil...</p>
      </div>
    );
  }

  return (
    <div>
    <Header/>
    <div className="perfilUsuario-Contenedor" ref={mainScopeRef}>
      
      <main className="perfilUsuario-contenido">
        
        {/* Top bar de navegación */}
        <div className="top-navigation-bar">
          <div className="animate-back">
            <button
              className="boton-back"
              onClick={() => navigate("/empleados_dashboard")}
              aria-label="Volver al panel"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          <header className="textosTitulosPerfil">
            <h1> Perfil de {personalData.nombre} {personalData.apellido} </h1>
            
          </header>
        </div>

        {/* Formulario Maestro */}
        <form onSubmit={handleGuardarCambios} className="perfil-form-wrapper">
          
          {/* Subcomponente Puro (Muestra los datos fijos de lectura) */}
          <FormularioInfoPersonal data={personalData} />
          
          {/* Subcomponente Mutable (Modifica o añade el Auto) */}
          <FormularioDetallesVehiculo 
            vehiculoData={vehiculoData} 
            onChange={handleVehiculoChange} 
          />

          {/* Botonera Premium integrada */}
          <div className="action-buttons-group">
            <button 
              type="submit" 
              className="btn-primary-action"
              disabled={guardando}
              style={{ opacity: guardando ? 0.7 : 1 }}
            >
              <Save size={18} />
              <span>{guardando ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary-action" 
              onClick={handleCerrarSesion}
              style={{ color: '#e11d48', backgroundColor: '#fff1f2' }} // Rojo premium para logout visual claro
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </form>
      </main>
    </div>
      </div>
  );
}