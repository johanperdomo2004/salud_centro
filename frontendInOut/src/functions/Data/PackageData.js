import React from 'react';

const columnsPackage = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'name', sortable: true },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actionElement' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "name", "status", "actionElement"];

const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" }
]

const statusColorMap = {
    "1": 'success',
    "0": 'warning'
}

const searchKeys = ['codigo', 'name', 'status']


export { columnsPackage, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };