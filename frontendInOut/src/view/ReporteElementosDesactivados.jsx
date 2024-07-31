import React, { useState, useEffect } from "react";
import axiosClient from "../components/config/axiosClient";
import ElementosDesactivados from '../components/reportes/ComponenteElementosDesactivados';

const ElementosDesactivadosContainer = () => {
  const [elementosd, setPrestamos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/reporte/elementosdesactivados");
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
      <ElementosDesactivados elementosd={elementosd} />
    </div>
  );
};

export default ElementosDesactivadosContainer;