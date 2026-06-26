import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import "./admin_reportes_analisis.css";
import Header from '../componentesAdmin/header_admin';
import FooterEmpleado from '../componentesAdmin/footer_admin';
import { exportarReporteExcel } from '../util/exportar_reportes_excel';


const datosReporte = {
  ocupacionMedia: 72.4,
  usuariosActivos: 1284,
  tiempoPromedio: "4.2 hrs",
  horasPico: "14:00 - 18:00",
  tendencia: [
    { dia: "Lun", valor: 65 },
    { dia: "Mar", valor: 70 },
    { dia: "Mie", valor: 68 },
    { dia: "Jue", valor: 75 },
    { dia: "Vie", valor: 82 },
    { dia: "Sab", valor: 78 },
    { dia: "Dom", valor: 55 },
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="trend-tooltip">
        <span className="trend-tooltip__label">{label}</span>
        <span className="trend-tooltip__value">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

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

export default function AdminReportesAnalisis() {
  const navigate = useNavigate();

  const exportarExcel = async () => {
    const graficoTendencia = generarGraficoTendenciaPng(datosReporte.tendencia);

    await exportarReporteExcel(datosReporte, { graficoTendencia });
  };

  const kpis = [
    {
      label: "Ocupacion Media",
      value: `${datosReporte.ocupacionMedia}%`,
      icon: BarChart3,
      color: "#1d4ed8",
      bg: "#eff6ff",
    },
    {
      label: "Usuarios Activos",
      value: datosReporte.usuariosActivos.toLocaleString(),
      icon: Users,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "Tiempo Promedio",
      value: datosReporte.tiempoPromedio,
      icon: Clock,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      label: "Horas Pico",
      value: datosReporte.horasPico,
      icon: Zap,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  return (
    <div className="admin-panel">
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

      <section className="reportes-section">

        <div className="export-actions">

          <button className="report-btn report-btn--excel" onClick={exportarExcel}>
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
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={datosReporte.tendencia} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(29, 78, 216, 0.06)" }} />
              <Bar
                dataKey="valor"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                fill="url(#barGradient)"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <FooterEmpleado />
    </div>
  );
}
