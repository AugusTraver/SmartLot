import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import FormularioInfoPersonal from "../componentesAdmin/formulario_infoPersonal";
import Header from "../componentesAdmin/header_admin";
import "./agregar_empleado.css"
import { CircleCheck } from 'lucide-react';
import BotonGenerico from "../componentesAdmin/boton_generico";
import { UsuariosCreate } from "../servicies/API_Usuario";
import useLiveValidation from "../hooks/useLiveValidation";

function AgregarGarajista() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();
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

  const getSchema = () => ({
    nombre: [
      { rule: (v) => v?.trim().length > 0, message: 'Requerido' },
      { rule: (v) => v?.trim().length >= 2, message: 'Mínimo 2 caracteres' },
      { rule: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(v), message: 'Solo letras' },
    ],
    apellido: [
      { rule: (v) => v?.trim().length > 0, message: 'Requerido' },
      { rule: (v) => v?.trim().length >= 2, message: 'Mínimo 2 caracteres' },
      { rule: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(v), message: 'Solo letras' },
    ],
    email: [
      { rule: (v) => v?.trim().length > 0, message: 'Requerido' },
      { rule: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Email inválido' },
    ],
    contraseña: [
      { rule: (v) => v?.trim().length > 0, message: 'Requerido' },
      { rule: (v) => v?.length >= 6, message: 'Mínimo 6 caracteres' },
    ],
    telefono: [
      { rule: (v) => !v || v.trim().length === 0 || /^[+]{0,1}[0-9\s-()]+$/.test(v.trim()), message: 'Solo números, espacios, guiones, +, ()' },
      { rule: (v) => !v || v.trim().length === 0 || v.trim().replace(/\D/g, '').length >= 7, message: 'Mínimo 7 dígitos' },
    ],
  });

  const { isValid, touched, handleChangeWithTouch } = useLiveValidation(formData, getSchema());

  const buildConditions = (fieldName) => {
    const schema = getSchema();
    if (!schema[fieldName]) return [];
    const value = formData[fieldName];
    return schema[fieldName].map((item) => {
      const ruleFn = item.rule;
      const message = item.message;
      return { label: message, met: ruleFn(value) };
    });
  };

  const fieldsValidation = {};
  Object.keys(getSchema()).forEach((field) => {
    fieldsValidation[field] = {
      conditions: buildConditions(field),
      isTouched: touched[field],
    };
  });

  const handleChange = (field, value) => {
    handleChangeWithTouch(field, value, setFormData);
  };

  const handleGuardarGarajista = async () => {
    setError('');

    if (!isValid) {
      setError('❌ Corrige los errores antes de guardar.');
      return;
    }

    if (!garageId) {
      setError('❌ No se encontró el garage asociado. Vuelve a la zona e inténtalo de nuevo.');
      return;
    }

    if (!usuario?.id_empresa) {
      setError('❌ No se pudo determinar tu empresa. No puedes crear garajistas.');
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
      id_empresa: Number(usuario.id_empresa),
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
      <p>Registro de nuevo garajista para el garage</p>
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
          fieldsValidation={fieldsValidation}
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
