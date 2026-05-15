import "./editar_zona.css";
import Header from "../componentes/header_admin";
import { ArrowLeft, Star, CarFront, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BotonGenerico from "../componentes/boton_generico";

function AgregarZona() 
{
    const navigate = useNavigate();

    return (
      <div>
        <Header />

        <div className="contenido-agregar-zona">
           <div className="form-garage">
            <ForumularioZona/>
            

           </div>
       </div>
        </div>

    );
}