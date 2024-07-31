import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ReportePrestamos from '../components/reportes/ComponentePrestamos';

const ReportePrestamosContainer = () => {
  const [prestamos, setPrestamos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/prestamos");
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
      <ReportePrestamos prestamos={prestamos} />
    </div>
  );
};

export default ReportePrestamosContainer;