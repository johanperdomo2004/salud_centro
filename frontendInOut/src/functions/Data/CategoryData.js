import React from 'react';

const columnsCategory = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'name', sortable: true },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actionElement' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "name", "status", "actionElement"];

const statusOptions = [
    { name: "Activo", uid: "activo" },
    { name: "Inactivo", uid: "inactivo" }
]

const statusColorMap = {
    "activo": 'success',
    "inactivo": 'warning'
}

const searchKeys = ['codigo', 'name', 'status']


export { columnsCategory, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };