function FooterBotton({ titulo, icono, onClick, isActive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`footer-item ${isActive ? "active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      aria-label={titulo}
    >
      {icono}
      <span>{titulo}</span>
    </button>
  );
}

export default FooterBotton;
