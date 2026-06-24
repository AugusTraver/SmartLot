import React from 'react';
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

export default function AdminReportesAnalisis() {
  const navigate = useNavigate();

  const exportarExcel = () => {
    const filas = [
      ["Metrica", "Valor"],
      ["Ocupacion Media", `${datosReporte.ocupacionMedia}%`],
      ["Usuarios Activos", datosReporte.usuariosActivos],
      ["Tiempo Promedio", datosReporte.tiempoPromedio],
      ["Horas Pico", datosReporte.horasPico],
      [],
      ["Tendencia Diaria"],
      ["Dia", "Ocupacion (%)"],
      ...datosReporte.tendencia.map(d => [d.dia, d.valor]),
    ];

    const bom = "\uFEFF";
    const csv = bom + filas.map(f => f.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_smartlot.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <h1 className="admin-panel__title">Reportes y Analisis</h1>
        <p className="admin-panel__subtitle">
          Visualiza el rendimiento general y descarga auditorias del sistema.
        </p>
      </header>

      <section className="reportes-section">
        <div className="reportes-section__title-container">
          <Download size={20} className="reportes-section__icon" />
          <h2 className="reportes-section__title">Exportar Datos</h2>
        </div>
        <div className="export-actions">
          <button
            className="report-btn"
            onClick={() => console.log("Ver Reportes")}
          >
            <div className="report-btn__icon-wrapper">
              <BarChart3 size={24} className="report-btn__icon" />
            </div>
            <div className="report-btn__content">
              <span className="report-btn__title">Ver Reportes</span>
              <span className="report-btn__subtitle">Descargar informes en PDF/Excel</span>
            </div>
          </button>
          <button className="report-btn report-btn--excel" onClick={exportarExcel}>
            <div className="report-btn__icon-wrapper">
              <FileText size={24} className="report-btn__icon" />
            </div>
            <div className="report-btn__content">
              <span className="report-btn__title">Exportar a Excel</span>
              <span className="report-btn__subtitle">Descargar reporte en CSV</span>
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
