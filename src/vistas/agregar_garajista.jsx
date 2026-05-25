import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormularioInfoPersonal from "../componentes/formulario_infoPersonal";
import Header from "../componentes/header_admin";
import "./agregar_empleado.css"
import { CircleCheck } from 'lucide-react';
import BotonGenerico from "../componentes/boton_generico";
import { UsuariosCreate } from "../servicies/API_Usuario";

function AgregarGarajista() {
  const navigate = useNavigate();
  const location = useLocation();
  const garage = location.state?.garage;
  const garageId = Number(location.state?.id_garage ?? location.state?.garage?.id_garage ?? location.state?.garage?.id ?? location.state?.garage?.idGarage) || null;

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardarGarajista = async () => {
    setError('');

    if (!formData.nombre || !formData.nombre.trim()) {
      setError('❌ El nombre es requerido.');
      return;
    }
    if (formData.nombre.trim().length < 2) {
      setError('❌ El nombre debe tener al menos 2 caracteres.');
      return;
    }
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    if (!nombreRegex.test(formData.nombre.trim())) {
      setError('❌ El nombre solo debe contener letras.');
      return;
    }

    if (!formData.apellido || !formData.apellido.trim()) {
      setError('❌ El apellido es requerido.');
      return;
    }
    if (formData.apellido.trim().length < 2) {
      setError('❌ El apellido debe tener al menos 2 caracteres.');
      return;
    }
    if (!nombreRegex.test(formData.apellido.trim())) {
      setError('❌ El apellido solo debe contener letras.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !formData.email.trim()) {
      setError('❌ El correo electrónico es requerido.');
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      setError('❌ El correo electrónico no tiene un formato válido (ej: usuario@ejemplo.com).');
      return;
    }

    if (!formData.contraseña) {
      setError('❌ La contraseña es requerida.');
      return;
    }
    if (formData.contraseña.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.telefono && formData.telefono.trim()) {
      const telefonoRegex = /^[+]{0,1}[0-9\s-()]+$/;
      if (!telefonoRegex.test(formData.telefono.trim())) {
        setError('❌ El teléfono solo puede contener números, espacios, guiones, paréntesis o el signo +.');
        return;
      }
      if (formData.telefono.trim().replace(/\D/g, '').length < 7) {
        setError('❌ El teléfono debe tener al menos 7 dígitos.');
        return;
      }
    }

    if (!garageId) {
      setError('❌ No se encontró el garage asociado. Vuelve a la zona e inténtalo de nuevo.');
      return;
    }

    setLoading(true);

    const payload = {
      id_rol: 3,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      id_sede: null,
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      contraseña: formData.contraseña,
      id_empresa: 1,
      id_garage: garageId,
    };

    const response = await UsuariosCreate(payload);

    if (!response.respuesta) {
      setLoading(false);
      const serverMsg = response.datos?.message || response.datos || 'Error al crear el garajista.';
      setError(typeof serverMsg === 'string' ? `❌ ${serverMsg}` : '❌ Error al crear el garajista.');
      return;
    }

    setLoading(false);
    if (garage) {
      navigate('/editar_zona', { state: { garage }, replace: true });
    } else {
      navigate('/gestion_garages', { replace: true });
    }
  };

  return (
    <div className="agregar-empleado-page">
      <Header />
      <h3 style={{ color: "#1D4ED8", fontSize: "24px", fontWeight: "600" }}>Agregar Garajista</h3>
      <p>Registro de nuevo garajista para la zona</p>
      <main style={{ padding: "20px", paddingBottom: "50px", marginTop: "-10px" }}>
        <FormularioInfoPersonal
          infoPersonalTitulo="Información Personal"
          labels={{
            nombre: 'Nombre',
            apellido: 'Apellido',
            email: 'Correo electrónico',
            telefono: 'Número de teléfono',
            contraseña: 'Contraseña',
          }}
          formData={formData}
          onChange={handleChange}
          hideSede={true}
        />

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <BotonGenerico
            onClick={handleGuardarGarajista}
            disabled={loading}
            className="btn-guardar-grande"
          >
            <CircleCheck size={20} color="white" />
            <span>{loading ? 'Guardando...' : 'Guardar garajista'}</span>
          </BotonGenerico>

          <BotonGenerico
            style={{ backgroundColor: "grey" }}
            onClick={() => {
              if (garage) {
                navigate('/editar_zona', { state: { garage }, replace: true });
              } else {
                navigate('/gestion_garages', { replace: true });
              }
            }}
            className="btn-cancelar-grande"
          >
            <span>Cancelar</span>
          </BotonGenerico>
        </div>
      </main>
    </div>
  );
}

export default AgregarGarajista;
