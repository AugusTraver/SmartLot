import { CarFront } from 'lucide-react';
import "./formularios.css";
import "./formulario_detallesVehiculo.css";

function FormularioDetallesVehiculo({ detallesVehiculoTitulo, labels, vehicleData, onChange, modelos }) {
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
           <input type="text" placeholder="ABC123" value={vehicleData.patente} onChange={(e) => onChange('patente', e.target.value)} />
           <label>{labels.patente}</label>
         </div>
 
         <div className={`input-group${vehicleData.id_modelo ? ' has-value' : ''}`}>
           <select
             value={vehicleData.id_modelo ?? ''}
             onChange={handleModeloChange}
           >
             <option value="">Seleccionar modelo</option>
             {modelos && modelos.map((m) => (
               <option key={m.id} value={m.id}>{m.nombre}</option>
             ))}
           </select>
           <label>{labels.modelo}</label>
         </div>
      </section>
 )
}
export default FormularioDetallesVehiculo;

  