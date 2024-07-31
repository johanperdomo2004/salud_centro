import React, { useState, useEffect, useRef } from "react";
import logo from "../../public/img/salud.png";
import { FaRegBell, FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axiosClient from "../components/config/axiosClient";
import { fetchCountersData, NotificationsModal } from "./modals/Notificaciones";
import { FormUpdatePerfil } from "../functions/Update/UpdatePerfil/FormUpdatePerfil";
import { useAuth } from "../context/AuthProvider";
import { CiEdit, CiUnlock } from "react-icons/ci";
import Modal1 from "./Modal1";
import { FormUpdateContraseña } from "../functions/Update/UpdateContraseña/FormUpdateContraseña";

export const Navbar = ({ setLogIn }) => {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [activeForm, setActiveForm] = useState('');
  const profileRef = useRef(null);

  const openModal = (formType) => {
    setActiveForm(formType);
    setIsOpen(true);
  };

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    swal({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que deseas cerrar la sesión?",
      icon: "warning",
      buttons: ["No", "Sí"],
      dangerMode: true,
    }).then((willLogout) => {
      if (willLogout) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        logout();
        navigate("/login");
      }
    });
  };

  const ListarUsuario = async () => {
    try {
      const response = await axiosClient.get('usuario/listar');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const countersData = await fetchCountersData();
      const unread = countersData.filter(item => item.status > 0).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    ListarUsuario();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserName = localStorage.getItem("userName");
      const storedRole = localStorage.getItem("role");

      if (storedUserName) {
        setUserName(storedUserName);
      }

      if (storedRole) {
        setRole(storedRole);
      }
    };

    fetchData();
    const intervalId = setInterval(async () => {
      await fetchNotifications();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setLogIn]);

  const handleNotificationsClick = () => {
    setShowModal(!showModal);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowEditProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-between h-[80px] bg-[#fff] text-white">
      <div className="flex items-center gap-4">
        <img src={logo} className="w-[110px] h-auto ml-5" alt="logo" />
        <h1 className="hidden sm:block text-black font-bold text-lg">Inventario de salud</h1>
      </div>
      <div className="flex items-center gap-4 mr-10">
        <div className="text-black flex items-center gap-2 relative" ref={profileRef}>
          <FaUserCircle
            className="text-[38px] cursor-pointer"
            onClick={() => setShowEditProfile(!showEditProfile)}
          />
          {showEditProfile && (
            <div className="absolute w-[230px] top-[60px] right-0 z-20 bg-white border border-gray-300 rounded-md shadow-lg p-4">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 w-full mb-2 px-2 py-[3px] rounded-xl transition-all"
                onClick={() => openModal('editProfile')}
              >
                <CiEdit className="text-gray-500 text-2xl" />
                <h1 className="font-bold text-[13px] hover:text-gray-500">Editar Perfil</h1>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 px-2 py-[3px] rounded-xl transition-all"
                onClick={() => openModal('changePassword')}
              >
                <CiUnlock className="text-gray-500 text-2xl" />
                <h1 className="font-bold text-[13px] hover:text-gray-500">Cambiar Contraseña</h1>
              </div>
            </div>
          )}
          <Modal1
            title={activeForm === 'editProfile' ? 'Editar Perfil' : 'Cambiar Contraseña'}
            size={activeForm === 'editProfile' ? '2xl' : 'sm'}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            form={
              activeForm === 'editProfile' ? (
                <FormUpdatePerfil onClose={() => setIsOpen(false)} Listar={ListarUsuario} />
              ) : (
                <FormUpdateContraseña onClose={() => setIsOpen(false)} />
              )
            }
          />
          <div className="flex flex-col gap-1 mt-3">
            <h1 className="cursor-pointer font-bold text-[16px]">{userName}</h1>
            <p className="flex text-xs">
              {role === "1" && "Administrador"}
              {role === "2" && "Encargado"}
              {role === "3" && "Usuario"}
            </p>
          </div>
        </div>
        {role !== "3" && (
          <div className="relative cursor-pointer" onClick={handleNotificationsClick}>
            <FaRegBell className="flex text-black text-[25px] top-1 right-[28px] bottom-[28px]" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 rounded-full text-white font-bold px-2 py-1 text-xs">
                {unreadCount}
              </span>
            )}
          </div>
        )}
        <div>
          <IoMdLogOut className='cursor-pointer text-black text-[30px] font-bold' onClick={handleLogout} />
        </div>
      </div>
      {unreadCount > 0 && (
        <NotificationsModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};