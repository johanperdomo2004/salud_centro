import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReporteElementos from '../components/reportes/ComponenteElementos';

const ReporteElementosContainer = () => {
  const [elementos, setElementos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/elementos");
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
      <ReporteElementos elementos={elementos} />
    </div>
  );
};

export default ReporteElementosContainer;