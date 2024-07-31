import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from './components/auth/ProtectedRoutes2';
import NotCredentials from './view/auth/NotCredentials';
import { PageNotFound } from './view/PageNotFound';

import UserTemplate from './view/layouts/UserTemplate';
import DashboardTemplate from './view/layouts/DashboardTemplate';

import Login from "./view/Login";
import { Usuarios } from './view/Usuarios';

import { Elemento } from "./view/Elemento";
import { Categoria } from "./view/Categoria";
import { Empaques } from "./view/Empaques";
import { Medidas } from "./view/Medidas";

import { Ubicaciones } from "./view/Ubicaciones";
import Bodegas from "./view/Bodegas";

import Reporte from "./view/Reportes";
import Estadistica from "./view/ReportesEstadistica";
import ReporteE from "./view/ReporteElementos";
import ReporteED from "./view/ReporteElementosDesactivados";
import ReporteEX from "./view/ReporteElementosExpirados";
import ReporteM from "./view/ReporteMovimiento";
import ReporteMS from "./view/ReporteMinStock";
import ReporteP from "./view/ReportePrestamos";
import ReportePA from "./view/ReportePrestamosActivos";
import ReporteS from "./view/ReporteSolicitud";
import ReporteV from "./view/ReportePrestamosVencidos";

import { Movimientos3 } from './view/Movimientos3';
import { Reservas } from './view/Reservas';

function App2() {

    return (
        <div className="h-screen">
            <Routes >
                <Route index element={<Navigate to="/login" />} />
                <Route path={'/NOT-CREDENTIALS'} element={<NotCredentials />} />
                <Route path='/*' element={<PageNotFound />} />
                <Route path='/login' element={<Login />} />
                <Route
                    path="/elementos"
                    element={<ProtectedRoute
                        component={Elemento}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path="/elementos/categorias"
                    element={<ProtectedRoute
                        component={Categoria}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path="/elementos/empaques"
                    element={<ProtectedRoute
                        component={Empaques}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path="/elementos/medidas"
                    element={<ProtectedRoute
                        component={Medidas}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/movimientos'}
                    element={<ProtectedRoute
                        component={Movimientos3}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/bodegas'}
                    element={<ProtectedRoute
                        component={Bodegas}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/bodegas/ubicacion'}
                    element={<ProtectedRoute
                        component={Ubicaciones}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/reservas'}
                    element={<ProtectedRoute
                        component={Reservas}
                        layout={UserTemplate}
                        allowedRoles={[1, 2, 3]}
                    />}
                />
                <Route
                    path={'/reportes'}
                    element={<ProtectedRoute
                        component={Reporte}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/estadistica'}
                    element={<ProtectedRoute
                        component={Estadistica}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/reportes/movimientos'}
                    element={<ProtectedRoute
                        component={ReporteM}
                        layout={DashboardTemplate}
                        allowedRoles={[1, 2]}
                    />}
                />
                <Route
                    path={'/reportes/stockmin'}
                    element={
                        <ProtectedRoute
                            component={ReporteMS}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />
                    }
                />
                <Route
                    path={'/reportes/elementos'}
                    element={
                        <ProtectedRoute
                            component={ReporteE}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />
                    }
                />
                <Route
                    path="/reportes/elementosdesactivados"
                    element={
                        <ProtectedRoute
                            component={ReporteED}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />
                    }
                />
                <Route
                    path="/reportes/elementosexpirados"
                    element={
                        <ProtectedRoute
                            component={ReporteEX}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />
                    }
                />
                <Route
                    path="/reportes/prestamos"
                    element={
                        <ProtectedRoute
                            component={ReporteP}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />}
                />
                <Route
                    path="/reportes/prestamosactivos"
                    element={
                        <ProtectedRoute
                            component={ReportePA}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />}
                />
                <Route
                    path="/reportes/solicitud"
                    element={
                        <ProtectedRoute
                            component={ReporteS}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />}
                />
                <Route
                    path="/reportes/prestamosvencidos"
                    element={
                        <ProtectedRoute
                            component={ReporteV}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />}
                />
                <Route
                    path={'/usuarios'}
                    element={
                        <ProtectedRoute
                            component={Usuarios}
                            layout={DashboardTemplate}
                            allowedRoles={[1, 2]}
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default App2;