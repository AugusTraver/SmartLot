import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  BarChart3, 
  FileText, 
  Download, 
  TrendingUp 
} from 'lucide-react';
import "./admin_panel_de_control.css"; // Comparten base de layout del panel
       // El CSS purificado sin :root que creamos recién

export default function AdminReportesAnalisis() {
  const navigate = useNavigate();

  const handleDownload = (tipo) => {
    console.log(`Iniciando descarga de reporte en formato: ${tipo}`);
    // Aquí irá la lógica de tu API para descargar o generar el PDF/Excel
  };

  return (
    <div className="admin-panel">
      {/* Encabezado */}
      <header className="admin-panel__header">
        <button 
          className="admin-panel__back-btn" 
          onClick={() => navigate("/admin_panel_de_control", { replace: true })}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="admin-panel__title">Reportes y Análisis</h1>
        <p className="admin-panel__subtitle">
          Visualiza el rendimiento general y descarga auditorías del sistema.
        </p>
      </header>

      {/* Columna / Sección de Métricas Rápidas en Reportes */}
      <section className="stats-card">
        <div className="stats-card__header">
          <span className="stats-card__label">Eficiencia de Plazas</span>
          <TrendingUp className="stats-card__icon" />
        </div>
        <div className="stats-card__value">92%</div>
        <div className="stats-card__progress-container">
          <div className="stats-card__progress-bar" style={{ width: '92%' }} />
        </div>
      </section>

      {/* Sección donde se integra tu nuevo Botón Premium */}
      <section className="conflicts-section">
        <div className="conflicts-section__title-container">
          <FileText size={20} className="conflicts-section__alert-icon" style={{ color: '#1d4ed8' }} />
          <h2 className="conflicts-section__title">Exportar Datos</h2>
        </div>

        <div className="conflicts-section__list">
          {/* El botón solicitado integrado nativamente */}
          <button 
            className="report-btn" 
            onClick={() => handleDownload('GENERAL_MUTIPLE')}
          >
            <div className="report-btn__icon-wrapper">
              <BarChart3 size={24} className="report-btn__icon" />
            </div>
            <div className="report-btn__content">
              <span className="report-btn__title">Ver Reportes</span>
              <span className="report-btn__subtitle">Descargar informes en PDF/Excel</span>
            </div>
          </button>

          {/* Tarjeta de soporte o acciones adicionales de reportes para rellenar el layout */}
          <article className="conflict-card" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="conflict-card__main-info">
              <div className="conflict-card__icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                <Download size={20} />
              </div>
              <div className="conflict-card__meta">
                <div className="conflict-card__header">
                  <h3 className="conflict-card__title" style={{ color: '#15803d' }}>Cierre del Mes</h3>
                  <span className="conflict-card__badge" style={{ backgroundColor: 'rgba(187, 247, 208, 0.4)', color: '#15803d' }}>Listo</span>
                </div>
                <p className="conflict-card__location" style={{ color: 'rgba(21, 128, 61, 0.7)' }}>Periodo Actual</p>
              </div>
            </div>
            <p className="conflict-card__description">
              El informe consolidado de auditoría de ocupación y reservas está optimizado.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}