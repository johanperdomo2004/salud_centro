import React from 'react';

const columnsUsers = [
    { name: 'Código', uid: 'codigo', sortable: true },
    { name: 'Usuario', uid: 'nombre', sortable: true },
    /* { name: 'Apellido', uid: 'lastname' }, */
    { name: 'Telefono', uid: 'phone' },
    /* { name: 'Email', uid: 'correo' }, */
    { name: 'Identificación', uid: 'identification' },
    { name: 'Id Ficha', uid: 'course_id' },
    { name: 'Rol', uid: 'role' },
    /* { name: 'Cargo', uid: 'position_name' }, */
    { name: 'Estado', uid: 'status' },
    { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "nombre", "role", "phone", "identification", "course_id", "role", "status", "actions"];

const statusOptions = [
    { name: "Activo", uid: "Activo" },
    { name: "Inactivo", uid: "Inactivo" }
]

const statusColorMap = {
    "Activo": 'success',
    "Inactivo": 'warning'
}

const searchKeys = ['codigo', 'nombre', 'identification']


export { columnsUsers, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys };