import { CarFront } from 'lucide-react';
import "./formularios.css";

function FormularioDetallesVehiculo({ detallesVehiculoTitulo, labels, vehicleData, onChange }) {
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
 
         <div className="input-group">
           <input type="text" placeholder="Toyota Corolla" value={vehicleData.modelo} onChange={(e) => onChange('modelo', e.target.value)} />
           <label>{labels.modelo}</label>
         </div>
      </section>
 )
}
export default FormularioDetallesVehiculo;

  