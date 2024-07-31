import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch, BiX, BiTrash } from "react-icons/bi";
import axiosClient from "../config/axiosClient";

export const fetchCountersData = async () => {
  try {
    const countersResponse = await axiosClient.get("/counter/get");
    return countersResponse.data;
  } catch (error) {
    throw error;
  }
};

export const NotificationsModal = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();

  const [stockMinData, setStockMinData] = useState(null);
  const [vencidosData, setVencidosData] = useState(null);
  const [solicitudesData, setSolicitudesData] = useState(null);
  const [expiradosData, setExpiradosData] = useState(null);
  const [countersData, setCountersData] = useState([]);

  const [showStockMin, setShowStockMin] = useState(true);
  const [showVencidos, setShowVencidos] = useState(true);
  const [showSolicitudes, setShowSolicitudes] = useState(true);
  const [showExpirados, setShowExpirados] = useState(true);

  useEffect(() => {
    if (showModal) {
      const fetchData = async () => {
        try {
          const stockMinResponse = await axiosClient.get(
            "/reporte/stockminmodal"
          );
          const vencidosResponse = await axiosClient.get(
            "/reporte/prestamosvencidosmodal"
          );
          const solicitudesResponse = await axiosClient.get(
            "/reporte/solicitudesmodal"
          );
          const expiradosResponse = await axiosClient.get(
            "/reporte/elementosexpiradosmodal"
          );
          const countersResponse = await axiosClient.get("/counter/get");

          setStockMinData(stockMinResponse.data);
          setVencidosData(vencidosResponse.data);
          setSolicitudesData(solicitudesResponse.data);
          setExpiradosData(expiradosResponse.data);
          setCountersData(countersResponse.data);
        } catch (error) {
          swal({
            title: "Error",
            text: error.response.data.message,
            icon: `warning`,
            buttons: true,
            timer: 2000,
          });
        }
      };

      fetchData();
    }
  }, [showModal]);

  const handleViewClick = async (navigateRoute) => {
    try {
      navigate(navigateRoute);
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: `warning`,
        buttons: true,
        timer: 2000,
      });
    }
  };

  const handleViewClose = async (resetRoute, setShowFunction) => {
    try {
      await axiosClient.post(resetRoute);
      setShowFunction(false);
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: `warning`,
        buttons: true,
        timer: 2000,
      });
    }
  };

  const shouldShowStockMin = countersData.some(
    (item) => item.counter_name === "low_stock" && item.status > 0
  );
  const shouldShowVencidos = countersData.some(
    (item) => item.counter_name === "loans_due" && item.status > 0
  );
  const shouldShowSolicitudes = countersData.some(
    (item) => item.counter_name === "requesteds" && item.status > 0
  );
  const shouldShowExpirados = countersData.some(
    (item) => item.counter_name === "date_expired" && item.status > 0
  );

  return (
    showModal && (
      <div className="absolute top-4 right-[70px] z-50 w-[290px] animate-cascade-slide-down">
        <div
          className="fixed top-9 right-11 bottom-0 bg-gray-500 bg-opacity-50 cursor-pointer"
          onClick={() => setShowModal(false)}
        />
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <h2 className="flex text-l text-black font-bold mb-3 justify-center">
            Notificaciones
            <span
              className="ml-2 cursor-pointer"
              onClick={() => setShowModal(false)}
            ></span>
          </h2>

          {shouldShowVencidos && showVencidos && (
            <div className="flex justify-between w-[265px] ">
              <div
                className="flex items-center hover:text-blue-600 p-2 text-sm rounded cursor-pointer transition duration-200"
                style={{ boxShadow: "inset 0 0 0 2px " }}
                onClick={() => handleViewClick("/reportes/prestamosvencidos", setShowModal(false))}
              >
                <div className="text-blue-700 font-bold mr-2 w-[25px]">
                  {vencidosData}
                </div>
                <p className="flex-1 text-black w-[157px]">
                  Préstamos vencidos
                </p>
                <BiSearch className="text-blue-900 ml-2" />
              </div>
              <div
                className="text-blue-700 hover:text-red-600 p-2 text-lg rounded cursor-pointer transition duration-200"
                onClick={() => handleViewClose("/counter/resetloans", setShowVencidos)}
              >
                <BiTrash />
              </div>
            </div>
          )}
          {shouldShowSolicitudes && showSolicitudes && (
            <div className="flex justify-between w-[265px] ">
              <div
                className="flex items-center hover:text-blue-600 p-2 text-sm rounded cursor-pointer transition duration-200"
                style={{ boxShadow: "inset 0 0 0 2px " }}
                onClick={() =>
                  handleViewClick("/movimientos", setShowModal(false))}
              >
                <div className="text-blue-700 font-bold mr-2 w-[25px]">
                  {solicitudesData}
                </div>
                <p className="flex-1 text-black w-[157px]">
                  Solicitudes pendientes
                </p>
                <BiSearch className="text-blue-900 ml-2" />
              </div>
              <div
                className="text-blue-700 hover:text-red-600 p-2 text-lg rounded cursor-pointer transition duration-200"
                onClick={() => handleViewClose("/counter/resetrequesteds", setShowSolicitudes)}
              >
                <BiTrash />
              </div>
            </div>
          )}
          {shouldShowExpirados && showExpirados && (
            <div className="flex justify-between w-[265px] ">
              <div
                className="flex items-center hover:text-blue-600 p-2 text-sm rounded cursor-pointer transition duration-200"
                style={{ boxShadow: "inset 0 0 0 2px " }}
                onClick={() => handleViewClick("/reportes/elementosexpirados", setShowModal(false))}
              >
                <div className="text-blue-700 font-bold mr-2 w-[25px]">
                  {expiradosData}
                </div>
                <p className="flex-1 text-black w-[157px]">
                  Elementos expirados
                </p>
                <BiSearch className="text-blue-900 ml-2" />
              </div>
              <div
                className="text-blue-700 hover:text-red-600 p-2 text-lg rounded cursor-pointer transition duration-200"
                onClick={() => handleViewClose("/counter/resetexpired", setShowExpirados)}
              >
                <BiTrash />
              </div>
            </div>
          )}
          {shouldShowStockMin && showStockMin && (
            <div className="flex justify-between w-[265px] ">
              <div
                className="flex items-center hover:text-blue-600 p-2 text-sm rounded cursor-pointer transition duration-200"
                style={{ boxShadow: "inset 0 0 0 2px " }}
                onClick={() => handleViewClick("/reportes/stockmin", setShowModal(false))}
              >
                <div className="text-blue-700 font-bold mr-2 w-[25px]">
                  {stockMinData}
                </div>
                <p className="flex-1 text-black">
                  Elementos con bajo stock
                </p>
                <BiSearch className="text-blue-900 ml-2" />
              </div>
              <div
                className="text-blue-700 hover:text-red-600 p-2 text-lg rounded cursor-pointer transition duration-200"
                onClick={() => handleViewClose("/counter/resetstock", setShowStockMin)}
              >
                <BiTrash />
              </div>
            </div>
          )}
          <div className="absolute top-1 right-4 justify-center mt-2">
            <button
              className="bg-red-400 hover:text-red-500 shadow-xl font-extrabold px-2 py-2 rounded-full"
              style={{ boxShadow: "inset 0 0 0 2px " }}
              onClick={() => setShowModal(false)}
            >
              <BiX className="text-white font-bold" />
            </button>
          </div>
        </div>
      </div>
    )
  );
};


export default NotificationsModal;
