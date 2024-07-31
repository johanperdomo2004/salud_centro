import React, { useState, useEffect } from "react";
import { BiFile } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import axiosClient from "../components/config/axiosClient";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const getMonthYear = (date) => {
  const options = { year: "numeric", month: "short" };
  return new Date(date).toLocaleDateString("default", options);
};

const ReporteEstadistico = () => {
  const navigate = useNavigate();
  const [movementsData, setmovementsData] = useState([]);
  const [loansEleData, setloansEleData] = useState([]);
  const [loansBarData, setloansBarData] = useState([]);
  const [consumableData, setconsumableData] = useState([]);
  const [consumableBarData, setconsumableBarData] = useState([]);
  const [expiradosData, setExpiradosData] = useState([]);
  const [vencidosData, setVencidosData] = useState([]);
  const [stockMinData, setStockMinData] = useState([]);
  

  const fetchData = async () => {
    try {
      const movementsResponse = await axiosClient.get("/reporte/movimientospie");
      const loansResponse = await axiosClient.get("/reporte/prestamospie");
      const loansBarResponse = await axiosClient.get("/reporte/prestamosbar");
      const consumableResponse = await axiosClient.get("/reporte/consumiblespie");
      const consumableBarResponse = await axiosClient.get("/reporte/consumiblesbar");
      const expiradosResponse = await axiosClient.get("/reporte/elementosexpiradosmodal");
      const vencidosResponse = await axiosClient.get("/reporte/prestamosvencidosmodal");
      const stockMinResponse = await axiosClient.get("/reporte/stockminmodal");


      setmovementsData(movementsResponse.data.datos);
      setloansEleData(loansResponse.data.datos);
      setloansBarData(loansBarResponse.data.datos);
      setconsumableData(consumableResponse.data.datos);
      setconsumableBarData(consumableBarResponse.data.datos);
      setExpiradosData(expiradosResponse.data.datos);
      setVencidosData(vencidosResponse.data.datos);
      setStockMinData(stockMinResponse.data.datos);
    } catch (error) {
      console.error("Error al obtener la información:", error);
      setmovementsData([]);
      setloansEleData([]);
      setloansBarData([]);
      setconsumableData([]);
      setconsumableBarData([]);
      setExpiradosData([]);
      setVencidosData([]);
      setStockMinData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const datosMovementsPie = Array.isArray(movementsData)
    ? movementsData.reduce((acc, curr) => {
        const found = acc.find((item) => item.name === curr.movement_type);
        if (found) {
          found.value += 1;
        } else {
          acc.push({ name: curr.movement_type, value: 1 });
        }
        return acc;
      }, [])
    : [];

  const datosConsumablePie = Array.isArray(consumableData)
    ? consumableData.map((item) => ({
        name: item.name,
        value: parseFloat(item.percentage),
      }))
    : [];

  const datosConsumableBar = Array.isArray(consumableBarData)
    ? consumableBarData.reduce((acc, curr) => {
        const found = acc.find((item) => item.mes === curr.date);
        if (found) {
          found.Total += parseFloat(curr.Total);
        } else {
          acc.push({
            mes: curr.date,
            Total: parseFloat(curr.Total),
          });
        }
        return acc;
      }, [])
    : [];

    const datosLoansBar = Array.isArray(loansBarData)
    ? loansBarData.reduce((acc, curr) => {
        const found = acc.find((item) => item.mes === curr.date);
        if (found) {
          found.Total += parseFloat(curr.Total);
        } else {
          acc.push({
            mes: curr.date,
            Total: parseFloat(curr.Total),
          });
        }
        return acc;
      }, [])
    : [];

  const datosMovementsBar = Array.isArray(movementsData)
    ? movementsData.reduce((acc, curr) => {
        const found = acc.find((item) => item.mes === curr.date);
        if (found) {
          found[curr.movement_type] = (found[curr.movement_type] || 0) + 1;
        } else {
          acc.push({ mes: curr.date, [curr.movement_type]: 1 });
        }
        return acc;
      }, [])
    : [];

  const datosLoansPie = Array.isArray(loansEleData)
    ? loansEleData.map((item) => ({
        name: item.name,
        value: parseFloat(item.percentage),
      }))
    : [];

  const coloresPie = [
    "#07597e",
    "#2183b3",
    "#30a0d9",
    "#83a6ed",
    "#75bbeb",
    "#00b8d3",
  ];
  const coloresBar = {
    ingreso: "#8884d8",
    salida: "#00C49F",
    text: "#f0f0f0",
  };

  return (
    <div className="container mx-auto pl-12 pr-12">
      <div className="absolute right-[40px] bottom-[30px]">
        <button
          onClick={() => navigate("/reportes")}
          className="flex text-blue-900 items-center hover:text-blue-600 p-2 rounded cursor-pointer transition duration-100 z-10"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}  >
          <BiFile className="mr-1" size={24} />
          Reportes
        </button>
      </div>
      <h1 className="flex justify-center font-extrabold text-2xl mb-4">
        Bienvenid@!
      </h1>
      <div className="pl-12 pr-12">
        <h2 className="font-bold text-lg justify-center flex pb-2">
          Módulo de Préstamos
        </h2>
        <div className="flex justify-between pl-12 pr-12">
          <div className="flex flex-col items-center pl-10">
            <h2 className="font-bold ">Top 5 Elementos Más Solicitados</h2>
            {datosLoansPie.length > 0 ? (
              <PieChart width={350} height={310}>
                <Pie
                  data={datosLoansPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ value }) => `${value.toFixed(2)}%`}
                >
                  {datosLoansPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresPie[index % coloresPie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
          <div className="flex flex-col items-center pr-10">
            <h2 className="font-bold ">Comparativa Mensual</h2>
            {datosLoansBar.length > 0 ? (
              <ResponsiveContainer width={200} height={300}>
               <BarChart
                  data={datosLoansBar}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="mes" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total" stackId="a" fill="#5b9eca">
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="Total"
                      position="inside"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </div>
      <div className="pl-12 pr-12 pt-5">
        <h2 className="font-bold text-lg justify-center pt-3 flex pb-2 ">
          Módulo de Consumibles
        </h2>
        <div className="flex justify-between pl-12 pr-12">
          <div className="flex flex-col items-center pl-10">
            <h2 className="font-bold ">Top 5 Elementos Más Solicitados</h2>
            {datosConsumablePie.length > 0 ? (
              <PieChart width={350} height={310}>
                <Pie
                  data={datosConsumablePie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ value }) => `${value.toFixed(2)}%`}
                >
                  {datosConsumablePie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresPie[index % coloresPie.length]}
                    />
                  ))}
                </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
          <div className="flex flex-col items-center pr-10">
            <h2 className="font-bold ">Comparativa Mensual</h2>
            {datosConsumableBar.length > 0 ? (
              <ResponsiveContainer width={200} height={300}>
                <BarChart
                  data={datosConsumableBar}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="mes" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total" stackId="a" fill="#5b9eca">
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="Total"
                      position="inside"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </div>
      <div className="pl-12 pr-12 pt-5">
        <h2 className="font-bold text-lg justify-center flex pb-2">
          Módulo de Movimientos
        </h2>
        <div className="flex justify-between pl-12 pr-12">
          <div className="flex flex-col items-center pl-10">
            <h2 className="font-bold ">Movimientos Totales</h2>
            {datosMovementsPie.length > 0 ? (
              <PieChart width={350} height={300}>
                <Pie
                  data={datosMovementsPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {datosMovementsPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresPie[index % coloresPie.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
          <div className="flex flex-col items-center pr-10">
            <h2 className="font-bold ">Comparativa Mensual</h2>
            {datosMovementsBar.length > 0 ? (
              <ResponsiveContainer width={200} height={300}>
                <BarChart
                  data={datosMovementsBar}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="mes" />
                  <YAxis hide={true} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="salida" stackId="a" fill={"#11678f"}>
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="salida"
                      position="inside"
                    />
                  </Bar>
                  <Bar dataKey="ingreso" stackId="a" fill={"#30a0d9"}>
                    <LabelList
                      fill={coloresBar.text}
                      dataKey="ingreso"
                      position="inside"
                    />
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteEstadistico;
