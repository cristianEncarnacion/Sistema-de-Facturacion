import { useState, useEffect } from "react";
import stylesComponents from "./stylesComponents/Navbar.module.css";
import { supabase } from "../DataBase/Client";
import { RiAccountCircleFill } from "react-icons/ri";
import { CiMenuBurger } from "react-icons/ci";
import { IoHomeSharp } from "react-icons/io5";
import { MdPeopleAlt, MdInventory } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { MdOutlineInventory, MdAccountBalance } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail("");
      }
    };

    fetchUser();
  }, []);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleClick = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className={stylesComponents.nav}>
      {/* Ícono de menú en pantallas pequeñas */}
      <div className={stylesComponents.menuIcon} onClick={toggleModal}>
        <CiMenuBurger />
      </div>
      <div className={stylesComponents.welcomeMessage}>
        {userEmail}
        <RiAccountCircleFill />
      </div>
      {/* Modal para pantallas pequeñas */}
      {isModalOpen && (
        <div className={stylesComponents.modal}>
          <div className={stylesComponents.modalContent}>
            <span className={stylesComponents.close} onClick={toggleModal}>
              &times;
            </span>
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
              <button
                onClick={handleClick}
                className={stylesComponents.logoutButton}
              >
                Salir
                <CiLogout />
              </button>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
