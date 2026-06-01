import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FormularioReserva from "../componentesEmpleado/form_reserva";
import { ReservasCreate } from "../servicies/API_Reserva";
import "./nueva_reserva.css"; 

const NuevaReserva = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const handleReservationSubmit = async (datosFormulario) => {
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    const resultado = await ReservasCreate(datosFormulario);

    setLoading(false);
    if (resultado.respuesta) {
      setMensaje({ tipo: "success", texto: "Reserva confirmada con exito." });
      setTimeout(() => navigate("/empleados_dashboard"), 1500);
    } else {
      setMensaje({ tipo: "error", texto: "Hubo un error al procesar la reserva. Intentalo de nuevo." });
    }
  };

  return (
    <div className="nuevaReserva-contenedor">
      <HeaderEmpleado />

      <div className="nuevaReserva-contenido">
        <button className="boton-back" onClick={() => navigate("/empleados_dashboard")}>
          <ArrowLeft size={20} />
        </button>

        <div className="textosTitulos">
          <h1>Nueva Reserva</h1>
          <p>Reserva tu plaza de estacionamiento para tu proxima jornada.</p>
        </div>

        {mensaje.texto && (
          <div className={`form-feedback alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <FormularioReserva onSubmit={handleReservationSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default NuevaReserva;
