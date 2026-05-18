import logo from "../Imagenes/Logo_smartlot.png";
import "./header_admin.css";
import { FaRegBell } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";  

function Header() {

  return (

    <div className="header">
      <div className="header-left">

        <div className="logo-smartlot">
          <img src={logo} alt="logo SmartLot" />
        </div>
        <h1 className="titulo-header">
          SmartLot
        </h1>
      </div>
      <div className="header-right">
         <FaRegBell  size={30} color="black" />
         <RxAvatar  size={40} color="black" />
         
       
     </div>
    </div>
  );
}

export default Header;