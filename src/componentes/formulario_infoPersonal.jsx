import { Section } from 'lucide-react';
import { useEffect, useState } from 'react';
import "./formulario_infoPersonal.css";
import { Contact } from 'lucide-react';
import Buttom from "./buton_agregar_empleados";

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
     <section className="formulario-container">

         <div className="form-header">
          <Contact className="form-icon" size={24} />
             <h2>{infoPersonalTitulo}</h2>
         </div>
         
         <div className="input-group">
            <label> { nombreCompleto}</label>
             <input type="text" placeholder="Johnathan Doe" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
           
          </div>
 
         <div className="input-group">
           <label> { email}</label>
             <input type="email" placeholder="j.doe@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
         
         </div>

            <div className="input-group">
            <label> { numeroTelefono}</label>
             <input type="tel" placeholder="+1 (555) 000-0000"value={numeroTelefono} onChange={(e) => setNumeroTelefono(e.target.value)} />
        
            </div>
            
            <div className="form-actions">
             <Buttom onClick={AgregarConClick} Contenido="Guardar Empleado" />
            </div>
      </section>
     
  )
     
  }
  export default FormularioInfoPersonal;

