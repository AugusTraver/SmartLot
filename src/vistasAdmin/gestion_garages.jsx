import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { ArrowLeft, CirclePlus, MapPinned, BarChart3 } from "lucide-react";
import "./gestion_garages.css";
import TarjetaGarage from "../componentesAdmin/tarjeta_garages";
import Header from "../componentesAdmin/header_admin";
import FooterAdmin from "../componentesAdmin/footer_admin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { GaragesGetAll } from "../servicies/API_Garage";
import { SedesGetAll } from "../servicies/API_Sede";
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

const GarageSkeletonGrid = () => (    // Muestra 6 tarjetas esqueléticas para simular la carga de garages
  <div className="contenedor-tarjetas" aria-label="Cargando garages">
    {Array.from({ length: 6 }).map((_, index) => (   //se encarga de generar un array con 6 tarjetas fantasmas y a su vez estas estan vacias 
      <article className="tarjeta-garage-skeleton" key={index}> {/*al poner el article lo que estoy haciendo es simular que se crea una card de garage */}
        <div className="skeleton-media">
          <span className="skeleton-pill" />
        </div>

        <div className="skeleton-content">
          <div className="skeleton-header">
            <span className="skeleton-line skeleton-title" />
            <span className="skeleton-button" />
          </div>

          <div className="skeleton-meta">
            <span className="skeleton-line skeleton-meta-item" />
            <span className="skeleton-line skeleton-meta-item skeleton-meta-short" />
          </div>

          <div className="skeleton-capacity">
            <div className="skeleton-capacity-label">
              <span className="skeleton-line skeleton-label" />
              <span className="skeleton-line skeleton-percent" />
            </div>

            <span className="skeleton-bar" />
          </div>
        </div>
      </article>
    ))}
  </div>
);

const GarageStatsSkeleton = () => ( // Muestra 2 tarjetas esqueléticas para simular la carga de estadísticas de garages
  <section className="stats-container" aria-label="Cargando resumen de garages">
    {Array.from({ length: 2 }).map((_, index) => (
      <div className="stats-card stats-card-skeleton" key={index}>
        <div className="stats-header">
          <span className="skeleton-line skeleton-stat-label" />
          <span className="skeleton-stat-icon" />
        </div>

        <span className="skeleton-line skeleton-stat-value" />
        <span className="skeleton-line skeleton-stat-description" />
      </div>
    ))}
  </section>
);

const GarageActionSkeleton = () => (
  <section className="garages-actions" aria-label="Cargando acciones de garages">
    <span className="btn-nueva-zona-skeleton" />
  </section>
);

function GestionGarages() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [garages, setGarages] = useState([]); // Estado para almacenar la lista de garages
  const [loading, setLoading] = useState(true); // Estado para controlar la carga de datos
  const [error, setError] = useState("");

  useEffect(() => {
    let estaMontado = true; 

    const cargarGarages = async () => {
      setLoading(true); // Inicia la carga de datos
      setError("");

      const [garagesRes, sedesRes] = await Promise.all([
        GaragesGetAll(),
        SedesGetAll(),
      ]);

      if (!estaMontado) return;

      if (garagesRes.respuesta) {
        const todosLosGarages = obtenerListadoGarages(garagesRes.datos);

        let garagesDeSede;
        if (usuario?.id_sede) {
          garagesDeSede = todosLosGarages.filter((g) => {
            const idSede = g.id_sede ?? g.idSede;
            return Number(idSede) === Number(usuario?.id_sede);
          });
        } else {
          const sedesEmpresa = Array.isArray(sedesRes.datos)
            ? sedesRes.datos
            : Array.isArray(sedesRes.datos?.datos) ? sedesRes.datos.datos : [];
          const sedesIdsEmpresa = new Set(
            sedesEmpresa
              .filter((s) => Number(s.id_empresa) === Number(usuario?.id_empresa))
              .map((s) => Number(s.id))
          );
          garagesDeSede = todosLosGarages.filter((g) => {
            const idSede = g.id_sede ?? g.idSede;
            return sedesIdsEmpresa.has(Number(idSede));
          });
        }
        setGarages(garagesDeSede);
      } else {
        setError("No se pudieron cargar los garages.");
      }

      setLoading(false); // Finaliza la carga de datos
    };

    cargarGarages(); // Llama a la función para cargar los garages al montar el componente

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
           // Calcula la ocupación media de los garages, sumando el porcentaje de ocupación de cada garage y dividiéndolo por el número total de garages. Si no hay garages, devuelve 0.
  return (
    <div className="gestion-garages">
      <Header />

      <main className="gestion-garages-main">
        <section className="gestion-garages-top">
          <button className="boton-back" onClick={() => navigate("/admin_dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <div>
            <p>CONTROL DE GARAGES</p>
            <h1>Configuracion de Garages</h1>
          </div>
        </section>

        {loading ? (
          <GarageActionSkeleton />
        ) : (
          <section className="garages-actions">
            <BotonGenerico
              className="btn-nueva-zona"
              onClick={() => navigate("/agregar_zona")}
            >
              <CirclePlus size={20} />
              <span>Nuevo Garage</span>
            </BotonGenerico>
          </section>
        )}

        {loading ? (
          <GarageStatsSkeleton />
        ) : (
          <section className="stats-container">
            <div className="stats-card">
              <div className="stats-header">
                <h4>Total zonas</h4>
                <span className="stats-icon">
                  <MapPinned size={24} />
                </span>
              </div>

              <h2>{garages.length}</h2>

              <p>Registradas en la base de datos</p>
            </div>

            <div className="stats-card">
              <div className="stats-header">
                <h4>Ocupacion media</h4>
                <span className="stats-icon">
                  <BarChart3 size={24} />
                </span>
              </div>

              <h2>{`${ocupacionMedia}%`}</h2>

              <p>Calculada sobre la capacidad total</p>
            </div>
          </section>
        )}

        <section className="gestion-garages-container">
          <div className="garages-section-heading">
            <h2 className="titulo-garages">Gestion de Garages</h2>
            <p className="subtitulo-garages">
              Administra las zonas disponibles, revisa su estado y actualiza su
              capacidad en tiempo real.
            </p>
          </div>

          {loading && <GarageSkeletonGrid />}

          {error && (
            <p className="garages-feedback garages-feedback-error">{error}</p>
          )}

          {!loading && !error && garages.length === 0 && (
            <p className="garages-feedback">Todavia no hay garages cargados.</p>
          )}

          {!loading && !error && garages.length > 0 && (
            <div className="contenedor-tarjetas">
              {garages.map((garage, index) => (
                <TarjetaGarage  // le manda al componete de tarjeta garage la informacion de cada garage para que este se encargue de mostrarla
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
