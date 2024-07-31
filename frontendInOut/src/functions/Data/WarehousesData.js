import React from 'react';

const columnsWarehouses = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'name', sortable: true },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "name","status","actions"];

const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" }
]

const statusColorMap = {
    "1": 'success',
    "0": 'warning'
}

const searchKeys = ['codigo', 'name']


export { columnsWarehouses, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };