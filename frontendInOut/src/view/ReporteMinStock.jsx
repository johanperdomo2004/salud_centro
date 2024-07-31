import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReporteStockMin from '../components/reportes/ComponenteStockMin';

const ReporteStockMinContainer = () => {
  const [stockmin, setElementos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/stockmin");
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
      <ReporteStockMin stockmin={stockmin} />
    </div>
  );
};

export default ReporteStockMinContainer;