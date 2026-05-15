import "./editar_zona.css";
import Header from "../componentes/header_admin";
import { ArrowLeft, Star, CarFront, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ForumularioZona from "../componentes/formulario_zona";
import FormularioCapacidad from "../componentes/formulario_capacidad";
import BotonGenerico from "../componentes/boton_generico";

function AgregarZona() {
    const navigate = useNavigate();

    return (
        <div>
            <Header />

            <div className="contenido-agregar-zona">
                <h1>Nuevo Garage </h1>

                <div className="form-garage">
                    <ForumularioZona
                        nombreZona="Nombre del Garage"
                        nivel="Nivel / Planta"
                        etiqueta="Etiquetas"
                        ubicacion="Ubicación"

                    />
                    <FormularioCapacidad
                        capacidad="Capacidad total"
                        capacidadReservas="Capacidad para reservas"
                        capacidadNoReservas="Capacidad para no reservas"
                    />

                </div>
                <div className="acciones-garage">

                    <BotonGenerico
                        className="btn-guardar-grande"
                        onClick={() => navigate('/gestion_garages')}
                    >                  
                        <CirclePlus size={20} />
                        <span>Guardar Cambios</span>
                    </BotonGenerico>

                    <BotonGenerico
                        className="btn-cancelar-grande"
                        onClick={() => navigate('/gestion_garages')}                    >

                        <span>Cancelar</span>

                    </BotonGenerico>

                </div>
            </div>
        </div>

    );
}

export default AgregarZona;