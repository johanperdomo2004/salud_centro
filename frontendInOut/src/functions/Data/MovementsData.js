import React from 'react';

const columnsMovements = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'nombre', sortable: true },
    { name: 'Identificacion', uid: 'identificacion' },
    { name: 'Fecha', uid: 'fecha' },
    { name: 'Tipo', uid: 'tipo' },
    { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "nombre", "tipo", "actions"];

const statusOptions = [
    { name: 'Ingresos', uid: "ingreso" },
    { name: "Salidas", uid: "salida" }
]

const statusColorMap = {
    "ingreso": 'success',
    "salida": 'warning'
}

const searchKeys = ['nombre', 'codigo', 'identificacion']

export { columnsMovements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };