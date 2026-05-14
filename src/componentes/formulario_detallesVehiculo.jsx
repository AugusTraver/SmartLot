import { useState } from 'react';
import { CarFront } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import "./formularios.css";
import BotonGenerico from "./boton_generico";


function FormularioDetallesVehiculo({detallesVehiculoTitulo, Patente, Modelo, }) {
   const navigate = useNavigate();
    const [patente, setPatente] = useState('');
    const [modelo, setmodelo] = useState('');
   

  const AgregarConClick = () => {
    const nuevoAuto = {
      patente: patente,
      modelo: modelo,
      
    };
    
    setPatente("");
    setmodelo("");
    

    
  };
 return (
   <section className="formulario-container">

         <div className="form-header">
          <CarFront className="form-icon" size={24} />
             <h2>{detallesVehiculoTitulo}</h2>
         </div>
         
         <div className="input-group">
           <input type="text" placeholder="ABC123" value={patente} onChange={(e) => setPatente(e.target.value)} />
           
            <label> { Patente}</label>
            
          </div>
 
         <div className="input-group">
           <input type="text" placeholder="Toyota Corolla" value={modelo} onChange={(e) => setmodelo(e.target.value)} />

           <label> { Modelo}</label>
            
         </div>

            
            
      </section>
     

 )

  
  }
  export default FormularioDetallesVehiculo;

  