import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
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

gsap.registerPlugin(ScrollTrigger);

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

function DecorativeCircles() {
  return (
    <div className="about-deco" aria-hidden="true">
      <div className="about-deco-circle about-deco-circle--1" />
      <div className="about-deco-circle about-deco-circle--2" />
      <div className="about-deco-circle about-deco-circle--3" />
      <div className="about-deco-line about-deco-line--1" />
      <div className="about-deco-line about-deco-line--2" />
    </div>
  );
}

export default function SobreNosotros() {
  const heroRef = useRef(null);
  const purposeRef = useRef(null);
  const splitRef = useRef(null);
  const pillarsRef = useRef(null);
  const workflowRef = useRef(null);
  const finalRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".about-hero .about-back", { y: -24, opacity: 0, duration: 1 }, 0.2)
        .from(".about-hero h1", { y: 40, opacity: 0, duration: 1.2 }, 0.3)
        .from(".about-hero .about-hero__lead", { y: 30, opacity: 0, duration: 1 }, 0.6)
        .from(".about-hero__actions a", { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.8)
        .from(".about-hero__visual > *", { y: 50, opacity: 0, duration: 1, stagger: 0.15 }, 0.5)
        .from(".about-signal-grid span", { scaleX: 0, transformOrigin: "left center", duration: 0.6, stagger: 0.1 }, 1.3);

      gsap.to(".about-signal-grid span", {
        scaleX: 1.1,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      gsap.to(".about-deco-circle--1", {
        y: -30,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".about-deco-circle--2", {
        y: 20,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      if (purposeRef.current) {
        ScrollTrigger.create({
          trigger: purposeRef.current,
          start: "top 88%",
          onEnter: () => {
            gsap.to(".about-purpose__heading > *", {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.15,
              ease: "power4.out",
            });
            gsap.to(".about-purpose__body", {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power4.out",
              delay: 0.1,
            });
          },
          once: true,
        });
      }

      if (splitRef.current) {
        ScrollTrigger.create({
          trigger: splitRef.current,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              ".about-split article:first-child",
              { x: -80, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: "power4.out" }
            );
            gsap.fromTo(
              ".about-split article:last-child",
              { x: 80, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.15 }
            );
          },
          once: true,
        });
      }

      if (pillarsRef.current) {
        ScrollTrigger.create({
          trigger: pillarsRef.current,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              ".about-pillar",
              { y: 60, opacity: 0, rotateX: -8 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.9,
                ease: "power4.out",
                stagger: 0.12,
              }
            );
          },
          once: true,
        });
      }

      if (workflowRef.current) {
        ScrollTrigger.create({
          trigger: workflowRef.current,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              ".about-workflow__heading > *",
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.12 }
            );
            gsap.fromTo(
              ".about-steps li",
              { y: 50, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power4.out",
                stagger: 0.1,
              },
              "-=0.3"
            );

            document.querySelectorAll(".about-step-num").forEach((el) => {
              const target = parseInt(el.textContent, 10);
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 1.4,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = String(Math.round(obj.val)).padStart(2, "0");
                },
              });
            });
          },
          once: true,
        });
      }

      if (finalRef.current) {
        ScrollTrigger.create({
          trigger: finalRef.current,
          start: "top 90%",
          onEnter: () => {
            gsap.fromTo(
              ".about-final > *",
              { y: 40, opacity: 0, scale: 0.96 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power4.out",
                stagger: 0.12,
              }
            );
          },
          once: true,
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [
          ".about-hero .about-back",
          ".about-hero h1",
          ".about-hero .about-hero__lead",
          ".about-hero__actions a",
          ".about-hero__visual > *",
          ".about-signal-grid span",
          ".about-purpose__heading > *",
          ".about-purpose__body",
          ".about-split article",
          ".about-pillar",
          ".about-workflow__heading > *",
          ".about-steps li",
          ".about-final > *",
        ],
        { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0 }
      );
    });
  }, []);

  return (
    <>
      <InteractiveBackground count={70} interactionRadius={150} repelForce={80} />
      <div className="about-page landing-page bg-noise">
        <Navbar />
        <DecorativeCircles />

        <main className="about-main">
          <section ref={heroRef} className="about-hero" aria-labelledby="about-title">
            <div className="about-hero__content">
              <Link to="/" className="about-back">
                <ArrowLeft size={18} />
                Volver al inicio
              </Link>

              <h1 id="about-title">
                Estacionamientos corporativos, gestionados con claridad.
              </h1>
              <p className="about-hero__lead">
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

          <section ref={purposeRef} id="proposito" className="about-purpose">
            <div className="about-purpose__heading">
              <span className="about-kicker">Nuestro proposito</span>
              <h2>Menos friccion para estacionar, mas control para administrar.</h2>
            </div>
            <p className="about-purpose__body">
              Construimos una plataforma pensada para organizaciones que necesitan pasar de procesos manuales a una
              gestion digital, trazable y facil de usar. SmartLot ayuda a que cada espacio tenga contexto, cada reserva
              tenga seguimiento y cada decision se apoye en informacion real.
            </p>
          </section>

          <section ref={splitRef} className="about-split" aria-label="Problema y solucion">
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

          <section ref={pillarsRef} className="about-pillars" aria-label="Pilares de SmartLot">
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

          <section ref={workflowRef} className="about-workflow">
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
                  <span className="about-step-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section ref={finalRef} className="about-final">
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
