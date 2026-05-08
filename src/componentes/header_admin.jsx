import logo from "../Imagenes/Logo_smartlot.png";
import "./header_admin.css";

function Header() {

  return (

    <div className="header">

      {/* IZQUIERDA */}
      <div className="header-left">

        <div className="logo-smartlot">
          <img src={logo} alt="logo SmartLot" />
        </div>

        <h1 className="titulo-header">
          SmartLot
        </h1>

      </div>


      {/* DERECHA */}
      <div className="header-right">

        <span>🔔</span>

        <span>👤</span>

      </div>

    </div>
  );
}

export default Header;