import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import MessageNotFound from "./MessageNotFound";
import { BiSearch } from "react-icons/bi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logoImg from "../../assets/R.jpg";

const convertDateFormat = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

const ReporteActivos = ({ prestamosa }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const originalData = useMemo(() => prestamosa?.datos || [], [prestamosa]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const data = useMemo(() => {
    if (!prestamosa?.datos) return [];
    let filteredData = prestamosa.datos;

    if (searchPerformed) {
      filteredData = filteredData.filter((row) => {
        const elementMatches = row.element_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const userMatches = row.user_application
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const codeMatches =
          row.movement_id?.toString() === searchTerm.toString();
        const receivingMatches = row.user_receiving
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const rowDate = convertDateFormat(row.created_at);
        const dateMatches =
          (!startDate || rowDate >= startDate) &&
          (!endDate || rowDate <= endDate);
        return (
          (elementMatches || userMatches || codeMatches || receivingMatches) &&
          dateMatches
        );
      });
    }

    return filteredData;
  }, [prestamosa, searchTerm, startDate, endDate, searchPerformed]);

  const columns = useMemo(
    () => [
      { Header: "Código", accessor: "movement_id" },
      { Header: "Elemento", accessor: "element_name" },
      { Header: "Usuario Solicitante", accessor: "user_application" },
      { Header: "Usuario Receptor", accessor: "user_receiving" },
      { Header: "Fecha de Solicitud", accessor: "created_at" },
      { Header: "Vencimiento Préstamo", accessor: "estimated_return" },
      { Header: "Observaciones", accessor: "remarks" },
    ],
    []
  );

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = [
      { header: "ID", key: "movement_id", width: 10 },
      { header: "Elemento", key: "element_name", width: 15 },
      { header: "Usuario Solicitante", key: "user_application", width: 20 },
      { header: "Usuario Receptor", key: "user_receiving", width: 20 },
      { header: "Estado Préstamo", key: "loan_status", width: 20 },
      { header: "Fecha de Solicitud", key: "created_at", width: 20 },
      { header: "Vencimiento Préstamo", key: "estimated_return", width: 20 },
      { header: "Observaciones", key: "remarks", width: 20 },
    ];

    const response = await fetch(logoImg);
    const logo = await response.arrayBuffer();
    const imageId = workbook.addImage({
      buffer: logo,
      extension: "png",
    });
    worksheet.addImage(imageId, "A1:A2");

    worksheet.mergeCells("B2:G2");
    worksheet.getCell("B2").value = "Reporte de Préstamos Activos";
    worksheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("B2").font = { size: 16, bold: true };

    worksheet.mergeCells("B1:G1");
    worksheet.getCell("B1").value = "INVENTARIO ELEMENTOS INOUT";
    worksheet.getCell("B1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("B1").font = { size: 17, bold: true };

    worksheet.mergeCells("H1:I1");
    worksheet.getCell("H1").value = "ADSO-2644590";
    worksheet.getCell("H1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    const headers = [
      "Código",
      "Elemento",
      "Usuario Solicitante",
      "Usuario Receptor",
      "Estado Préstamo",
      "Fecha de Solicitud",
      "Vencimiento Préstamo",
      "Observaciones",
    ];
    worksheet.addRow(headers);

    headers.forEach((header, index) => {
      const cell = worksheet.getRow(4).getCell(index + 1);
      cell.font = { size: 12, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    data.forEach((row) => {
      worksheet.addRow([
        row.movement_id,
        row.element_name,
        row.user_application,
        row.user_receiving,
        row.loan_status,
        row.created_at,
        row.estimated_return,
        row.remarks,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Reporte préstamos activos.xlsx");
  };

  const [currentPage, setCurrentPage] = useState(0);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage, pageSize: 10 },
      autoResetPage: false,
    },
    usePagination
  );

  const pages = Array.from({ length: pageCount }, (_, i) => i);

  useEffect(() => {
    setCurrentPage(pageIndex);
  }, [pageIndex]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    setShowFilters(false);
    gotoPage(0);
  };

  const handleNewSearch = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSearchPerformed(false);
    setShowFilters(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="pl-4 pr-4">
      <div className="p-1 text-gray-400 rounded text-s">
        <span>
          {" "}
          Total items{" "}
          <span className="text-blue-400 pr-1">{originalData.length}</span>
        </span>
      </div>
      <div className="w-auto">
        {showFilters && (
          <div
            className="flex justify-between items-center p-2 border h-10 rounded-lg bg-foreground"
            style={{
              background:
                "linear-gradient(to right, #1a202c 70%, #cccccc 100%)",
            }}
          >
            <div className="flex items-center">
              <div className="flex items-center ml-2">
                <div className="flex items-center ml-2 relative">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <BiSearch className="text-gray-300 text-xl" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar.."
                      value={searchTerm}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      ref={searchInputRef}
                      className="border rounded pl-8 pr-2 py-1 w-full"
                    />
                  </div>
                </div>
                <label className="ml-4 mr-2 text-white">Desde:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="border rounded p-1"
                />
              </div>
              <div className="flex items-center ml-4">
                <label className="mr-2 text-white">Hasta:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="border rounded p-1"
                />
              </div>
              <div className="flex items-center ml-4 rounded-lg cursor-pointer">
                <div
                  onClick={handleSearch}
                  className="text-blue-500 hover:text-white py-2 px-2 rounded uppercase transition duration-300"
                  style={{
                    boxShadow: "inset 0 0 0 2px ",
                  }}
                >
                  <BiSearch className="ml-1 text-lg" />
                </div>
              </div>
            </div>
            <h2 className="uppercase font-semibold mr-4 text-white">
              Reporte Préstamos Activos
            </h2>
          </div>
        )}
        {searchPerformed && data.length > 0 && (
          <div className="flex justify-center h-10 bg-foreground items-center p-2 rounded-xl border">
            <div className="p-1 uppercase rounded text-s bg-gray-200">
              <span>
                {" "}
                resultados encontrados{" "}
                <span className="text-blue-600 bg-gray-200 pr-1">
                  {data.length}
                </span>
              </span>
            </div>
            <button
              onClick={handleNewSearch}
              className="hover:bg-blue-600 hover:text-white text-blue-500 font-bold py-2 px-4 rounded ml-3 uppercase text-xs transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
            >
              Nueva Búsqueda
            </button>

            <button
              onClick={handleDownload}
              className="hover:bg-green-600 hover:text-white text-green-500 font-bold py-2 px-4 rounded ml-3 uppercase text-xs transition duration-300"
              style={{
                boxShadow: "inset 0 0 0 2px ",
              }}
            >
              Descargar
            </button>
          </div>
        )}
        {searchPerformed && data.length === 0 && (
          <div className="flex justify-center items-center flex-col p-1">
            <div className="flex justify-center rounded-xl w-full items-center flex-col p-1 bg-foreground">
              <button
                onClick={handleNewSearch}
                className="hover:bg-blue-600 hover:text-white text-blue-500 font-bold py-2 px-4 rounded ml-3 uppercase text-xs transition duration-300"
                style={{
                  boxShadow: "inset 0 0 0 2px ",
                }}
              >
                Nueva Búsqueda
              </button>
            </div>
            <MessageNotFound />
          </div>
        )}
        {data.length > 0 ? (
          <div>
            <table
              {...getTableProps()}
              className="table text-center mt-2"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <thead className="bg-gray-800">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="text-sm">
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between mt-3">
              <div className="flex items-center">
                <span className="mr-2 text-gray-400">
                  Página {currentPage + 1} de {pageCount}
                </span>
              </div>
              <div className="flex justify-end mt-3">
                {pageCount > 1 && (
                  <>
                    <li
                      role="button"
                      tabIndex="0"
                      aria-label="previous page button"
                      onClick={previousPage}
                      className={`flex items-center justify-center w-8 h-8 text-xs rounded-l-full ${
                        !canPreviousPage
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-foreground hover:bg-gray-700 text-white"
                      }`}
                      disabled={!canPreviousPage}
                    >
                      <svg
                        className="w-4 h-4 stroke-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.5 19l-7-7 7-7"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </li>
                    {currentPage >= 4 && (
                      <li
                        role="button"
                        tabIndex="0"
                        onClick={() => gotoPage(0)}
                        className={`flex items-center justify-center w-8 h-8 text-xs ${
                          currentPage === 0
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-foreground hover:bg-gray-700 text-white"
                        }`}
                      >
                        1
                      </li>
                    )}
                    {currentPage >= 5 && (
                      <li
                        role="button"
                        tabIndex="0"
                        className={`flex items-center justify-center w-8 h-8 text-xs ${
                          currentPage < 3 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-foreground hover:bg-gray-700 text-white"
                        }`}
                      >
                        ...
                      </li>
                    )}
                    {pages.slice(currentPage, currentPage + 3).map((page) => (
                      <li
                        key={page}
                        role="button"
                        tabIndex="0"
                        onClick={() => gotoPage(page)}
                        className={`flex items-center justify-center w-8 h-8 text-xs ${
                          currentPage === page
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-foreground hover:bg-gray-700 text-white"
                        }`}
                      >
                        {page + 1}
                      </li>
                    ))}
                    {currentPage + 3 < pageCount && (
                      <li
                        role="button"
                        tabIndex="0"
                        className={`flex items-center justify-center w-8 h-8 text-xs ${
                          pageCount - currentPage > 3 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-foreground hover:bg-gray-700 text-white"
                        }`}
                      >
                        ...
                      </li>
                    )}
                    {currentPage + 3 < pageCount && (
                      <li
                        role="button"
                        tabIndex="0"
                        onClick={() => gotoPage(pageCount - 1)}
                        className={`flex items-center justify-center w-8 h-8 text-xs ${
                          currentPage === pageCount - 1
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-foreground hover:bg-gray-700 text-white"
                        }`}
                      >
                        {pageCount}
                      </li>
                    )}
                    <li
                      role="button"
                      tabIndex="0"
                      aria-label="next page button"
                      onClick={nextPage}
                      className={`flex items-center justify-center w-8 h-8 text-xs rounded-r-full ${
                        !canNextPage
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-foreground hover:bg-gray-700 text-white"
                      }`}
                      disabled={!canNextPage}
                    >
                      <svg
                        className="w-4 h-4 stroke-current rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.5 19l-7-7 7-7"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </li>
                  </>
                )}
              </div>

            </div>
          </div>
        ) : (
          !searchPerformed && <MessageNotFound />
        )}
      </div>
    </div>
  );
};

export default ReporteActivos;
