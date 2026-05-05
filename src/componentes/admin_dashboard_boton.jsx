function DashboardBoton({ titulo, descripcion, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="dashboard-icon">📌</div>
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
    </div>
  );
}

export default DashboardBoton;