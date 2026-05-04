function dashboard_boton({ titulo, descripcion, onClick }) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {titulo}
        <p className="text-sm">{descripcion}</p>
    </button>
  );
}
export default dashboard_boton;