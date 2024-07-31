import React from 'react';

const columnslocation = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'name', sortable: true },
    { name: 'Bodega', uid: 'warehouse_id' },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actionElement' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "name", "warehouse_id", "status", "actionElement"];

const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" }
]

const statusColorMap = {
    "1": 'success',
    "0": 'warning'
}

const searchKeys = ['codigo', 'name', 'category_id']


export { columnslocation, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };