import FormularioInfoPersonal from "../componentes/formulario_infoPersonal";

function AgregarEmpleado() {
   const navigate = useNavigate();

  return (
    <div>
      <h1>Agregar Empleado</h1>
      <FormularioInfoPersonal 
       infoPersonalTitulo="Información Personal"
       nombreCompleto="Nombre completo"
       email="Email"
       numeroTelefono="Número de teléfono"
      />
    </div>
  );
}

export default AgregarEmpleado;
