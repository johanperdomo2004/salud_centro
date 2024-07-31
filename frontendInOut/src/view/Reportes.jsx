import React from "react";
import { useNavigate } from "react-router-dom";
import elementosImg from "../assets/tools.png";
import usuariosImg from "../assets/team.png";
import bodegasImg from "../assets/min_stock.png";
import movimientosImg from "../assets/move.png";
import elementosInactivosImg from "../assets/student.png";
import elementosTImg from "../assets/inventory.png";
import prestamosImg from "../assets/transaction.png";
import vencidosImg from "../assets/due-date.png";
import { BiBarChartSquare } from "react-icons/bi";
import elementosexpiradosImg from "../assets/expiration-date.png"; // descargas FlatIcon

const Reportes = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Reporte",
      img: prestamosImg,
      text: "de Préstamos",
      path: "/reportes/prestamos",
    },
    {
      title: "Reporte",
      img: elementosTImg,
      text: "de Elementos",
      path: "/reportes/elementos",
    },
    {
      title: "Reporte",
      img: bodegasImg,
      text: "Elementos bajo stock",
      path: "/reportes/stockmin",
    },
    {
      title: "Reporte",
      img: usuariosImg,
      text: "Solicitudes",
      path: "/reportes/solicitud",
    },
    {
      title: "Reporte",
      img: movimientosImg,
      text: "de Movimientos",
      path: "/reportes/movimientos",
    },
    {
      title: "Reporte",
      img: elementosInactivosImg,
      text: "Elementos Desactivados",
      path: "/reportes/elementosdesactivados",
    },
    {
      title: "Reporte",
      img: elementosImg,
      text: "de Préstamos Activos",
      path: "/reportes/prestamosactivos",
    },
    {
      title: "Reporte",
      img: vencidosImg,
      text: "Préstamos Vencidos",
      path: "/reportes/prestamosvencidos",
    },
    {
      title: "Reporte",
      img: elementosexpiradosImg,
      text: "Elementos Expirados",
      path: "/reportes/elementosexpirados",
    },
  ];

  return (
    <div className="container justify-center p-5 h-full flex flex-wrap overflow-hidden animate-slide-in-right">
      <div className="flex flex-wrap w-full h-full items-center justify-center">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="flex flex-col m-2 items-center justify-center w-full h-full rounded font-sans text-sm uppercase text-green-800 shadow-md transition-all hover:shadow-lg hover:shadow-blue-400 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none font-semibold cursor-pointer"
            style={{ width: "calc(25% - 8px)", height: "calc(35% - 8px)" }}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-[80px] rounded-t translate-y-[-25%]"
            />
            <h2>{item.title}</h2>
            <p className="text-center">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="absolute right-[5px] bottom-[5px]">
        <button
          onClick={() => navigate("/estadistica")}
          className="flex text-blue-900 items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-100"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
        >
          <BiBarChartSquare className="mr-1" size={24} />
          Estadística
        </button>
      </div>
    </div>
  );
};

export default Reportes;
