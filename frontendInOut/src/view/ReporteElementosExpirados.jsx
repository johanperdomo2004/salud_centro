import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReporteElementosEX from '../components/reportes/ComponenteElementosExpirados';

const ReporteExpiradosContainer = () => {
  const [elementex, setElementos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/elementosexpirados");
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
      <ReporteElementosEX elementex={elementex} />
    </div>
  );
};

export default ReporteExpiradosContainer;