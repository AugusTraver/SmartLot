import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck } from "lucide-react";

import "./agregar_usuario.css";
import HeaderSuperadmin from "../componentesSuperadmin/header_superadmin";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { UsuariosCreate } from "../servicies/API_Usuario";
import { EmpresasGetAll } from "../servicies/API_Empresa";
import { SedesGetAll } from "../servicies/API_Sede";
import { GaragesGetAll } from "../servicies/API_Garage";

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  return [];
};

const ROLE_OPTIONS = [
  { id: 1, label: "Admin" },
  { id: 4, label: "Superadmin" },
  { id: 2, label: "Empleado" },
  { id: 3, label: "Garagista" },
];

const ROLES_NEED_EMPRESA = [1, 2, 3];
const ROLES_NEED_SEDE = [1, 2, 3];
const ROLES_NEED_GARAGE = [3];

function AgregarUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contraseña: "",
    id_rol: "",
    id_empresa: "",
    id_sede: "",
    id_garage: "",
  });

  const [empresas, setEmpresas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [garages, setGarages] = useState([]);
  const [sedesFiltradas, setSedesFiltradas] = useState([]);
  const [garagesFiltrados, setGaragesFiltrados] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const idRol = Number(formData.id_rol);

  useEffect(() => {
    const fetchData = async () => {
      const [empRes, sedRes, garRes] = await Promise.all([
        EmpresasGetAll(),
        SedesGetAll(),
        GaragesGetAll(),
      ]);
      if (empRes.respuesta) setEmpresas(obtenerListado(empRes.datos));
      if (sedRes.respuesta) setSedes(obtenerListado(sedRes.datos));
      if (garRes.respuesta) setGarages(obtenerListado(garRes.datos));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.id_empresa) {
      setSedesFiltradas(
        sedes.filter((s) => Number(s.id_empresa) === Number(formData.id_empresa))
      );
      setFormData((prev) => ({ ...prev, id_sede: "", id_garage: "" }));
    } else {
      setSedesFiltradas([]);
      setFormData((prev) => ({ ...prev, id_sede: "", id_garage: "" }));
    }
  }, [formData.id_empresa]);

  useEffect(() => {
    if (formData.id_sede) {
      setGaragesFiltrados(
        garages.filter((g) => Number(g.id_sede) === Number(formData.id_sede))
      );
      setFormData((prev) => ({ ...prev, id_garage: "" }));
    } else {
      setGaragesFiltrados([]);
      setFormData((prev) => ({ ...prev, id_garage: "" }));
    }
  }, [formData.id_sede]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

  const handleGuardar = async () => {
    setError("");

    if (!formData.nombre.trim()) { setError("El nombre es requerido."); return; }
    if (formData.nombre.trim().length < 2) { setError("El nombre debe tener al menos 2 caracteres."); return; }
    if (!nombreRegex.test(formData.nombre.trim())) { setError("El nombre solo debe contener letras."); return; }

    if (!formData.apellido.trim()) { setError("El apellido es requerido."); return; }
    if (formData.apellido.trim().length < 2) { setError("El apellido debe tener al menos 2 caracteres."); return; }
    if (!nombreRegex.test(formData.apellido.trim())) { setError("El apellido solo debe contener letras."); return; }

    if (!formData.email.trim()) { setError("El email es requerido."); return; }
    if (!validateEmail(formData.email.trim())) { setError("El email no tiene un formato válido."); return; }

    if (!formData.contraseña) { setError("La contraseña es requerida."); return; }
    if (formData.contraseña.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }

    if (!idRol) { setError("Debes seleccionar un rol."); return; }

    if (ROLES_NEED_EMPRESA.includes(idRol) && !formData.id_empresa) {
      setError("Debes seleccionar una empresa para este rol.");
      return;
    }

    if (ROLES_NEED_GARAGE.includes(idRol) && !formData.id_garage) {
      setError("Debes seleccionar un garage para este rol.");
      return;
    }

    setLoading(true);

    const payload = {
      id_rol: idRol,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      contraseña: formData.contraseña,
      id_empresa: ROLES_NEED_EMPRESA.includes(idRol) ? Number(formData.id_empresa) : null,
      id_sede: ROLES_NEED_SEDE.includes(idRol) ? Number(formData.id_sede) || null : null,
      id_garage: ROLES_NEED_GARAGE.includes(idRol) ? Number(formData.id_garage) || null : null,
    };

    const response = await UsuariosCreate(payload);

    if (response.respuesta) {
      navigate("/superadmin/gestion_usuarios", { replace: true });
    } else {
      setLoading(false);
      setError(response.datos?.message || "Error al crear el usuario.");
    }
  };

  const needsEmpresa = ROLES_NEED_EMPRESA.includes(idRol);
  const needsSede = ROLES_NEED_SEDE.includes(idRol);
  const needsGarage = ROLES_NEED_GARAGE.includes(idRol);

  return (
    <div className="agregar-usuario-page">
      <HeaderSuperadmin />
      <main className="agregar-usuario-main">
        <div className="agregar-usuario-top">
          <button className="boton-back" onClick={() => navigate("/superadmin/gestion_usuarios")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <p>SUPERADMIN</p>
            <h1>Agregar Usuario</h1>
          </div>
        </div>

        <section className="agregar-usuario-form">
          <div className="agregar-usuario-grid">
            <div className="input-group-superadmin">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </div>

            <div className="input-group-superadmin">
              <label>Apellido</label>
              <input
                type="text"
                placeholder="Ej: Pérez"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
              />
            </div>

            <div className="input-group-superadmin">
              <label>Email</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="input-group-superadmin">
              <label>Teléfono</label>
              <input
                type="tel"
                placeholder="+54 11 1234-5678"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            <div className="input-group-superadmin">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.contraseña}
                onChange={(e) => handleChange("contraseña", e.target.value)}
              />
            </div>

            <div className="input-group-superadmin">
              <label>Rol</label>
              <select
                value={formData.id_rol}
                onChange={(e) => handleChange("id_rol", e.target.value)}
              >
                <option value="">Seleccionar rol...</option>
                {ROLE_OPTIONS.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.label}
                  </option>
                ))}
              </select>
            </div>

            {needsEmpresa && (
              <div className="input-group-superadmin">
                <label>Empresa</label>
                <select
                  value={formData.id_empresa}
                  onChange={(e) => handleChange("id_empresa", e.target.value)}
                >
                  <option value="">Seleccionar empresa...</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {needsSede && (
              <div className="input-group-superadmin">
                <label>Sede</label>
                <select
                  value={formData.id_sede}
                  onChange={(e) => handleChange("id_sede", e.target.value)}
                  disabled={!formData.id_empresa}
                >
                  <option value="">
                    {formData.id_empresa ? "Seleccionar sede..." : "Primero elige una empresa"}
                  </option>
                  {sedesFiltradas.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {needsGarage && (
              <div className="input-group-superadmin">
                <label>Garage</label>
                <select
                  value={formData.id_garage}
                  onChange={(e) => handleChange("id_garage", e.target.value)}
                  disabled={!formData.id_sede}
                >
                  <option value="">
                    {formData.id_sede ? "Seleccionar garage..." : "Primero elige una sede"}
                  </option>
                  {garagesFiltrados.map((gar) => (
                    <option key={gar.id_garage || gar.id} value={gar.id_garage || gar.id}>
                      {gar.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {error && <p className="form-error-superadmin">{error}</p>}

          <div className="agregar-usuario-actions">
            <BotonGenerico
              className="btn-guardar-grande"
              onClick={handleGuardar}
              disabled={loading}
            >
              <CircleCheck size={20} color="white" />
              <span>{loading ? "Guardando..." : "Guardar usuario"}</span>
            </BotonGenerico>

            <BotonGenerico
              style={{ backgroundColor: "grey" }}
              className="btn-cancelar-grande"
              onClick={() => navigate("/superadmin/gestion_usuarios", { replace: true })}
            >
              <span>Cancelar</span>
            </BotonGenerico>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AgregarUsuario;
