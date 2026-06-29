import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Layers3,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Navbar from "../componentesLanding/landing/Navbar";
import InteractiveBackground from "../componentesLanding/landing/InteractiveBackground";
import "../componentesLanding/landing/landing.css";
import "./SobreNosotros.css";

const pillars = [
  {
    icon: Clock3,
    title: "Tiempo mejor usado",
    text: "Reducimos tareas manuales para que los equipos administren reservas, accesos y espacios desde un flujo claro.",
  },
  {
    icon: ShieldCheck,
    title: "Control operativo",
    text: "Centralizamos informacion critica para que cada rol vea lo que necesita sin depender de planillas dispersas.",
  },
  {
    icon: UsersRound,
    title: "Experiencia simple",
    text: "Diseñamos SmartLot para empleados, administradores y operadores que necesitan resolver rapido.",
  },
  {
    icon: Layers3,
    title: "Escalable por empresa",
    text: "La plataforma acompaña estructuras con sedes, garages, zonas, permisos y distintos niveles de gestion.",
  },
];

const workflow = [
  "La empresa organiza sedes, garages y zonas.",
  "Los empleados reservan o consultan disponibilidad.",
  "Los administradores supervisan ocupacion, conflictos y reportes.",
  "La operacion mejora con datos claros para tomar decisiones.",
];

export default function SobreNosotros() {
  return (
    <>
      <InteractiveBackground count={70} interactionRadius={150} repelForce={80} />
      <div className="about-page landing-page bg-noise">
        <Navbar />

        <main className="about-main">
          <section className="about-hero" aria-labelledby="about-title">
            <div className="about-hero__content">
              <Link to="/" className="about-back">
                <ArrowLeft size={18} />
                Volver al inicio
              </Link>

              <h1 id="about-title">
                Estacionamientos corporativos, gestionados con claridad.
              </h1>
              <p>
                SmartLot nace para ordenar un problema cotidiano de las empresas: gestionar espacios, reservas,
                accesos y conflictos sin perder tiempo ni visibilidad.
              </p>

              <div className="about-hero__actions">
                <Link to="/login" className="about-primary">
                  Iniciar sesion
                  <ArrowRight size={18} />
                </Link>
                <a href="#proposito" className="about-secondary">
                  Ver proposito
                </a>
              </div>
            </div>

            <div className="about-hero__visual" aria-label="Resumen visual de SmartLot">
              <div className="about-logo-panel">
                <img src="/logoEntero.png" alt="SmartLot" />
                <div className="about-signal-grid" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="about-metric about-metric--top">
                <Building2 size={18} />
                <div>
                  <strong>Multi sede</strong>
                  <span>Empresas, sedes y garages conectados</span>
                </div>
              </div>

              <div className="about-metric about-metric--bottom">
                <MapPinned size={18} />
                <div>
                  <strong>Ocupacion visible</strong>
                  <span>Datos para operar con precision</span>
                </div>
              </div>
            </div>
          </section>

          <section id="proposito" className="about-purpose">
            <div>
              <span className="about-kicker">Nuestro proposito</span>
              <h2>Menos friccion para estacionar, mas control para administrar.</h2>
            </div>
            <p>
              Construimos una plataforma pensada para organizaciones que necesitan pasar de procesos manuales a una
              gestion digital, trazable y facil de usar. SmartLot ayuda a que cada espacio tenga contexto, cada reserva
              tenga seguimiento y cada decision se apoye en informacion real.
            </p>
          </section>

          <section className="about-split" aria-label="Problema y solucion">
            <article>
              <span>El problema</span>
              <h3>Planillas, mensajes sueltos y poca visibilidad.</h3>
              <p>
                Muchas empresas administran estacionamientos con procesos fragmentados. Eso genera demoras, conflictos,
                espacios desaprovechados y una experiencia poco clara para los usuarios.
              </p>
            </article>
            <article>
              <span>La solucion</span>
              <h3>Una operacion centralizada y medible.</h3>
              <p>
                SmartLot organiza reservas, garages, usuarios, reportes y conflictos en un mismo entorno. Cada rol
                accede a las herramientas que necesita para operar mejor.
              </p>
            </article>
          </section>

          <section className="about-pillars" aria-label="Pilares de SmartLot">
            {pillars.map((pillar) => (
              <article className="about-pillar" key={pillar.title}>
                <div className="about-pillar__icon">
                  <pillar.icon size={22} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </section>

          <section className="about-workflow">
            <div className="about-workflow__heading">
              <Sparkles size={22} />
              <div>
                <span className="about-kicker">Como funciona</span>
                <h2>Un flujo pensado para el dia a dia.</h2>
              </div>
            </div>

            <ol className="about-steps">
              {workflow.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="about-final">
            <CheckCircle2 size={24} />
            <h2>SmartLot ordena la gestion para que estacionar deje de ser un problema operativo.</h2>
            <Link to="/" className="about-secondary about-secondary--dark">
              Volver al inicio 
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}
