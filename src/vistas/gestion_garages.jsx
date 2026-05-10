import { useNavigate } from "react-router-dom";
import "./gestion_garages.css"
import TarjetaGarage from "../componentes/tarjeta_garages";
import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";

function GestionGarages() {
    const navigate = useNavigate();
    return (

        <div className="gestion-garages>">
            <Header />
            <div className="gestion-garages-container">

           
                <h1 className="titulo-garages">Gestión de Garages</h1>
                <p className="subtitulo-garages">Aquí puedes gestionar los garages disponibles en tu sistema.</p>
                <div className="tarjetas-garages">
                    <TarjetaGarage
                        titulo="Garage Central"
                        plazas={50}
                        estado="Abierto"
                        capacidad="80%"
                        ultimoReporte="Hace 10 minutos"
                        imagen="https://via.placeholder.com/300x200.png?text=Garage+Central"
                        onClick={() => navigate("/detalle_garage/1")}
                    />
                    <TarjetaGarage
                        titulo="Garage Norte"
                        plazas={30}
                        estado="Cerrado"
                        capacidad="100%"
                        ultimoReporte="Hace 1 hora"
                        imagen="https://via.placeholder.com/300x200.png?text=Garage+Norte"
                        onClick={() => navigate("/detalle_garage/2")}
                    />
                    <TarjetaGarage
                        titulo="Garage Sur"
                        plazas={20}
                        estado="Abierto"
                        capacidad="60%"
                        ultimoReporte="Hace 30 minutos"
                        imagen="https://via.placeholder.com/300x200.png?text=Garage+Sur"
                        onClick={() => navigate("/detalle_garage/3")}
                    />
                </div>
            </div>
                 <FooterAdmin />
      </div >

    );

}

            export default GestionGarages;