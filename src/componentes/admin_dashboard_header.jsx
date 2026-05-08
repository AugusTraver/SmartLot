import logo from "../Imagenes/sl_logo.png";
function Header() {
  return (
    <div className="header">
    {/*  <div className="logo-smartlot"><img src={logo} alt="logo Smarlot" /></div> */}
      <div className="logo">SmartLot</div>
      <div className="header-icons">
        🔔 👤
      </div>
    </div>
  );
}

export default Header;