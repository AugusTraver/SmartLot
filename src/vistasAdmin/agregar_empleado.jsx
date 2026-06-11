import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import FormularioInfoPersonal from "../componentesAdmin/formulario_infoPersonal";
import FormularioDetallesVehiculo from "../componentesAdmin/formulario_detallesVehiculo";
import Header from "../componentesAdmin/header_admin";
import "./agregar_empleado.css"
import { CircleCheck } from 'lucide-react';
import BotonGenerico from "../componentesAdmin/boton_generico";
import { UsuariosCreate } from "../servicies/API_Usuario";
import { VehiculosCreate } from "../servicies/API_Vehiculo";
import { ModelosGetAll } from "../servicies/API_Modelo";
import { SedesGetAll } from "../servicies/API_Sede";

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

function AgregarEmpleado() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contraseña: '',
    id_sede: usuario?.id_sede ?? '',
    id_empresa: usuario?.id_empresa ?? '',
    patente: '',
    id_modelo: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelos, setModelos] = useState([]);
  const [sedes, setSedes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [modelosRes, sedesRes] = await Promise.all([
        ModelosGetAll(),
        SedesGetAll(),
      ]);
      if (modelosRes.respuesta) {
        setModelos(obtenerListado(modelosRes.datos));
      }
      if (sedesRes.respuesta) {
        const todas = obtenerListado(sedesRes.datos);
        const empresaAdmin = Number(usuario?.id_empresa);
        const sedeAdmin = todas.filter((s) => {
          if (!usuario?.id_sede) {
            return !isNaN(empresaAdmin) && empresaAdmin > 0 && Number(s.id_empresa) === empresaAdmin;
          }
          return Number(s.id) === Number(usuario?.id_sede) &&
            Number(s.id_empresa) === empresaAdmin;
        });
        setSedes(sedeAdmin);
        if (usuario?.id_sede) {
          setFormData((prev) => ({
            ...prev,
            id_sede: Number(usuario.id_sede),
            id_empresa: empresaAdmin,
          }));
        } else if (!isNaN(empresaAdmin) && empresaAdmin > 0) {
          setFormData((prev) => ({
            ...prev,
            id_empresa: empresaAdmin,
          }));
        }
      }
    };
    fetchData();
  }, [usuario]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardarEmpleado = async () => {
    setError('');

    // Validaciones personalizadas
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

    // Validaciones de vehículo
    const patenteIngresada = formData.patente && formData.patente.trim();
    const modeloSeleccionado = formData.id_modelo;

    if ((patenteIngresada && !modeloSeleccionado) || (!patenteIngresada && modeloSeleccionado)) {
      setError('❌ Si ingresas detalles del vehículo, debes completar tanto la patente como seleccionar un modelo.');
      return;
    }

    if (patenteIngresada && modeloSeleccionado) {
      const patenteRegex = /^[a-zA-Z0-9]{6,8}$/;
      if (!patenteRegex.test(patenteIngresada)) {
        setError('❌ La patente debe ser alfanumérica y tener entre 6 y 8 caracteres (ej: AAA123 o AB123CD).');
        return;
      }
    }

    if (!formData.id_empresa) {
      setError('❌ No se pudo determinar tu empresa. No puedes crear empleados.');
      return;
    }

    setLoading(true);

    const payload = {
      id_rol: 2,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      id_sede: Number(formData.id_sede) || null,
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      contraseña: formData.contraseña,
      id_empresa: Number(formData.id_empresa) || null
    };

    const response = await UsuariosCreate(payload);

    if (!response.respuesta) {
      setLoading(false);
      const serverMsg = response.datos?.message || response.datos || 'Error al crear el usuario.';
      setError(typeof serverMsg === 'string' ? `❌ ${serverMsg}` : '❌ Error al crear el usuario.');
      return;
    }

    if (response.respuesta) {
      if (patenteIngresada && modeloSeleccionado) {
        try {
          const createdUser = response.datos;
          const idUsuario = createdUser?.id || createdUser?.insertId || (Array.isArray(createdUser) ? createdUser[0]?.id : null);

          if (idUsuario) {
            const vehRes = await VehiculosCreate({
              id_usuario: Number(idUsuario),
              id_modelo: Number(modeloSeleccionado),
              patente: patenteIngresada.toUpperCase()
            });

            if (!vehRes.respuesta) {
              setLoading(false);
              const msg = vehRes.datos?.message || vehRes.datos || 'Error al crear el vehículo.';
              setError(typeof msg === 'string' ? `❌ ${msg}` : '❌ Error al crear el vehículo.');
              return;
            }
          }
        } catch (vehErr) {
          console.error("Error al guardar el vehículo del empleado:", vehErr);
          setLoading(false);
          setError('❌ Error inesperado al guardar el vehículo. Revisa la consola.');
          return;
        }
      }
      setLoading(false);
      navigate('/gestion_de_empleados', { replace: true });
    } else {
      setLoading(false);
      setError('❌ No se pudo guardar el empleado. Verifica los datos e intenta de nuevo.');
    }
  };

  return (
    <div className="agregar-empleado-page">
      <Header />
      <div className="textoAgregarEmpleado">
         <h3 style={{ color: "#1D4ED8", fontSize: "24px", fontWeight: "600",  }}>Agregar Empleado</h3>
      <p>Configuración de nuevos usuarios y sus privilegios</p>
      </div>
      
      <main style={{ padding: "20px", paddingBottom: "50px", marginTop: "-10px" }}>
          <FormularioInfoPersonal
            infoPersonalTitulo="Información Personal"
            labels={{
              nombre: 'Nombre',
              apellido: 'Apellido',
              email: 'Correo electrónico',
              telefono: 'Número de teléfono',
              contraseña: 'Contraseña',
              sede: 'Sede',
            }}
            formData={formData}
            onChange={handleChange}
            sedes={sedes}
            isSedeDisabled={true}
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
