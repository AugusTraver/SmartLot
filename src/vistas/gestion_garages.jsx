import { useNavigate } from "react-router-dom";
import{ArrowLeft,CirclePlus}  from "lucide-react";
import "./gestion_garages.css"
import TarjetaGarage from "../componentes/tarjeta_garages";
import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";
import BotonGenerico from "../componentes/boton_generico";
import fotoGarage1 from "../Imagenes/Garage1.jpg";
import fotoGarage2 from "../Imagenes/Garage2.jpg"
import fotoGarage3 from "../Imagenes/Garage3.jpg"

function GestionGarages() {
    const navigate = useNavigate();
    return (

         
       <div className="gestion-garages">
            <Header />

        <div className="gestion-garages-top">

          <button className="boton-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          </button>

      <p>PANEL DE CONTROL</p>

      <h1>Configuración de Garages</h1>

    </div>

    {/* BOTON */}

     <BotonGenerico className="btn-nueva-zona" onClick={() => navigate('/agregar_zona')}>
            <CirclePlus size={18} />
            <span >Nueva Zona</span>
          </BotonGenerico>


    {/* STATS */}

    <div className="stats-container">

      <div className="stats-card">

        <div className="stats-header">

          <h4>TOTAL ZONAS</h4>

          <span className="stats-icon">🗺️</span>

        </div>

        <h2>08</h2>

        <p>
          <span className="stats-green">+2</span> este mes
        </p>

      </div>

      <div className="stats-card">

        <div className="stats-header">

          <h4>OCUPACIÓN MEDIA</h4>

          <span className="stats-icon">📊</span>

        </div>

        <h2>64%</h2>

        <p>Pico máximo a las 14:00</p>

      </div>

    </div>



            <div className="gestion-garages-container">

           
                <h2 className="titulo-garages">Gestión de Garages</h2>
                <p className="subtitulo-garages">Aquí puedes gestionar los garages disponibles en tu sistema.</p>
                <div className="contenedor-tarjetas">
                    <TarjetaGarage
                        titulo="Garage Central"
                        plazas={50}
                        estado="Abierto"
                        capacidad="80%"
                        ultimoReporte="Hace 10 minutos"
                        imagen={fotoGarage1}
                        onClick={() => navigate("/detalle_garage/1")}
                    />
                    <TarjetaGarage
                        titulo="Garage Norte"
                        plazas={30}
                        estado="Cerrado"
                        capacidad="100%"
                        ultimoReporte="Hace 1 hora"
                        imagen={fotoGarage2}
                        onClick={() => navigate("/detalle_garage/2")}
                    />
                    <TarjetaGarage
                        titulo="Garage Sur"
                        plazas={20}
                        estado="Abierto"
                        capacidad="60%"
                        ultimoReporte="Hace 30 minutos"
                        imagen={fotoGarage3}
                        onClick={() => navigate("/detalle_garage/3")}
                    />
                </div>
            </div>
                 <FooterAdmin />
      </div >

    );

}

            export default GestionGarages;