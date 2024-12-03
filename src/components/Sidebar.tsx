import { useState } from "react";
import stylesComponents from "./stylesComponents/Sidebar.module.css";
import { supabase } from "../DataBase/Client";
import { useNavigate } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { RiBillLine } from "react-icons/ri";
import { MdInventory, MdAccountBalance } from "react-icons/md";
import { MdPeopleAlt, MdOutlineInventory } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

const Sidebar = () => {
  const [isModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      {/* Sidebar normal para pantallas grandes */}
      <div
        className={`${stylesComponents.Sidebar} ${
          isModalOpen ? stylesComponents.hidden : ""
        }`}
      >
        <ul>
          <li>
            <a href="/inicio">
              <IoHomeSharp />
              Inicio
            </a>
          </li>
          <li>
            <a href="/cliente">
              <MdPeopleAlt />
              Cliente
            </a>
          </li>
          <li>
            <a href="/factura">
              <RiBillLine />
              Facturas
            </a>
          </li>
          <li>
            <a href="/inventario">
              <MdInventory />
              Inventario
            </a>
          </li>
          <li>
            <a href="/proveedor">
              <MdOutlineInventory />
              Proveedor
            </a>
          </li>
          <li>
            <a href="/contabilidad">
              <MdAccountBalance />
              Contabilidad
            </a>
          </li>
        </ul>
        <button onClick={handleClick} className={stylesComponents.logoutButton}>
          Salir
          <CiLogout />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
