import React from 'react';

const columnsElements = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Nombre', uid: 'name', sortable: true },
    { name: 'Stock', uid: 'stock' },
    { name: 'Categoría', uid: 'category_id' },
    { name: 'Tipo', uid: 'elementType_id' },
    { name: 'Medida', uid: 'measurementUnit_id' },
    { name: 'Empaque', uid: 'packageType_id' },
    { name: 'Creación', uid: 'fecha_creación' },
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actionElement' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "name", "stock", "status", "category_id", "actionElement"];

const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" }
]

const statusColorMap = {
    "1": 'success',
    "0": 'warning'
}

const searchKeys = ['codigo', 'name', 'category_id']


export { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };