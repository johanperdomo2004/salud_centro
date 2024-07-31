import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReportesVencidos from '../components/reportes/ComponentePrestamosVencidos';

const ReporteVencidosContainer = () => {
  const [prestamosv, setPrestamos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/prestamosvencidos");
      setPrestamos(response.data);
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
      <ReportesVencidos prestamosv={prestamosv} />
    </div>
  );
};

export default ReporteVencidosContainer;