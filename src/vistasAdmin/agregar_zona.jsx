import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import "./agregar_zona.css";
import Header from "../componentesAdmin/header_admin";
import { CirclePlus, ArrowLeft } from "lucide-react";
import FormularioZona from "../componentesAdmin/formulario_zona";
import FormularioCapacidad from "../componentesAdmin/formulario_capacidad";
import BotonGenerico from "../componentesAdmin/boton_generico";
import { GaragesCreate } from "../servicies/API_Garage";
import { SedesGetAll } from "../servicies/API_Sede";

function AgregarZona() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: "",
    piso: "",
    ubicacion: "",
    hora_apertura: "",
    hora_cierre: "",
    capacidad_reservas: "",
    capacidad_para_no_reservas: "",
    id_sede: usuario?.id_sede ?? "",
    dias: []
  });
  const [sedes, setSedes] = useState([]);
  const [sedesLoading, setSedesLoading] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarSedes = async () => {
      setSedesLoading(true);
      const response = await SedesGetAll();

      if (response.respuesta && Array.isArray(response.datos) && response.datos.length > 0) {
        const sedesFiltradas = usuario?.id_sede
          ? response.datos.filter((s) => Number(s.id) === Number(usuario?.id_sede))
          : response.datos.filter((s) => Number(s.id_empresa) === Number(usuario?.id_empresa));
        setSedes(sedesFiltradas);
        if (usuario?.id_sede) {
          setFormData((prev) => ({
            ...prev,
            id_sede: String(usuario.id_sede)
          }));
        } else if (sedesFiltradas.length > 0) {
          setFormData((prev) => ({
            ...prev,
            id_sede: prev.id_sede || String(sedesFiltradas[0].id)
          }));
        }
      } else {
        setError("❌ No se encontraron sedes. Crea una sede antes de agregar un garage.");
      }

      setSedesLoading(false);
    };

    cargarSedes();
  }, [usuario]);

  const handleChange = (field, value) => {
    if (typeof field === "object" && field !== null) {
      setFormData(field);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const esHoraValida = (hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(hora || ""));

  const handleCrearZona = async () => {
    setError("");

    if (sedesLoading) {
      setError("❌ Cargando sedes, espera un momento para continuar.");
      return;
    }

    if (!formData.id_sede || formData.id_sede.toString().trim() === "") {
      setError("❌ La sede es requerida.");
      return;
    }

    const sedeId = Number(formData.id_sede);
    if (isNaN(sedeId) || sedeId <= 0) {
      setError("❌ La sede seleccionada no es válida.");
      return;
    }

    if (!sedes.some((sede) => Number(sede.id) === sedeId)) {
      setError("❌ La sede seleccionada no es válida.");
      return;
    }

    // Validaciones
    if (!formData.nombre || !formData.nombre.trim()) {
      setError("❌ El nombre del garage es requerido.");
      return;
    }
    if (formData.nombre.trim().length < 3) {
      setError("❌ El nombre del garage debe tener al menos 3 caracteres.");
      return;
    }

    if (formData.piso === undefined || formData.piso === null || formData.piso.toString().trim() === "") {
      setError("❌ El nivel/planta es requerido.");
      return;
    }
    const pisoNum = Number(formData.piso);
    if (isNaN(pisoNum) || !Number.isInteger(pisoNum)) {
      setError("❌ El nivel/planta debe ser un número entero válido.");
      return;
    }

    if (!formData.ubicacion || !formData.ubicacion.trim()) {
      setError("❌ La ubicación es requerida.");
      return;
    }
    if (formData.ubicacion.trim().length < 5) {
      setError("❌ La ubicación debe tener al menos 5 caracteres.");
      return;
    }

    if (!esHoraValida(formData.hora_apertura)) {
      setError("La hora de apertura es requerida.");
      return;
    }

    if (!esHoraValida(formData.hora_cierre)) {
      setError("La hora de cierre es requerida.");
      return;
    }

    if (formData.hora_apertura >= formData.hora_cierre) {
      setError("La hora de apertura debe ser anterior a la hora de cierre.");
      return;
    }

    if (formData.capacidad_reservas === undefined || formData.capacidad_reservas === null || formData.capacidad_reservas.toString().trim() === "") {
      setError("❌ La capacidad de reservas es requerida.");
      return;
    }
    const capRes = Number(formData.capacidad_reservas);
    if (isNaN(capRes) || capRes < 0 || !Number.isInteger(capRes)) {
      setError("❌ La capacidad de reservas debe ser un número entero mayor o igual a 0.");
      return;
    }

    if (formData.capacidad_para_no_reservas === undefined || formData.capacidad_para_no_reservas === null || formData.capacidad_para_no_reservas.toString().trim() === "") {
      setError("❌ La capacidad para no reservas es requerida.");
      return;
    }
    const capNoRes = Number(formData.capacidad_para_no_reservas);
    if (isNaN(capNoRes) || capNoRes < 0 || !Number.isInteger(capNoRes)) {
      setError("❌ La capacidad para no reservas debe ser un número entero mayor o igual a 0.");
      return;
    }

    const cap = capRes + capNoRes;
    if (cap <= 0) {
      setError("❌ La capacidad total debe ser mayor a 0.");
      return;
    }

    if (!formData.dias || formData.dias.length === 0) {
      setError("❌ Debes seleccionar al menos un día operativo para el garage.");
      return;
    }

    setLoading(true);

    const garage = {
      id_sede: sedeId,
      nombre: formData.nombre.trim(),
      piso: String(formData.piso).trim(),
      ubicacion: formData.ubicacion.trim(),
      hora_apertura: formData.hora_apertura,
      hora_cierre: formData.hora_cierre,
      estado: true, // Siempre activo al crear, ya no se maneja desde el formulario
      capacidad: cap,
      capacidad_para_no_reservas: capNoRes,
      capacidad_reservas: capRes,
      ocupacion_reservas: 0,
      ocupacion_no_reservas: 0,
      dias: formData.dias
    };

    const response = await GaragesCreate(garage);
    setLoading(false);

    if (response.respuesta) {
      navigate("/gestion_garages", { replace: true });
    } else {
      const errorMsg = response.datos?.message || response.datos || 'Error desconocido al conectar con la BD.';
      setError(`❌ Error al crear la zona: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    }
  };

  return (
    <div className="agregar-zona">
      <Header />

      <div className="contenido-agregar-zona">
        <div className="top-garage">
          <button className="boton-back" onClick={() => navigate("/gestion_garages", { replace: true })}>
            <ArrowLeft size={24} />
          </button>

          <div className="info-top">
            <p>NUEVA ZONA</p>
            <h1>Nuevo Garage</h1>
            <span>Configura los detalles de la nueva zona de estacionamiento.</span>
          </div>
        </div>

        <div className="form-garage">
          <FormularioZona
            formData={formData}
            onChange={handleChange}
            sedes={sedes}
          />

          <FormularioCapacidad
            formData={formData}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error" style={{ color: '#d32f2f', padding: '12px', marginBottom: '16px', backgroundColor: '#ffebee', borderRadius: '4px', fontWeight: 'bold' }}>{error}</p>}

        <div className="acciones-garage">
          <BotonGenerico
            className="btn-guardar-grande"
            onClick={handleCrearZona}
            disabled={loading || sedesLoading || sedes.length === 0}
          >
            <CirclePlus size={22} />
            <span>{loading ? "Creando..." : "Crear Garage"}</span>
          </BotonGenerico>

          <BotonGenerico
            className="btn-cancelar-grande"
            onClick={() => navigate("/gestion_garages", { replace: true })}
          >
            <span>Cancelar</span>
          </BotonGenerico>
        </div>
      </div>
    </div>
  );
}

export default AgregarZona;
