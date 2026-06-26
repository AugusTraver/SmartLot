import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck } from "lucide-react";
import "./agregar_empresa.css";
import HeaderSuperadmin from "../componentesSuperadmin/header_superadmin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { EmpresasCreate } from "../servicies/API_Empresa";
import useLiveValidation from "../hooks/useLiveValidation";
import FieldValidation from "../components/FieldValidation";

const validationSchema = {
  nombre: [
    { rule: (v) => v?.trim().length > 0, message: "Requerido" },
    { rule: (v) => v?.trim().length >= 2, message: "Minimo 2 caracteres" },
  ],
};

function AgregarEmpresa() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isValid, touched, getFieldProps } = useLiveValidation(formData, validationSchema);
  const field = (name) => getFieldProps(name, setFormData);

  const buildConditions = (fieldName) => {
    if (!validationSchema[fieldName]) return [];
    const value = formData[fieldName];
    return validationSchema[fieldName].map((item) => {
      const ruleFn = item.rule;
      const message = item.message;
      return { label: message, met: ruleFn(value) };
    });
  };

  const handleGuardar = async () => {
    setError("");

    if (!isValid) return;

    setLoading(true);

    const response = await EmpresasCreate({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
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
              {...field("nombre")}
              autoComplete="off"
              required
            />
            <FieldValidation conditions={buildConditions("nombre")} isTouched={touched.nombre} />
          </div>

          <div className="input-group-superadmin">
            <label>Descripción</label>
            <textarea
              placeholder="Descripción de la empresa (opcional)"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              rows={4}
              autoComplete="off"
              required
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
