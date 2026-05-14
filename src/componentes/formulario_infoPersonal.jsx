import { useState } from 'react';
import { Contact } from 'lucide-react'; 
import "./formularios.css";

function FormularioInfoPersonal({infoPersonalTitulo, NombreCompleto, Email, NumeroTelefono}) {
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [numeroTelefono, setNumeroTelefono] = useState('');

    return(
     <section className="formulario-container">
         <div className="form-header">
             <Contact className="form-icon" size={24} />
             <h2>{infoPersonalTitulo}</h2>
         </div>
         
         <div className="input-group">
            {/* El input va primero para usar el selector '+' o '~' en CSS */}
            <input 
                type="text" 
                placeholder=" " 
                value={nombreCompleto} 
                onChange={(e) => setNombreCompleto(e.target.value)} 
            />
            <label>{NombreCompleto}</label>
          </div>
 
         <div className="input-group">
            <input 
                type="email" 
                placeholder=" " 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <label>{Email}</label>
         </div>

         <div className="input-group">
            <input 
                type="tel" 
                placeholder=" " 
                value={numeroTelefono} 
                onChange={(e) => setNumeroTelefono(e.target.value)} 
            />
            <label>{NumeroTelefono}</label>
         </div>
      </section>
    )
}
export default FormularioInfoPersonal;