import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReportesActivos from '../components/reportes/ComponentePrestamosActivos';

const ReporteActivosContainer = () => {
  const [prestamosa, setPrestamos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/prestamosactivos");
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
      <ReportesActivos prestamosa={prestamosa} />
    </div>
  );
};

export default ReporteActivosContainer;