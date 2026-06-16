import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck } from "lucide-react";
import "./agregar_sede.css";
import HeaderSuperadmin from "../componentesSuperadmin/header_superadmin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { SedesCreate } from "../servicies/API_Sede";
import { EmpresasGetAll } from "../servicies/API_Empresa";

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  return [];
};

const AgregarSedeSkeleton = () => (
  <section className="agregar-sede-form agregar-sede-form-skeleton" aria-label="Cargando formulario">
    {Array.from({ length: 4 }).map((_, index) => (
      <div className="input-skeleton-superadmin" key={index}>
        <span className="skeleton-line skeleton-form-label" />
        <span className={`skeleton-line ${index === 2 ? "skeleton-form-textarea" : "skeleton-form-control"}`} />
      </div>
    ))}
    <div className="agregar-sede-actions">
      <span className="skeleton-line skeleton-form-button" />
      <span className="skeleton-line skeleton-form-button secondary" />
    </div>
  </section>
);

function AgregarSede() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [idEmpresa, setIdEmpresa] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchEmpresas = async () => {
      setLoadingEmpresas(true);
      try {
        const res = await EmpresasGetAll();
        if (!mounted) return;
        if (res.respuesta) {
          setEmpresas(obtenerListado(res.datos));
        }
      } finally {
        if (mounted) setLoadingEmpresas(false);
      }
    };
    fetchEmpresas();
    return () => { mounted = false; };
  }, []);

  const handleGuardar = async () => {
    setError("");

    if (!idEmpresa) {
      setError("Debes seleccionar una empresa.");
      return;
    }
    if (!nombre.trim()) {
      setError("El nombre de la sede es requerido.");
      return;
    }
    if (nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    setLoading(true);

    const response = await SedesCreate({
      id_empresa: Number(idEmpresa),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
    });

    if (response.respuesta) {
      navigate("/superadmin/gestion_sedes", { replace: true });
    } else {
      setLoading(false);
      setError(response.datos?.message || "Error al crear la sede.");
    }
  };

  return (
    <div className="agregar-sede-page">
      <HeaderSuperadmin />
      <main className="agregar-sede-main">
        <div className="agregar-sede-top">
          <button className="boton-back" onClick={() => navigate("/superadmin/gestion_sedes")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p>SUPERADMIN</p>
            <h1>Agregar Sede</h1>
          </div>
        </div>

        {loadingEmpresas ? (
          <AgregarSedeSkeleton />
        ) : (
        <section className="agregar-sede-form">
          <div className="input-group-superadmin">
            <label>Empresa</label>
            <select value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)} autoComplete="off">
              <option value="">Seleccionar empresa...</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-superadmin">
            <label>Nombre de la sede</label>
            <input
              type="text"
              placeholder="Ej: Sede Central"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="input-group-superadmin">
            <label>Descripción</label>
            <textarea
              placeholder="Descripción de la sede (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              autoComplete="off"
            />
          </div>

          <div className="input-group-superadmin">
            <label>Ubicación</label>
            <input
              type="text"
              placeholder="Ej: Av. Corrientes 1234, CABA"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              autoComplete="off"
            />
          </div>

          {error && <p className="form-error-superadmin">{error}</p>}

          <div className="agregar-sede-actions">
            <BotonGenerico
              className="btn-guardar-grande"
              onClick={handleGuardar}
              disabled={loading}
            >
              <CircleCheck size={20} color="white" />
              <span>{loading ? "Guardando..." : "Guardar sede"}</span>
            </BotonGenerico>

            <BotonGenerico
              style={{ backgroundColor: "grey" }}
              className="btn-cancelar-grande"
              onClick={() => navigate("/superadmin/gestion_sedes", { replace: true })}
            >
              <span>Cancelar</span>
            </BotonGenerico>
          </div>
        </section>
        )}
      </main>
    </div>
  );
}

export default AgregarSede;
