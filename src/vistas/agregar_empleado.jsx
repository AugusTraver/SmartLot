import { useNavigate } from "react-router-dom"; // IMPORTANTE: Falta esto
import FormularioInfoPersonal from "../componentes/formulario_infoPersonal";
import FormularioDetallesVehiculo from "../componentes/formulario_detallesVehiculo";
import Header from "../componentes/header_admin";
import "./agregar_empleado.css"
import { CircleCheck } from 'lucide-react';
import BotonGenerico from "../componentes/boton_generico";

function AgregarEmpleado() {
  const navigate = useNavigate();

  return (
    <div className="agregar-empleado-page">
      <Header />
      <h3 style={{ color: "#1D4ED8", fontSize: "24px", fontWeight: "600" }}>Agregar Empleado</h3>
      <p>Configuración de nuevos usuarios y sus privilegios</p>
      <main style={{ padding: "20px", paddingBottom: "50px", marginTop: "-10px" }}>
        <FormularioInfoPersonal 
          infoPersonalTitulo="Información Personal"
          NombreCompleto="Nombre completo" 
          Email="Correo electrónico"
          NumeroTelefono="Número de teléfono"
        />

        <FormularioDetallesVehiculo
          detallesVehiculoTitulo="Detalles del Vehículo"
          Patente="Patente"
          Modelo="Modelo"
        />

        <div className="form-actions">
             <BotonGenerico onClick={() => navigate('/gestion_de_empleados')} className="btn-guardar-grande">
            
               <CircleCheck size={20} color="white" />
              <span>Guardar empleado</span>
              </BotonGenerico>

              <BotonGenerico style={{ backgroundColor: "grey" }} onClick={() => navigate('/gestion_de_empleados')} className="btn-cancelar-grande">
                <span>Cancelar</span>
              </BotonGenerico>
        </div>
      </main>
    
    </div>
  );
}

export default AgregarEmpleado;
