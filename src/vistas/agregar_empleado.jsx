import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioInfoPersonal from "../componentes/formulario_infoPersonal";
import FormularioDetallesVehiculo from "../componentes/formulario_detallesVehiculo";
import Header from "../componentes/header_admin";
import "./agregar_empleado.css"
import { CircleCheck } from 'lucide-react';
import BotonGenerico from "../componentes/boton_generico";
import { UsuariosCreate } from "../servicies/API_Usuario";

function AgregarEmpleado() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contraseña: '',
    id_rol: 2,
    id_sede: 1,
    id_empresa: 1,
    patente: '',
    modelo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardarEmpleado = async () => {
    setError('');

    // Validaciones personalizadas
    if (!formData.nombre.trim()) {
      setError('❌ El nombre es requerido.');
      return;
    }
    if (formData.nombre.trim().length < 2) {
      setError('❌ El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (!formData.apellido.trim()) {
      setError('❌ El apellido es requerido.');
      return;
    }
    if (formData.apellido.trim().length < 2) {
      setError('❌ El apellido debe tener al menos 2 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
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

    if (formData.telefono.trim() && formData.telefono.trim().length < 7) {
      setError('❌ El teléfono debe tener al menos 7 dígitos.');
      return;
    }

    setLoading(true);

    const payload = {
      id_rol: Number(formData.id_rol) || null,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      id_sede: Number(formData.id_sede) || null,
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      contraseña: formData.contraseña,
      id_empresa: Number(formData.id_empresa) || null
    };

    const response = await UsuariosCreate(payload);
    setLoading(false);

    if (response.respuesta) {
      navigate('/gestion_de_empleados', { replace: true });
    } else {
      setError('❌ No se pudo guardar el empleado. Verifica los datos e intenta de nuevo.');
    }
  };

  return (
    <div className="agregar-empleado-page">
      <Header />
      <h3 style={{ color: "#1D4ED8", fontSize: "24px", fontWeight: "600" }}>Agregar Empleado</h3>
      <p>Configuración de nuevos usuarios y sus privilegios</p>
      <main style={{ padding: "20px", paddingBottom: "50px", marginTop: "-10px" }}>
        <FormularioInfoPersonal
          infoPersonalTitulo="Información Personal"
          labels={{
            nombre: 'Nombre',
            apellido: 'Apellido',
            email: 'Correo electrónico',
            telefono: 'Número de teléfono',
            contraseña: 'Contraseña'
          }}
          formData={formData}
          onChange={handleChange}
        />

        <FormularioDetallesVehiculo
          detallesVehiculoTitulo="Detalles del Vehículo"
          labels={{
            patente: 'Patente',
            modelo: 'Modelo'
          }}
          vehicleData={{ patente: formData.patente, modelo: formData.modelo }}
          onChange={handleChange}
        />

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <BotonGenerico
            onClick={handleGuardarEmpleado}
            disabled={loading}
            className="btn-guardar-grande"
          >
            <CircleCheck size={20} color="white" />
            <span>{loading ? 'Guardando...' : 'Guardar empleado'}</span>
          </BotonGenerico>

          <BotonGenerico
            style={{ backgroundColor: "grey" }}
            onClick={() => navigate('/gestion_de_empleados', { replace: true })}
            className="btn-cancelar-grande"
          >
            <span>Cancelar</span>
          </BotonGenerico>
        </div>
      </main>
    </div>
  );
}

export default AgregarEmpleado;
