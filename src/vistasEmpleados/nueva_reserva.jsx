import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FormularioReserva from "../componentesEmpleado/form_reserva";
import { ReservasCreate } from "../servicies/API_Reserva";
import "./nueva_reserva.css"; 

const NuevaReserva = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Orquestación de animaciones de entrada premium de la vista completa
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
    
    tl.from(".animate-back", { x: -15, opacity: 0 })
      .from(".animate-texts > *", { y: 20, opacity: 0, stagger: 0.15 }, "-=0.4")
      .from(".formularioReserva", { y: 30, opacity: 0, clearProps: "all" }, "-=0.3");
  }, { scope: containerRef });

  const handleReservationSubmit = async (datosFormulario) => {
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    const resultado = await ReservasCreate(datosFormulario);

    setLoading(false);
    if (resultado.respuesta) {
      setMensaje({ tipo: "success", texto: "Reserva confirmada con éxito." });
      setTimeout(() => navigate("/empleados_dashboard"), 1500);
    } else {
      setMensaje({ tipo: "error", texto: "Hubo un error al procesar la reserva. Inténtalo de nuevo." });
    }
  };

  return (
    <div className="nuevaReserva-contenedor" ref={containerRef}>
      <HeaderEmpleado />

      <main className="nuevaReserva-contenido" role="main">
        <div className="animate-back">
          <button 
            className="boton-back" 
            onClick={() => navigate("/empleados_dashboard")}
            aria-label="Volver al panel"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <header className="textosTitulos animate-texts">
          <h1>Nueva Reserva</h1>
          <p>Reserva tu plaza de estacionamiento para tu próxima jornada.</p>
        </header>

        {mensaje.texto && (
          <div className={`form-feedback alert-${mensaje.tipo}`} role="alert">
            <p>{mensaje.texto}</p>
          </div>
        )}
        
        {/* Contenedor del formulario perfectamente centrado */}
        <section className="formularioReserva">
          <FormularioReserva onSubmit={handleReservationSubmit} loading={loading} />
        </section>
      </main>
    </div>
  );
};

export default NuevaReserva;