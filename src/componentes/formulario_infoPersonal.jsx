import { Section } from 'lucide-react';
import { useEffect, useState } from 'react';
import "./formulario_infoPersonal.css";

function FormularioInfoPersonal({infoPersonalTitulo, nombreCompleto, email, numeroTelefono}) {

    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [numeroTelefono, setNumeroTelefono] = useState('');

  const AgregarConClick = () => {
    const nuevoEmpleado = {
      nombreCompleto: nombreCompleto,
      email: email,
      numeroTelefono: numeroTelefono
    };
    setEmpleados([...empleados, nuevoEmpleado]);
    setNombreCompleto("");
    setNumeroTelefono("");
    setEmail("");

    
  };


  return(
     <section>
          <h2>{infoPersonalTitulo}</h2>
         <div>
            <label> { nombreCompleto}</label>
             <input type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
           
             <label> { email}</label>
             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
         
             <label> { numeroTelefono}</label>
             <input type="tel" value={numeroTelefono} onChange={(e) => setNumeroTelefono(e.target.value)} />
        
             <Buttom onClick={AgregarConClick} Contenido="Guardar Empleado" />
         </div>
      </section>
     
  )
     
  }
  export default FormularioInfoPersonal;

