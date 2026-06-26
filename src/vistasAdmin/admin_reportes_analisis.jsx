import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import "./admin_reportes_analisis.css";
import Header from '../componentesAdmin/header_admin';
import FooterEmpleado from '../componentesAdmin/footer_admin';
import { exportarReporteExcel } from '../util/exportar_reportes_excel';
import { useAuth } from '../contexts/useAuth';
import { GaragesGetAll } from "../servicies/API_Garage";
import { UsuariosGetAll } from "../servicies/API_Usuario";
import { ReservasGetAll } from "../servicies/API_Reserva";
import { SedesGetAll } from "../servicies/API_Sede";


const obtenerListado = (datos) => {
  if (Array.isArray(datos)) return datos;
  if (Array.isArray(datos?.datos)) return datos.datos;
  if (Array.isArray(datos?.data)) return datos.data;
  if (Array.isArray(datos?.reservas)) return datos.reservas;
  if (Array.isArray(datos?.usuarios)) return datos.usuarios;
  return [];
};

const obtenerIdUsuario = (item) => item?.id_usuario ?? item?.idUsuario ?? item?.usuario_id ?? item?.id;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="trend-tooltip">
        <span className="trend-tooltip__day">{label}</span>
        <span className="trend-tooltip__value">{payload[0].value}%</span>
        <div className="trend-tooltip__bar">
          <div className="trend-tooltip__fill" style={{ width: `${payload[0].value}%` }} />
        </div>
      </div>
    );
  }
  return null;
};

const ReportesSkeleton = () => (
  <>
    <section className="reportes-section">
      <div className="export-actions">
        <article className="report-btn-skeleton" aria-label="Cargando accion de exportacion">
          <span className="reportes-skeleton-icon" />
          <div className="report-btn__content">
            <span className="reportes-skeleton-line reportes-skeleton-title" />
            <span className="reportes-skeleton-line reportes-skeleton-subtitle" />
          </div>
        </article>
      </div>
    </section>

    <section className="kpi-grid" aria-label="Cargando indicadores">
      {Array.from({ length: 4 }).map((_, index) => (
        <article className="kpi-card kpi-card-skeleton" key={index}>
          <div className="kpi-card__header">
            <span className="reportes-skeleton-icon" />
            <span className="reportes-skeleton-line reportes-skeleton-kpi-label" />
          </div>
          <span className="reportes-skeleton-line reportes-skeleton-kpi-value" />
        </article>
      ))}
    </section>

    <section className="reportes-section" aria-label="Cargando grafico de tendencia">
      <div className="reportes-section__title-container">
        <span className="reportes-skeleton-small-icon" />
        <span className="reportes-skeleton-line reportes-skeleton-section-title" />
      </div>
      <div className="trend-chart-wrapper trend-chart-wrapper-skeleton">
        <span className="reportes-skeleton-axis reportes-skeleton-axis-y" />
        <div className="reportes-skeleton-bars">
          {[62, 74, 68, 82, 96, 88, 52].map((height, index) => (
            <span className="reportes-skeleton-bar" style={{ height: `${height}%` }} key={index} />
          ))}
        </div>
        <span className="reportes-skeleton-axis reportes-skeleton-axis-x" />
      </div>
    </section>
  </>
);

const generarGraficoTendenciaPng = (tendencia) => {
  const canvas = document.createElement("canvas");
  const ancho = 560;
  const alto = 240;
  const escala = 2;

  canvas.width = ancho * escala;
  canvas.height = alto * escala;

  const contexto = canvas.getContext("2d");
  contexto.scale(escala, escala);
  contexto.fillStyle = "#ffffff";
  contexto.fillRect(0, 0, ancho, alto);

  const margen = { top: 18, right: 18, bottom: 36, left: 48 };
  const areaAncho = ancho - margen.left - margen.right;
  const areaAlto = alto - margen.top - margen.bottom;
  const maxValor = 100;
  const espacio = areaAncho / tendencia.length;
  const anchoBarra = Math.min(38, espacio * 0.48);

  contexto.strokeStyle = "#e2e8f0";
  contexto.lineWidth = 1;
  contexto.font = "11px Arial";

  for (let i = 0; i <= 4; i += 1) {
    const valor = (maxValor / 4) * i;
    const y = margen.top + areaAlto - (valor / maxValor) * areaAlto;

    contexto.fillStyle = "#64748b";
    contexto.textAlign = "right";
    contexto.fillText(`${Math.round(valor)}%`, margen.left - 8, y + 4);

    contexto.beginPath();
    contexto.moveTo(margen.left, y);
    contexto.lineTo(ancho - margen.right, y);
    contexto.stroke();
  }

  contexto.strokeStyle = "#94a3b8";
  contexto.beginPath();
  contexto.moveTo(margen.left, margen.top);
  contexto.lineTo(margen.left, margen.top + areaAlto);
  contexto.lineTo(ancho - margen.right, margen.top + areaAlto);
  contexto.stroke();

  tendencia.forEach((item, index) => {
    const centroX = margen.left + espacio * index + espacio / 2;
    const alturaBarra = (item.valor / maxValor) * areaAlto;
    const x = centroX - anchoBarra / 2;
    const y = margen.top + areaAlto - alturaBarra;

    const gradiente = contexto.createLinearGradient(0, y, 0, margen.top + areaAlto);
    gradiente.addColorStop(0, "#1d4ed8");
    gradiente.addColorStop(1, "#3b82f6");

    contexto.fillStyle = gradiente;
    contexto.beginPath();
    contexto.roundRect(x, y, anchoBarra, alturaBarra, 6);
    contexto.fill();

    contexto.fillStyle = "#111827";
    contexto.font = "bold 11px Arial";
    contexto.textAlign = "center";
    contexto.fillText(`${item.valor}%`, centroX, y - 6);

    contexto.fillStyle = "#64748b";
    contexto.font = "bold 11px Arial";
    contexto.fillText(item.dia, centroX, alto - 14);
  });

  contexto.textAlign = "start";

  return canvas.toDataURL("image/png");
};

const CustomDot = (props) => {
  const { cx, cy, index } = props;
  if (!cx || !cy) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#2563eb"
      stroke="#ffffff"
      strokeWidth={2.5}
      style={{ animationDelay: `${0.6 + index * 0.08}s` }}
      className="trend-chart-dot"
    />
  );
};

const CustomActiveDot = (props) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <>
      <circle cx={cx} cy={cy} r={10} fill="rgba(37, 99, 235, 0.12)" stroke="none" />
      <circle cx={cx} cy={cy} r={6} fill="#2563eb" stroke="#ffffff" strokeWidth={3} />
    </>
  );
};

export default function AdminReportesAnalisis() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [garages, setGarages] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let montado = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [garRes, usuRes, resRes, sedesRes] = await Promise.all([
          GaragesGetAll(),
          UsuariosGetAll(),
          ReservasGetAll(),
          SedesGetAll(),
        ]);

        if (!montado) return;

        const garArray = obtenerListado(garRes.datos);
        const usuArray = obtenerListado(usuRes.datos);
        const resArray = obtenerListado(resRes.datos);

        const adminIdSede = Number(usuario?.id_sede);
        const empresaAdmin = Number(usuario?.id_empresa);
        const tieneEmpresa = !isNaN(empresaAdmin) && empresaAdmin > 0;

        let garagesFiltrados = garArray;
        let usuariosFiltrados = usuArray;
        let reservasFiltradas = resArray;

        if (adminIdSede) {
          garagesFiltrados = garArray.filter((g) => Number(g.id_sede ?? g.idSede) === adminIdSede);
          const userIds = new Set(
            usuArray.filter((u) => Number(u.id_sede ?? u.idSede) === adminIdSede).map((u) => Number(obtenerIdUsuario(u)))
          );
          usuariosFiltrados = usuArray.filter((u) => userIds.has(Number(obtenerIdUsuario(u))));
          const garageIds = new Set(garagesFiltrados.map((g) => Number(g.id_garage ?? g.idGarage ?? g.id)));
          reservasFiltradas = resArray.filter((r) => garageIds.has(Number(r.id_garage ?? r.idGarage ?? r.garage_id)));
        } else if (tieneEmpresa) {
          const sedesArray = obtenerListado(sedesRes.datos);
          const sedesIdsEmpresa = new Set(
            sedesArray.filter((s) => Number(s.id_empresa) === empresaAdmin).map((s) => Number(s.id))
          );
          garagesFiltrados = garArray.filter((g) => sedesIdsEmpresa.has(Number(g.id_sede ?? g.idSede)));
          const userIds = new Set(
            usuArray.filter((u) => Number(u.id_empresa ?? u.idEmpresa) === empresaAdmin).map((u) => Number(obtenerIdUsuario(u)))
          );
          usuariosFiltrados = usuArray.filter((u) => userIds.has(Number(obtenerIdUsuario(u))));
          const garageIds = new Set(garagesFiltrados.map((g) => Number(g.id_garage ?? g.idGarage ?? g.id)));
          reservasFiltradas = resArray.filter((r) => garageIds.has(Number(r.id_garage ?? r.idGarage ?? r.garage_id)));
        }

        setGarages(garagesFiltrados);
        setUsuarios(usuariosFiltrados);
        setReservas(reservasFiltradas);
      } catch (err) {
        console.error("Error al cargar datos de reportes:", err);
        if (montado) setError("Error al cargar los datos.");
      } finally {
        if (montado) setLoading(false);
      }
    };

    fetchData();
    return () => { montado = false; };
  }, [usuario]);

  const datosReporte = useMemo(() => {
    let totalOcupados = 0;
    let totalCapacidad = 0;
    garages.forEach((g) => {
      totalOcupados += Number(g.ocupacion_reservas || 0) + Number(g.ocupacion_no_reservas || 0);
      totalCapacidad += Number(g.capacidad_reservas || 0) + Number(g.capacidad_para_no_reservas || 0);
    });
    const ocupacionMedia = totalCapacidad > 0 ? Math.round((totalOcupados / totalCapacidad) * 100) : 0;

    const usuariosActivos = usuarios.filter((u) => u.activo !== false && Number(u.id_rol) !== 1).length;

    let totalHoras = 0;
    let count = 0;
    reservas.forEach((r) => {
      const entrada = r.fecha_entrada ?? r.fechaEntrada ?? r.fecha_inicio;
      const salida = r.fecha_salida ?? r.fechaSalida ?? r.fecha_fin;
      if (entrada && salida) {
        const diff = (new Date(salida) - new Date(entrada)) / (1000 * 60 * 60);
        if (diff > 0 && diff < 24) {
          totalHoras += diff;
          count++;
        }
      }
    });
    const tiempoPromedio = count > 0 ? `${(totalHoras / count).toFixed(1)} hrs` : "—";

    const horasCount = {};
    reservas.forEach((r) => {
      const entrada = r.fecha_entrada ?? r.fechaEntrada ?? r.fecha_inicio;
      if (entrada) {
        const hora = new Date(entrada).getHours();
        horasCount[hora] = (horasCount[hora] || 0) + 1;
      }
    });
    let mejorRango = "";
    let mejorSuma = 0;
    for (let h = 0; h <= 22; h++) {
      const suma = (horasCount[h] || 0) + (horasCount[h + 1] || 0);
      if (suma > mejorSuma) {
        mejorSuma = suma;
        mejorRango = `${String(h).padStart(2, "0")}:00 - ${String(h + 2).padStart(2, "0")}:00`;
      }
    }
    const horasPico = mejorRango || "—";

    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const diaCount = [0, 0, 0, 0, 0, 0, 0];
    reservas.forEach((r) => {
      const entrada = r.fecha_entrada ?? r.fechaEntrada ?? r.fecha_inicio;
      if (entrada) {
        const dia = new Date(entrada).getDay();
        diaCount[dia]++;
      }
    });
    const maxCount = Math.max(...diaCount, 1);
    const tendencia = diasSemana.map((dia, i) => ({
      dia,
      valor: Math.round((diaCount[i] / maxCount) * 100),
    }));

    return { ocupacionMedia, usuariosActivos, tiempoPromedio, horasPico, tendencia };
  }, [garages, usuarios, reservas]);

  const exportarExcel = async () => {
    if (loading) return;
    const graficoTendencia = generarGraficoTendenciaPng(datosReporte.tendencia);
    await exportarReporteExcel(datosReporte, { graficoTendencia });
  };

  const kpis = [
    {
      label: "Ocupacion Media",
      value: loading ? "—" : `${datosReporte.ocupacionMedia}%`,
      icon: BarChart3,
      color: "#1d4ed8",
      bg: "#eff6ff",
    },
    {
      label: "Usuarios Activos",
      value: loading ? "—" : datosReporte.usuariosActivos.toLocaleString(),
      icon: Users,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Tiempo Promedio",
      value: loading ? "—" : datosReporte.tiempoPromedio,
      icon: Clock,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      label: "Horas Pico",
      value: loading ? "—" : datosReporte.horasPico,
      icon: Zap,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  return (
    <div className="admin-panel admin-reportes-page">
      <Header />
      <header className="admin-panel__header">
        <button
          className="admin-panel__back-btn"
          onClick={() => navigate("/admin_panel_de_control", { replace: true })}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="admin-panel__title">Reportes y Analisis</h1>
          <p className="admin-panel__subtitle">
            Visualiza el rendimiento general y descarga auditorias del sistema.
          </p>
        </div>
      </header>

      {loading ? (
        <ReportesSkeleton />
      ) : (
        <>
          <section className="reportes-section">
            <div className="export-actions">
              <button className="report-btn report-btn--excel" onClick={exportarExcel} disabled={loading}>
                <div className="report-btn__icon-wrapper">
                  <FileText size={24} className="report-btn__icon" />
                </div>
                <div className="report-btn__content">
                  <span className="report-btn__title">Exportar a Excel</span>
                  <span className="report-btn__subtitle">Descargar reporte en XLSX</span>
                </div>
              </button>
            </div>
          </section>

          {error && (
            <p style={{ color: "#dc2626", padding: "12px 0", fontWeight: 600 }} role="alert">
              {error}
            </p>
          )}

          <section className="kpi-grid">
            {kpis.map((kpi, i) => (
              <article className="kpi-card" key={kpi.label} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <div className="kpi-card__header">
                  <div className="kpi-card__icon-wrapper" style={{ backgroundColor: kpi.bg, color: kpi.color }}>
                    <kpi.icon size={22} />
                  </div>
                  <span className="kpi-card__label">{kpi.label}</span>
                </div>
                <span className="kpi-card__value">{kpi.value}</span>
              </article>
            ))}
          </section>

          <section className="reportes-section">
            <div className="reportes-section__title-container">
              <TrendingUp size={20} className="reportes-section__icon" />
              <h2 className="reportes-section__title">Tendencia de Ocupacion</h2>
            </div>
            <div className="trend-chart-wrapper">
              <div className="trend-chart-accent" />
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={datosReporte.tendencia} margin={{ top: 16, right: 12, left: -8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="40%" stopColor="#3b82f6" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="areaStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <filter id="areaGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="dia"
                    tick={{ fontSize: 13, fill: "#64748b", fontWeight: 600, letterSpacing: "0.02em" }}
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-4}
                    width={40}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="url(#areaStroke)"
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                    filter="url(#areaGlow)"
                    animationDuration={1200}
                    animationEasing="ease-out"
                    dot={<CustomDot />}
                    activeDot={CustomActiveDot}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="trend-chart-footer">
                <span className="trend-chart-footer__dot" />
                <span>Ocupación promedio por día de la semana</span>
              </div>
            </div>
          </section>
        </>
      )}

      <FooterEmpleado />
    </div>
  );
}
