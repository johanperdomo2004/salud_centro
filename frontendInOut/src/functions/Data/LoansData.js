import React from 'react';

const columnsLoans = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Usuario Aplico', uid: 'nombre', sortable: true },
    { name: 'Identificacion', uid: 'identificacion' },
    { name: 'Usuario Manager', uid: 'usuario_manager', sortable: true },
    { name: 'Usuario Recibió', uid: 'usuario_receiving', sortable: true },
    { name: 'Usuario Devolvió', uid: 'usuario_returning', sortable: true },
    { name: 'Fecha', uid: 'fecha' },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS_LOANS = ["codigo", "nombre", "identificacion", "status","actions"];

const statusOptionsLoans = [
    { name: 'Solicitado', uid: "Solicitado" },
    { name: "En revision", uid: "En revisión" },
    { name: "Aceptado", uid: "Aceptado" },
    { name: "Rechazado", uid: "Rechazado" },
    { name: "En préstamo", uid: "En préstamo" },
    { name: "Completado", uid: "Completado" },
    { name: "Cancelado", uid: "Cancelado" },
    { name: "Estado nulo", uid: "" },
]

const statusColorMapLoans = {
    "Solicitado": 'primary',
    "En revisión": 'secondary',
    "Aceptado": 'success',
    "Rechazado": 'danger',
    "Cancelado": 'danger',
    "Completado": 'default',
    "En préstamo": 'warning',
    "ingreso" : 'success',
    "salida" : 'danger',
    "prestamo" : 'warning',
}

const searchKeysLoans = ['nombre', 'codigo', 'identificacion']

export { columnsLoans, statusOptionsLoans, INITIAL_VISIBLE_COLUMNS_LOANS, statusColorMapLoans, searchKeysLoans };