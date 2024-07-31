import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReporteSolicitudes from '../components/reportes/ComponenteSolicitudes';

const ReporteSolicitudesContainer = () => {
  const [solicitudes, setPrestamos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/solicitudes");
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
      <ReporteSolicitudes solicitudes={solicitudes} />
    </div>
  );
};

export default ReporteSolicitudesContainer;