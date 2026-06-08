// src/vistasEmpleados/perfil_empleado.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";
import Header from "../componentesEmpleado/header_empleado"
import Footer from "../componentesEmpleado/footer_empleado"

// Hooks y Contextos de SmartLot
import { useAuth } from "../contexts/useAuth";
import apiClient from "../servicies/apiClient";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import { ModelosGetAll } from "../servicies/API_Modelo";
import { MarcasGetAll } from "../servicies/API_Marca";

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

  // Estados locales
  const [personalData, setPersonalData] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const [vehiculos, setVehiculos] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(false);

  const obtenerIdUsuario = (usr) => usr?.id ?? usr?.id_usuario ?? usr?._id;

  // 🚀 Sincronización exacta con el formato relacional de tu base de datos SmartLot
  useEffect(() => {
    if (usuario) {
      const infoUsuario = usuario.datos || usuario.usuario || usuario;

      setPersonalData({
        nombre: infoUsuario.nombre || usuario.nombre || "",
        apellido: infoUsuario.apellido || usuario.apellido || "",
        email: infoUsuario.email || usuario.email || "",
        telefono: infoUsuario.telefono || usuario.telefono || ""
      });
    }
  }, [usuario]);

  // Cargar vehículos del usuario desde la API y enriquecer con marca/modelo
  useEffect(() => {
    if (!usuario) return;
    let montado = true;
    const idUsuario = Number(obtenerIdUsuario(usuario));
    if (!idUsuario) return;

    const cargarVehiculos = async () => {
      setCargandoVehiculos(true);

      const [resVehiculos, resModelos, resMarcas] = await Promise.all([
        VehiculosGetAll(),
        ModelosGetAll(),
        MarcasGetAll(),
      ]);

      if (!montado) return;

      const normalizarArray = (datos) =>
        Array.isArray(datos) ? datos
          : Array.isArray(datos?.datos) ? datos.datos
          : Array.isArray(datos?.data) ? datos.data
          : [];

      const modelosArr = normalizarArray(resModelos?.datos);
      const marcasArr = normalizarArray(resMarcas?.datos);

      const marcaPorId = new Map(
        marcasArr.map((m) => [Number(m.id), m.nombre || ""])
      );

      const infoModelo = new Map();
      modelosArr.forEach((m) => {
        const id = Number(m.id);
        const nombre = m.nombre || m.nombre_modelo || m.modelo || "";
        const marcaNombre = m.marca?.nombre ?? marcaPorId.get(Number(m.id_marca)) ?? "";
        infoModelo.set(id, { nombre, marcaNombre });
      });

      if (resVehiculos.respuesta) {
        const lista = normalizarArray(resVehiculos.datos);
        const vehiculosUsuario = lista
          .filter((v) =>
            Number(v.id_usuario ?? v.idUsuario ?? v.usuario_id) === idUsuario
          )
          .map((v) => {
            const info = infoModelo.get(Number(v.id_modelo));
            if (info) {
              return { ...v, marca_nombre: info.marcaNombre, modelo_nombre: info.nombre };
            }
            return v;
          });
        setVehiculos(vehiculosUsuario);
      }
      setCargandoVehiculos(false);
    };
    cargarVehiculos();
    return () => { montado = false; };
  }, [usuario]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
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

  // Guardar cambios de información personal (teléfono)
  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);

    try {
      const subUsuario = usuario?.datos || usuario?.usuario || {};
      const idUsuarioFinal = usuario?.id_usuario || usuario?.id || subUsuario.id_usuario || subUsuario.id;

      if (!idUsuarioFinal) {
        throw new Error("No se pudo detectar el ID del usuario activo en la sesión.");
      }

      await apiClient.put(`/api/usuario/${idUsuarioFinal}`, {
        telefono: personalData.telefono
      });

      setUsuario((prev) => {
        const actualizado = { ...prev };
        if (actualizado.datos) actualizado.datos.telefono = personalData.telefono;
        if (actualizado.usuario) actualizado.usuario.telefono = personalData.telefono;
        actualizado.telefono = personalData.telefono;
        return actualizado;
      });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Teléfono actualizado correctamente',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: error.message || error.response?.data?.message || 'Ocurrió un problema con el servidor.',
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
    <div className="Perfil-contenedor">
      <Header/>
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
              <h1>{personalData.nombre || personalData.apellido ? `Perfil de ${personalData.nombre} ${personalData.apellido}`.trim() : "Mi Perfil"}</h1>
            </header>
          </div>

          <form onSubmit={handleGuardarCambios} className="perfil-form-wrapper">
            <FormularioInfoPersonal data={personalData} onChange={handlePersonalChange} />
            
            <FormularioDetallesVehiculo vehiculos={vehiculos} />

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
      <Footer/>
    </div>
  );
}