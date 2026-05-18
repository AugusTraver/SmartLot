import { useNavigate } from "react-router-dom";
import { ArrowLeft, CirclePlus, MapPinned, BarChart3 } from "lucide-react";
import "./gestion_garages.css";
import TarjetaGarage from "../componentes/tarjeta_garages";
import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";
import BotonGenerico from "../componentes/boton_generico";
import fotoGarage1 from "../Imagenes/Garage1.jpg";
import fotoGarage2 from "../Imagenes/Garage2.jpg";
import fotoGarage3 from "../Imagenes/Garage3.jpg";

function GestionGarages() {
  const navigate = useNavigate();

  return (
    <div className="gestion-garages">
      <Header />

      <main className="gestion-garages-main">
        <section className="gestion-garages-top">
          <button className="boton-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <p>PANEL DE CONTROL</p>
            <h1>Configuración de Garages</h1>
          </div>
        </section>

        <section className="garages-actions">
          <BotonGenerico
            className="btn-nueva-zona"
            onClick={() => navigate("/agregar_zona")}
          >
            <CirclePlus size={20} />
            <span>Nueva Zona</span>
          </BotonGenerico>
        </section>

        <section className="stats-container">
          <div className="stats-card">
            <div className="stats-header">
              <h4>Total zonas</h4>
              <span className="stats-icon">
                <MapPinned size={24} />
              </span>
            </div>

            <h2>08</h2>

            <p>
              <span className="stats-green">+2</span> este mes
            </p>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <h4>Ocupación media</h4>
              <span className="stats-icon">
                <BarChart3 size={24} />
              </span>
            </div>

            <h2>64%</h2>

            <p>Pico máximo a las 14:00</p>
          </div>
        </section>

        <section className="gestion-garages-container">
          <div className="garages-section-heading">
            <h2 className="titulo-garages">Gestión de Garages</h2>
            <p className="subtitulo-garages">
              Administra las zonas disponibles, revisa su estado y actualiza su
              capacidad en tiempo real.
            </p>
          </div>

          <div className="contenedor-tarjetas">
            <TarjetaGarage
              titulo="Garage Central"
              plazas={50}
              estado="Abierto"
              capacidad="80%"
              ultimoReporte="Hace 10 minutos"
              imagen={fotoGarage1}
              onClick={() => navigate("/editar_zona")}
            />

            <TarjetaGarage
              titulo="Garage Norte"
              plazas={30}
              estado="Cerrado"
              capacidad="100%"
              ultimoReporte="Hace 1 hora"
              imagen={fotoGarage2}
              onClick={() => navigate("/editar_zona")}
            />

            <TarjetaGarage
              titulo="Garage Sur"
              plazas={20}
              estado="Abierto"
              capacidad="60%"
              ultimoReporte="Hace 30 minutos"
              imagen={fotoGarage3}
              onClick={() => navigate("/editar_zona")}
            />
          </div>
        </section>
      </main>

      <FooterAdmin />
    </div>
  );
}

export default GestionGarages;