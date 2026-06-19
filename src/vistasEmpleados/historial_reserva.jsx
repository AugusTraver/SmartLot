import TarjetaGarage from "../componentesAdmin/tarjeta_garages";
import TarjetaReserva from "../componentesEmpleado/tarjeta_reserva";
import "./historial_reserva.css"
import { useNavigate } from "react-router-dom"

function HistorialReserva ()
{
    const navigate = useNavigate()
     const [ReservaAcual, setUltimaReserva] = useState(null);

 
    useEffect(() => {
    // Simulación de datos que vendrían del backend
    const ReservaAcual = {
      nivel: 2,
      plaza: "B-12",
      garage: "Oficinas Centrales",
      entrada: "Hoy, 09:00",
      salida: "Hoy, 18:00",
      estado: "Finalizada",
    };

    setUltimaReserva(ReservaAcual);
  }, []);
       return (
    <main className="historial-page">
      <h1>Historial de Reservas</h1>
      <p>Gestiona tus estacionamientos pasados y próximos.</p>

      <section className="ultima-reserva-section">
        <h2>Ultima reserva</h2>

        {ultimaReserva && (
          <TarjetaReserva reserva={ReservaAcual} />
        )}
      </section>
    </main>
  );
}

export default HistorialReserva