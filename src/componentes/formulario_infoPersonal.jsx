import { Contact } from 'lucide-react';
import "./formularios.css";

function FormularioInfoPersonal({
    infoPersonalTitulo,
    labels,
    formData,
    onChange
}) {

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
                value={formData.nombre} 
                onChange={(e) => onChange('nombre', e.target.value)} 
            />
            <label>{labels.nombre}</label>
          </div>
 
         <div className="input-group">
            <input                 type="text" 
                placeholder=" " 
                value={formData.apellido} 
                onChange={(e) => onChange('apellido', e.target.value)} 
            />
            <label>{labels.apellido}</label>
         </div>
 
         <div className="input-group">
            <input                 type="email" 
                placeholder=" " 
                value={formData.email} 
                onChange={(e) => onChange('email', e.target.value)} 
            />
            <label>{labels.email}</label>
         </div>

         <div className="input-group">
            <input 
                type="tel" 
                placeholder=" " 
                value={formData.telefono} 
                onChange={(e) => onChange('telefono', e.target.value)} 
            />
            <label>{labels.telefono}</label>
         </div>

         <div className="input-group">
            <input 
                type="password" 
                placeholder=" " 
                value={formData.contraseña} 
                onChange={(e) => onChange('contraseña', e.target.value)} 
            />
            <label>{labels.contraseña}</label>
         </div>

         <div className="input-group">
            <input 
                type="number" 
                placeholder=" " 
                value={formData.id_rol} 
                onChange={(e) => onChange('id_rol', e.target.value)} 
            />
            <label>{labels.id_rol}</label>
         </div>

         <div className="input-group">
            <input 
                type="number" 
                placeholder=" " 
                value={formData.id_empresa} 
                onChange={(e) => onChange('id_empresa', e.target.value)} 
            />
            <label>{labels.id_empresa}</label>
         </div>

         <div className="input-group">
            <input 
                type="number" 
                placeholder=" " 
                value={formData.id_sede} 
                onChange={(e) => onChange('id_sede', e.target.value)} 
            />
            <label>{labels.id_sede}</label>
         </div>
      </section>
    )
}
export default FormularioInfoPersonal;