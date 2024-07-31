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
    { name: 'Ingresos', uid: "incoming" },
    { name: "Salidas", uid: "outgoing" }
]

const statusColorMap = {
    "incoming": 'success',
    "outgoing": 'warning'
}

const searchKeys = ['nombre', 'codigo', 'identificacion']

export function capitalize(str) {
    if (str) { return str.charAt(0).toUpperCase() + str.slice(1) }

}

export { columnsMovements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };