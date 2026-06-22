import { CarFront } from 'lucide-react';
import "./formularios.css";
import "./formulario_detallesVehiculo.css";
import FieldValidation from "../components/FieldValidation";

function FormularioDetallesVehiculo({ detallesVehiculoTitulo, labels, vehicleData, onChange, modelos, fieldsValidation = {} }) {
  const getDisplayName = (item) => item?.nombre || item?.name || item?.descripcion || item?.tipo || '';
  const handleModeloChange = (e) => {
    const value = e.target.value;
    onChange('id_modelo', value !== '' ? Number(value) : null);
  };

 return (
   <section className="formulario-container">
         <div className="form-header">
          <CarFront className="form-icon" size={24} />
             <h2>{detallesVehiculoTitulo}</h2>
         </div>
         
          <div className="input-group">
            <input type="text" placeholder="ABC123" value={vehicleData.patente} onChange={(e) => onChange('patente', e.target.value)} required />
            <label>{labels.patente}</label>
            {fieldsValidation.patente && (
              <FieldValidation conditions={fieldsValidation.patente.conditions} isTouched={fieldsValidation.patente.isTouched} />
            )}
          </div>
 
         <div className={`input-group${vehicleData.id_modelo ? ' has-value' : ''}`}>
            <select
              value={vehicleData.id_modelo ?? ''}
              onChange={handleModeloChange}
              required
            >
              <option value=""></option>
             {modelos && modelos.map((m) => (
               <option key={m.id} value={m.id}>{getDisplayName(m)}</option>
             ))}
           </select>
           <label>{labels.modelo}</label>
           {fieldsValidation.id_modelo && (
              <FieldValidation conditions={fieldsValidation.id_modelo.conditions} isTouched={fieldsValidation.id_modelo.isTouched} />
            )}
         </div>
      </section>
 )
}
export default FormularioDetallesVehiculo;

  
