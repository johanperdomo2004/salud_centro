import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReporteMovimientos from '../components/reportes/ComponenteMovimientos';

const ReporteMovimientosContainer = () => {
  const [movimientos, setElementos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/movimientos");
      setElementos(response.data);
    } catch (error) {
      console.error(
        "Error al obtener la información:",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 4000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <ReporteMovimientos movimientos={movimientos} />
    </div>
  );
};

export default ReporteMovimientosContainer;