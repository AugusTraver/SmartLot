function Buttom({ Contenido, onClick }) {
  return (
   <button type="button" onClick={onClick} className="u-full-width button-primary">
      {Contenido}
   </button>
  );
}

export default Buttom;