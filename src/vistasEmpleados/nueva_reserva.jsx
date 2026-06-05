import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeaderEmpleado from "../componentesEmpleado/header_empleado";
import FormularioReserva from "../componentesEmpleado/form_reserva";
import { ReservasCreate } from "../servicies/API_Reserva";
import { VehiculosGetAll } from "../servicies/API_Vehiculo";
import { GaragesGetAll } from "../servicies/API_Garage";
import { useAuth } from "../contexts/useAuth";
import "./nueva_reserva.css";
import FooterEmpleado from "../componentesEmpleado/footer_empleado";

const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.vehiculos)) return datos.vehiculos;
  if (Array.isArray(datos?.value)) return datos.value;
  return [];
};

const obtenerIdUsuario = (usuario) =>
  usuario?.id_usuario ??
  usuario?.idUsuario ??
  usuario?.usuario_id ??
  usuario?.usuarioId ??
  usuario?.id ??
  usuario?._id ??
  usuario?.usuario?.id_usuario ??
  usuario?.usuario?.idUsuario ??
  usuario?.usuario?.id;

const obtenerIdGarage = (item) =>
  item?.id_garage ??
  item?.idGarage ??
  item?.garage_id ??
  item?.garageId ??
  item?.garage?.id_garage ??
  item?.garage?.idGarage ??
  item?.garage?.id ??
  item?.garage?._id;

const obtenerIdSede = (item) =>
  item?.id_sede ??
  item?.idSede ??
  item?.sede_id ??
  item?.sedeId ??
  item?.sede?.id ??
  item?.sede?.id_sede;

const obtenerNumeroValido = (...valores) => {
  for (const valor of valores) {
    const numero = Number(valor);
    if (Number.isFinite(numero)) return numero;
  }
  return null;
};

const NuevaReserva = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [vehiculos, setVehiculos] = useState([]);
  const [garages, setGarages] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });

    tl.from(".animate-back", { x: -15, opacity: 0 })
      .from(".animate-texts > *", { y: 20, opacity: 0, stagger: 0.15 }, "-=0.4")
      .from(".formularioReserva", { y: 30, opacity: 0, clearProps: "all" }, "-=0.3");
  }, { scope: containerRef });

  useEffect(() => {
    let montado = true;

    const cargarVehiculos = async () => {
      setLoadingVehiculos(true);
      setMensaje({ tipo: "", texto: "" });

      const [resultado, garagesResultado] = await Promise.all([
        VehiculosGetAll(),
        GaragesGetAll(),
      ]);
      if (!montado) return;

      if (resultado.respuesta) {
        const idUsuario = obtenerNumeroValido(obtenerIdUsuario(usuario));
        const vehiculosUsuario = obtenerListado(resultado.datos).filter((vehiculo) =>
          Number(vehiculo.id_usuario ?? vehiculo.idUsuario ?? vehiculo.usuario_id) === idUsuario
        );
        setVehiculos(vehiculosUsuario);

        const garages = garagesResultado.respuesta ? obtenerListado(garagesResultado.datos) : [];
        const idSedeUsuario = obtenerNumeroValido(obtenerIdSede(usuario));
        const garagesDeSede = idSedeUsuario
          ? garages.filter((garage) => Number(obtenerIdSede(garage)) === idSedeUsuario)
          : garages;

        setGarages(garagesDeSede);

        if (vehiculosUsuario.length === 0) {
          setMensaje({ tipo: "error", texto: "No tenes vehiculos registrados para crear una reserva." });
        } else if (garagesDeSede.length === 0) {
          setMensaje({ tipo: "error", texto: "No hay garages disponibles para tu sede." });
        }
      } else {
        setMensaje({ tipo: "error", texto: "No se pudieron cargar tus vehiculos." });
      }

      setLoadingVehiculos(false);
    };

    cargarVehiculos();

    return () => {
      montado = false;
    };
  }, [usuario]);

  const handleReservationSubmit = async (datosFormulario) => {
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    const idVehiculo = obtenerNumeroValido(datosFormulario.id_vehiculo, datosFormulario.idVehiculo);
    const vehiculoSeleccionado = vehiculos.find((vehiculo) => {
      const id = vehiculo.id_vehiculo ?? vehiculo.idVehiculo ?? vehiculo.id ?? vehiculo._id;
      return Number(id) === idVehiculo;
    });
    const idUsuario = obtenerNumeroValido(
      obtenerIdUsuario(usuario),
      vehiculoSeleccionado?.id_usuario,
      vehiculoSeleccionado?.idUsuario,
      vehiculoSeleccionado?.usuario_id,
      vehiculoSeleccionado?.usuarioId
    );
    const idGarage = obtenerNumeroValido(
      datosFormulario.id_garage,
      datosFormulario.idGarage
    );

    if (!idUsuario) {
      setLoading(false);
      setMensaje({ tipo: "error", texto: "No se pudo identificar tu usuario para crear la reserva." });
      return;
    }

    if (!idGarage) {
      setLoading(false);
      setMensaje({ tipo: "error", texto: "No se pudo identificar el garage para crear la reserva." });
      return;
    }

    const payloadReserva = {
      ...datosFormulario,
      fecha_entrada: datosFormulario.fecha_entrada,
      fecha_salida: datosFormulario.fecha_salida,
      id_usuario: idUsuario,
      id_vehiculo: idVehiculo,
      id_garage: idGarage,
    };

    const resultado = await ReservasCreate(payloadReserva);

    setLoading(false);
    if (resultado.respuesta) {
      setMensaje({ tipo: "success", texto: "Reserva confirmada con exito." });
      setTimeout(() => navigate("/empleados_dashboard"), 1200);
    } else {
      setMensaje({
        tipo: "error",
        texto: resultado.datos?.message || "Hubo un error al procesar la reserva. Intentalo de nuevo.",
      });
    }
  };

  return (
    <div className="nuevaReserva-contenedor" ref={containerRef}>
      <HeaderEmpleado />
      <main className="nuevaReserva-contenido" role="main">
        <div className="animate-back">
          <button
            className="boton-back"
            onClick={() => navigate("/empleados_dashboard")}
            aria-label="Volver al panel"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <header className="textosTitulos animate-texts">
          <h1>Nueva Reserva</h1>
          <p>Reserva tu plaza de estacionamiento para tu proxima jornada.</p>
        </header>

        {mensaje.texto && (
          <div className={`form-feedback alert-${mensaje.tipo}`} role="alert">
            <p>{mensaje.texto}</p>
          </div>
        )}

        <section className="formularioReserva">
          {loadingVehiculos ? (
            <div className="form-feedback">Cargando vehiculos...</div>
          ) : (
            <FormularioReserva
              onSubmit={handleReservationSubmit}
              loading={loading}
              vehiculos={vehiculos}
              garages={garages}
            />
          )}
        </section>
      </main>
      <FooterEmpleado/>
    </div>
  );
};

export default NuevaReserva;
