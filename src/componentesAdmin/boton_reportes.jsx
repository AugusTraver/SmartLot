import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import "./boton_reportes.css";

export default function BotonReportes() {
  const navigate = useNavigate();

  return (
    <button className="report-btn" onClick={() => navigate("/admin_reportes_analisis", { replace: true })}>
      <div className="report-btn__icon-wrapper">
        <BarChart3 size={18} className="report-btn__icon" />
      </div>
      <div className="report-btn__content">
        <span className="report-btn__title">Ver Reportes</span>
        <span className="report-btn__subtitle">Descargar informes en PDF/Excel</span>
      </div>
    </button>
  );
}