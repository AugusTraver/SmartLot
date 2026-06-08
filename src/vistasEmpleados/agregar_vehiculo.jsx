import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { Z_INDEX } from "../helpers/zIndex";
import Header from "../componentesEmpleado/header_empleado";
import Footer from "../componentesEmpleado/footer_empleado";
import { useAuth } from "../contexts/useAuth";
import { VehiculosCreate } from "../servicies/API_Vehiculo";
import { ModelosGetAll } from "../servicies/API_Modelo";
import "../componentesEmpleado/formulario_PerfilPersonal.css";
import "../componentesEmpleado/formulario_vehiculo.css";

export default function AgregarVehiculo() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [modelo, setModelo] = useState("");
  const [idModelo, setIdModelo] = useState("");
  const [patente, setPatente] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [modelosGlobales, setModelosGlobales] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    async function cargarCatalogo() {
      try {
        if (typeof ModelosGetAll === "function") {
          const resultadoAPI = await ModelosGetAll();
          const arrayModelos = resultadoAPI?.datos || [];
          if (Array.isArray(arrayModelos)) {
            setModelosGlobales(arrayModelos);
          } else if (arrayModelos && typeof arrayModelos === "object") {
            const fallback = arrayModelos.data || Object.values(arrayModelos);
            setModelosGlobales(Array.isArray(fallback) ? fallback : []);
          }
        }
      } catch (error) {
        console.error("Error cargando modelos:", error);
        setModelosGlobales([]);
      }
    }
    cargarCatalogo();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setMostrarSugerencias(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const obtenerIdUsuario = (usr) => usr?.id ?? usr?.id_usuario ?? usr?._id;

  const handleFiltradoModelo = (e) => {
    const valor = e.target.value;
    setModelo(valor);
    setIdModelo("");

    if (valor.trim().length > 0 && modelosGlobales.length > 0) {
      const filtrados = modelosGlobales.filter((item) => {
        if (!item) return false;
        const nombreFinal = item.nombre || item.nombre_modelo || item.modelo || String(item);
        return nombreFinal.toLowerCase().includes(valor.toLowerCase());
      });
      setSugerencias(filtrados);
      setMostrarSugerencias(true);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  };

  const handleSeleccionarItem = (item) => {
    if (!item) return;
    const textoFinal = item.nombre || item.nombre_modelo || item.modelo || String(item);
    setModelo(textoFinal);
    setIdModelo(item.id);
    setMostrarSugerencias(false);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (guardando) return;

    const modeloTrim = modelo?.trim();
    const patenteTrim = patente?.trim();
    if (!modeloTrim || !patenteTrim || !idModelo) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes seleccionar un modelo del catálogo y completar la patente.",
        confirmButtonColor: "#3b82f6",
        zIndex: Z_INDEX.SWAL_DIALOG,
      });
      return;
    }

    const subUsuario = usuario?.datos || usuario?.usuario || {};
    const idUsuarioFinal = obtenerIdUsuario(usuario) || subUsuario.id_usuario || subUsuario.id;
    if (!idUsuarioFinal) {
      Swal.fire({
        icon: "error",
        title: "Error de sesión",
        text: "No se pudo detectar el ID del usuario.",
        confirmButtonColor: "#3b82f6",
        zIndex: Z_INDEX.SWAL_DIALOG,
      });
      return;
    }

    try {
      setGuardando(true);
      const response = await VehiculosCreate({
        id_usuario: Number(idUsuarioFinal),
        id_modelo: Number(idModelo),
        patente: patenteTrim.toUpperCase(),
      });
      if (response.respuesta) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Vehículo añadido correctamente",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          zIndex: Z_INDEX.SWAL_DIALOG,
        });
        navigate("/perfil_empleado");
      } else {
        throw new Error("Error al crear el vehículo");
      }
    } catch (error) {
      console.error("Error al añadir vehículo:", error);
      Swal.fire({
        icon: "error",
        title: "Error al añadir vehículo",
        text: error.message || error.response?.data?.message || "Ocurrió un problema con el servidor.",
        confirmButtonColor: "#3b82f6",
        zIndex: Z_INDEX.SWAL_DIALOG,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="Perfil-contenedor">
      <Header />
      <div className="perfilUsuario-Contenedor">
        <main className="perfilUsuario-contenido">
          <div className="top-navigation-bar">
            <button
              className="boton-back"
              onClick={() => navigate("/perfil_empleado")}
              aria-label="Volver"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
            <header className="textosTitulosPerfil">
              <h1>Añadir Vehículo</h1>
            </header>
          </div>

          <form onSubmit={handleGuardar} className="perfil-form-wrapper">
            <section className="vehiculo-card-seccion formulario-seccion animate-section">
              <div className="form-card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div className="icon-badge-box" style={{ width: "36px", height: "36px", background: "rgb(239, 246, 255)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Car size={20} style={{ color: "rgb(59, 130, 246)" }} />
                </div>
                <h3 className="formulario-subtitulo" style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>
                  Nuevo Vehículo
                </h3>
              </div>

              <div className="formulario-grid-vehiculo">
                <div className="vehiculo-input-grupo" ref={autocompleteRef} style={{ position: "relative" }}>
                  <label htmlFor="nuevo-modelo">Modelo del Vehículo</label>
                  <input
                    type="text"
                    id="nuevo-modelo"
                    className="formulario-input"
                    value={modelo}
                    onChange={handleFiltradoModelo}
                    onFocus={() => modelo && setMostrarSugerencias(true)}
                    placeholder="Ej. Toyota Corolla"
                    autoComplete="off"
                    required
                  />
                  {mostrarSugerencias && sugerencias.length > 0 && (
                    <ul className="autocomplete-suggestions-panel">
                      {sugerencias.map((item, index) => {
                        if (!item) return null;
                        const textoVisual = item.nombre || item.nombre_modelo || item.modelo || String(item);
                        return (
                          <li
                            key={item.id || index}
                            className="autocomplete-item"
                            onClick={() => handleSeleccionarItem(item)}
                          >
                            {textoVisual}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="vehiculo-input-grupo">
                  <label htmlFor="nuevo-patente">Matrícula / Patente</label>
                  <input
                    type="text"
                    id="nuevo-patente"
                    className="formulario-input"
                    value={patente}
                    onChange={(e) => setPatente(e.target.value)}
                    placeholder="Ej. AA123BB"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-add-vehicle"
                disabled={guardando}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  height: "44px",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  backgroundColor: guardando ? "#f1f5f9" : "transparent",
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: guardando ? "not-allowed" : "pointer",
                  transition: "border-color 0.2s, background-color 0.2s",
                  marginTop: "0.75rem",
                }}
              >
                <Plus size={18} />
                <span>{guardando ? "Guardando..." : "Añadir Vehículo"}</span>
              </button>
            </section>

            <button
              type="button"
              className="btn-secondary-action"
              onClick={() => navigate("/perfil_empleado")}
              style={{ color: "#64748b", backgroundColor: "#f1f5f9" }}
            >
              Cancelar
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
