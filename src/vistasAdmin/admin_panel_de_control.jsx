import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  AlertTriangle,
  UserX,
  CalendarX
} from 'lucide-react';
import "./admin_panel_de_control.css";
import Header from '../componentesAdmin/header_admin';
import FooterEmpleado from '../componentesAdmin/footer_admin';
import BotonReportes from "../componentesAdmin/boton_reportes";
import TablaReservasPanleControl from "../componentesAdmin/tabla_reservas_panelControl";

export default function AdminPanelControl() {
  const navigate = useNavigate();

  return (
    <div className="admin-panel">
      <Header />
      <header className="admin-panel__header">
        <button
          className="boton-back"
          onClick={() => navigate("/admin_dashboard", { replace: true })}
        >
          <ArrowLeft size={24} />
        </button>

        <div className='textoPanelControl'>
          <h1 className="admin-panel__title">Panel de Control</h1>
          <p className="admin-panel__subtitle">
            Supervisión general de reservas y estados de ocupación.
          </p>
        </div>
      </header>



      {/* Tarjeta de Métrica Principal */}
      <section className="stats-card">
        <div className="stats-card__header">
          <span className="stats-card__label">Ocupación Total</span>
          <BarChart3 className="stats-card__icon" />
        </div>
        <div className="stats-card__value">84%</div>
        <div className="stats-card__progress-container">
          <div className="stats-card__progress-bar" />
        </div>
      </section>

      {/* Listado de Conflictos */}
      <section className="conflicts-section">
        <div className="conflicts-section__title-container">
          <AlertTriangle className="conflicts-section__alert-icon" />
          <h2 className="conflicts-section__title">
            Conflictos detectados (2)
          </h2>
        </div>

        <div className="conflicts-section__list">
          {/* Conflicto 1: Duplicidad */}
          <article className="conflict-card">
            <div className="conflict-card__main-info">
              <div className="conflict-card__icon-wrapper">
                <UserX size={20} />
              </div>
              <div className="conflict-card__meta">
                <div className="conflict-card__header">
                  <h3 className="conflict-card__title">Duplicidad de Plaza</h3>
                  <span className="conflict-card__badge">Crítico</span>
                </div>
                <p className="conflict-card__location">Plaza A-12 • Zona Norte</p>
              </div>
            </div>

            <p className="conflict-card__description">
              Carlos Ruiz y Marta Gil asignados a la misma plaza para el 24 de Octubre.
            </p>

            <div className="conflict-card__actions">
              <button className="conflict-card__btn conflict-card__btn--primary">
                Reasignar Marta
              </button>
              <button className="conflict-card__btn conflict-card__btn--secondary">
                Ver Detalles
              </button>
            </div>
          </article>

          {/* Conflicto 2: Sobrecapacidad */}
          <article className="conflict-card">
            <div className="conflict-card__main-info">
              <div className="conflict-card__icon-wrapper">
                <CalendarX size={20} />
              </div>
              <div className="conflict-card__meta">
                <div className="conflict-card__header">
                  <h3 className="conflict-card__title">Sobrecapacidad Zona VIP</h3>
                  <span className="conflict-card__badge">Crítico</span>
                </div>
                <p className="conflict-card__location">Zona VIP • 12:00 - 15:00</p>
              </div>
            </div>

            <p className="conflict-card__description">
              Demanda excede plazas disponibles en un 15% para el turno de tarde.
            </p>

            <div className="conflict-card__actions">
              <button className="conflict-card__btn conflict-card__btn--primary">
                Abrir lista de espera
              </button>
              <button className="conflict-card__btn conflict-card__btn--secondary">
                Ajustar
              </button>
            </div>
          </article>

        </div>
          <div>
            <TablaReservasPanleControl />
          </div>
          <div>
            <BotonReportes />
          </div>
      </section>
      <FooterEmpleado />
    </div>
  );
}