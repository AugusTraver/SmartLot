import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../componentesAdmin/header_admin";
import FormularioReserva from "../componentes/FormularioReserva"; // Importación del nuevo componente
import { ReservasCreate } from "../servicies/API_Reserva";
import "./nuevaReserva.css"; 

const NuevaReserva = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Manejador del envío de la API llamado por el componente hijo
  const handleReservationSubmit = async (datosFormulario) => {
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    const resultado = await ReservasCreate(datosFormulario);

    setLoading(false);
    if (resultado.respuesta) {
      setMensaje({ tipo: "success", texto: "¡Reserva confirmada con éxito!" });
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMensaje({ tipo: "error", texto: "Hubo un error al procesar la reserva. Intentalo de nuevo." });
    }
  };

  return (
    <div className="nuevaReserva-contenedor">
      <Header />

      <div className="nuevaReserva-contenido">
        <button className="boton-back" onClick={() => navigate("/")} >
          <ArrowLeft size={20} />
         
        </button>

        <div className="textosTitulos">
          <h1>Nueva Reserva</h1>
          <p>Reserva tu plaza de estacionamiento para tu próxima jornada.</p>
        </div>

        {mensaje.texto && (
          <div className={`form-feedback alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        {/* Renderizado limpio del componente modular */}
        <FormularioReserva onSubmit={handleReservationSubmit} loading={loading} />
      </div>
    </div>
  );
}
export default NuevaReserva