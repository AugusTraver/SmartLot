import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./agregar_zona.css";
import Header from "../componentes/header_admin";
import { CirclePlus, ArrowLeft } from "lucide-react";
import FormularioZona from "../componentes/formulario_zona";
import FormularioCapacidad from "../componentes/formulario_capacidad";
import BotonGenerico from "../componentes/boton_generico";
import { GaragesCreate } from "../servicies/API_Garage"; 

function AgregarZona() {
  const navigate = useNavigate();
  
  // Eliminamos 'estado' de aquí, ya no lo maneja el usuario
  const [formData, setFormData] = useState({
    nombre: "",
    piso: "",
    ubicacion: "",
    capacidad: "",
    capacidad_reservas: "",
    capacidad_para_no_reservas: "",
    id_sede: 1
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearZona = async () => {
    setError("");

    // Validaciones
    if (!formData.nombre || !formData.nombre.trim()) {
      setError("❌ El nombre del garage es requerido.");
      return;
    }

    if (!formData.piso || !formData.piso.trim()) {
      setError("❌ El nivel/planta es requerido.");
      return;
    }

    if (!formData.ubicacion || !formData.ubicacion.trim()) {
      setError("❌ La ubicación es requerida.");
      return;
    }

    const cap = Number(formData.capacidad);
    if (!formData.capacidad || isNaN(cap) || cap <= 0) {
      setError("❌ La capacidad total debe ser un número mayor a 0.");
      return;
    }

    const capRes = Number(formData.capacidad_reservas) || 0;
    const capNoRes = Number(formData.capacidad_para_no_reservas) || 0;

    if (capRes + capNoRes > cap) {
      setError(
        `❌ SUMA INVÁLIDA: Reservas (${capRes}) + No Reservas (${capNoRes}) = ${capRes + capNoRes}, pero capacidad total es ${cap}.`
      );
      return;
    }

    setLoading(true);

    const payload = {
      id_sede: Number(formData.id_sede) || 1,
      nombre: formData.nombre.trim(),
      piso: formData.piso.trim(),
      ubicacion: formData.ubicacion.trim(),
      // SOLUCIÓN: Mandamos un booleano (true = activo, false = inactivo)
      estado: true, 
      capacidad: cap,
      capacidad_para_no_reservas: capNoRes,
      capacidad_reservas: capRes,
      ocupacion_reservas: 0,
      ocupacion_no_reservas: 0
    };

    const response = await GaragesCreate(payload);
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
            disabled={loading}
          >
            <CirclePlus size={22} />
            <span>{loading ? "Creando..." : "Crear Zona"}</span>
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