import "./agregar_zona.css";
import Header from "../componentes/header_admin";
import { CirclePlus, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormularioZona from "../componentes/formulario_zona";
import FormularioCapacidad from "../componentes/formulario_capacidad";
import BotonGenerico from "../componentes/boton_generico";

function AgregarZona() {
  const navigate = useNavigate();

  return (
    <div className="agregar-zona">
      <Header />

      <div className="contenido-agregar-zona">
        <div className="top-garage">
          <button className="boton-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>

          <div className="info-top">
            <p>NUEVA ZONA</p>
            <h1>Nuevo Garage</h1>
            <span>Configura los detalles de la nueva zona de estacionamiento.</span>
          </div>

          <div className="boton-check">
            <CheckCircle2 size={30} />
          </div>
        </div>

        <div className="form-garage">
          <FormularioZona
            nombreZona="Nombre del Garage"
            nivel="Nivel / Planta"
            etiqueta="Etiqueta de Color"
            ubicacion="Ubicación exacta"
          />

          <FormularioCapacidad
            capacidad="Capacidad total"
            capacidadReservas="Capacidad reservada"
            capacidadNoReservas="Capacidad no reservada"
          />
        </div>

        <div className="acciones-garage">
          <BotonGenerico
            className="btn-guardar-grande"
            onClick={() => console.log("Guardando...")}
          >
            <CirclePlus size={22} />
            <span>Crear Zona</span>
          </BotonGenerico>

          <BotonGenerico
            className="btn-cancelar-grande"
            onClick={() => navigate("/gestion_garages")}
          >
            <span>Cancelar</span>
          </BotonGenerico>
        </div>
      </div>
    </div>
  );
}

export default AgregarZona;