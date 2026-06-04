import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck } from "lucide-react";
import "./agregar_empresa.css";
import HeaderSuperadmin from "../componentesSuperadmin/header_superadmin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { EmpresasCreate } from "../servicies/API_Empresa";

function AgregarEmpresa() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    setError("");

    if (!nombre.trim()) {
      setError("El nombre de la empresa es requerido.");
      return;
    }
    if (nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    setLoading(true);

    const response = await EmpresasCreate({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });

    if (response.respuesta) {
      navigate("/superadmin/gestion_empresas", { replace: true });
    } else {
      setLoading(false);
      setError(response.datos?.message || "Error al crear la empresa.");
    }
  };

  return (
    <div className="agregar-empresa-page">
      <HeaderSuperadmin />
      <main className="agregar-empresa-main">
        <div className="agregar-empresa-top">
          <button className="boton-back" onClick={() => navigate("/superadmin/gestion_empresas")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p>SUPERADMIN</p>
            <h1>Agregar Empresa</h1>
          </div>
        </div>

        <section className="agregar-empresa-form">
          <div className="input-group-superadmin">
            <label>Nombre de la empresa</label>
            <input
              type="text"
              placeholder="Ej: SmartLot Corp"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="input-group-superadmin">
            <label>Descripción</label>
            <textarea
              placeholder="Descripción de la empresa (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
            />
          </div>

          {error && <p className="form-error-superadmin">{error}</p>}

          <div className="agregar-empresa-actions">
            <BotonGenerico
              className="btn-guardar-grande"
              onClick={handleGuardar}
              disabled={loading}
            >
              <CircleCheck size={20} color="white" />
              <span>{loading ? "Guardando..." : "Guardar empresa"}</span>
            </BotonGenerico>

            <BotonGenerico
              style={{ backgroundColor: "grey" }}
              className="btn-cancelar-grande"
              onClick={() => navigate("/superadmin/gestion_empresas", { replace: true })}
            >
              <span>Cancelar</span>
            </BotonGenerico>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AgregarEmpresa;
