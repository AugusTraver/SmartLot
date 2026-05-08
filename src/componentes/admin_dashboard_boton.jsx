function DashboardBoton({ titulo, descripcion, onClick,icono }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="dashboard-icon">{icono}</div>
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </div>
  );
}

export default DashboardBoton;