function FooterBotton({ titulo, icono, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`footer-item ${isActive ? "active" : ""}`}
    >
      {icono}
      <span>{titulo}</span>
    </div>
  );
}

export default FooterBotton;
