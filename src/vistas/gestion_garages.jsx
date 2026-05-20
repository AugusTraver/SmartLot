import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CirclePlus, MapPinned, BarChart3 } from "lucide-react";
import "./gestion_garages.css";
import TarjetaGarage from "../componentes/tarjeta_garages";
import Header from "../componentes/header_admin";
import FooterAdmin from "../componentes/footer_admin";
import BotonGenerico from "../componentes/boton_generico";
import { GaragesGetAll } from "../servicies/API_Garage";
import fotoGarage1 from "../Imagenes/Garage1.jpg";
import fotoGarage2 from "../Imagenes/Garage2.jpg";
import fotoGarage3 from "../Imagenes/Garage3.jpg";

const imagenesGarage = [fotoGarage1, fotoGarage2, fotoGarage3];

const obtenerListadoGarages = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.garages)) return datos.garages;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const obtenerIdGarage = (garage, index) =>
  garage.id_garage ?? garage.idGarage ?? garage.id ?? garage._id ?? index;

const obtenerEstadoGarage = (estado) => {
  if (typeof estado === "boolean") return estado ? "Abierto" : "Cerrado";
  if (typeof estado === "number") return estado === 1 ? "Abierto" : "Cerrado";

  if (typeof estado === "string") {
    const estadoNormalizado = estado.toLowerCase();
    return ["true", "activo", "abierto", "1"].includes(estadoNormalizado)
      ? "Abierto"
      : "Cerrado";
  }

  return "Abierto";
};

const obtenerOcupacion = (garage) =>
  Number(garage.ocupacion_reservas || 0) +
  Number(garage.ocupacion_no_reservas || 0);

const obtenerCapacidadPorcentaje = (garage) => {
  const capacidad = Number(garage.capacidad || 0);
  if (capacidad <= 0) return "0%";

  const porcentaje = Math.min(
    100,
    Math.round((obtenerOcupacion(garage) / capacidad) * 100)
  );

  return `${porcentaje}%`;
};

function GestionGarages() {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let estaMontado = true;

    const cargarGarages = async () => {
      setLoading(true);
      setError("");

      const response = await GaragesGetAll();

      if (!estaMontado) return;

      if (response.respuesta) {
        setGarages(obtenerListadoGarages(response.datos));
      } else {
        setError("No se pudieron cargar los garages.");
      }

      setLoading(false);
    };

    cargarGarages();

    return () => {
      estaMontado = false;
    };
  }, []);

  const ocupacionMedia =
    garages.length > 0
      ? Math.round(
          garages.reduce((total, garage) => {
            const capacidad = Number(garage.capacidad || 0);
            if (capacidad <= 0) return total;
            return total + (obtenerOcupacion(garage) / capacidad) * 100;
          }, 0) / garages.length
        )
      : 0;

  return (
    <div className="gestion-garages">
      <Header />

      <main className="gestion-garages-main">
        <section className="gestion-garages-top">
          <button className="boton-back" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <p>PANEL DE CONTROL</p>
            <h1>Configuracion de Garages</h1>
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

            <h2>{loading ? "--" : garages.length}</h2>

            <p>Registradas en la base de datos</p>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <h4>Ocupacion media</h4>
              <span className="stats-icon">
                <BarChart3 size={24} />
              </span>
            </div>

            <h2>{loading ? "--" : `${ocupacionMedia}%`}</h2>

            <p>Calculada sobre la capacidad total</p>
          </div>
        </section>

        <section className="gestion-garages-container">
          <div className="garages-section-heading">
            <h2 className="titulo-garages">Gestion de Garages</h2>
            <p className="subtitulo-garages">
              Administra las zonas disponibles, revisa su estado y actualiza su
              capacidad en tiempo real.
            </p>
          </div>

          {loading && <p className="garages-feedback">Cargando garages...</p>}

          {error && (
            <p className="garages-feedback garages-feedback-error">{error}</p>
          )}

          {!loading && !error && garages.length === 0 && (
            <p className="garages-feedback">Todavia no hay garages cargados.</p>
          )}

          {!loading && !error && garages.length > 0 && (
            <div className="contenedor-tarjetas">
              {garages.map((garage, index) => (
                <TarjetaGarage
                  key={obtenerIdGarage(garage, index)}
                  titulo={garage.nombre || "Garage sin nombre"}
                  plazas={Number(garage.capacidad || 0)}
                  estado={obtenerEstadoGarage(garage.estado)}
                  capacidad={obtenerCapacidadPorcentaje(garage)}
                  ultimoReporte={garage.piso ? `Nivel ${garage.piso}` : "Sin nivel"}
                  imagen={imagenesGarage[index % imagenesGarage.length]}
                  onClick={() => navigate("/editar_zona", { state: { garage } })}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <FooterAdmin />
    </div>
  );
}

export default GestionGarages;
