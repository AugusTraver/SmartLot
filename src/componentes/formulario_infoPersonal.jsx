import { useState } from 'react';
import { Contact, CircleCheck } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import "./formulario_infoPersonal.css";
import BotonGenerico from "./boton_generico";

function FormularioInfoPersonal({infoPersonalTitulo, NombreCompleto, Email, NumeroTelefono}) {
   const navigate = useNavigate();
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
            <label> { NombreCompleto}</label>
             <input type="text" placeholder="Johnathan Doe" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
           
          </div>
 
         <div className="input-group">
           <label> { Email}</label>
             <input type="email" placeholder="j.doe@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
         
         </div>

            <div className="input-group">
            <label> { NumeroTelefono}</label>
             <input type="tel" placeholder="+1 (555) 000-0000"value={numeroTelefono} onChange={(e) => setNumeroTelefono(e.target.value)} />
        
            </div>
            
            
      </section>
     
  )
     
  }
  export default FormularioInfoPersonal;

