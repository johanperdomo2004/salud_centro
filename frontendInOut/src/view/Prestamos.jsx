import React, { useEffect, useState } from 'react'
import { TableGeneral } from '../components/tables/Elemento/TablaGeneral/Table'
import { columnsPrestamos } from '../functions/columnsData'
import {
    ListarMovimientosSolicitados,
    BuscarMovimientosSolicitados,
    ListarMovimientosCancelados,
    ListarMovimientosEnPrestamo
} from '../functions/Listar'
import { Stepper } from '../components/moleculas/Stepper'
import { TableMaterial } from '../components/tables/Elemento/TablaGeneral/TableMaterial/TableMaterial'

export const Prestamos = () => {

    const [selected, setSelected] = useState('solicitudes')

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <h1 className='h-[40px] font-bold flex items-center  pl-14 text-lg'>Préstamos</h1>
            <Stepper setSelected={setSelected} selected={selected}></Stepper>
            <div className={`${selected !== 'solicitudes' ? "hidden" : ""} w-[85%] flex justify-center`}>
                <TableMaterial columns={columnsPrestamos} funcionListar={ListarMovimientosSolicitados} funcionBuscar={BuscarMovimientosSolicitados}/>
            </div>
            <div className={`${selected !== 'En Prestamo' ? "hidden" : ""} w-[85%] flex justify-center`}>
                <TableMaterial columns={columnsPrestamos} funcionListar={ListarMovimientosEnPrestamo} />
            </div>
            <div className={`${selected !== 'canceladas' ? "hidden" : ""} w-[85%] flex justify-center`}>
                <TableMaterial columns={columnsPrestamos} funcionListar={ListarMovimientosCancelados} />
            </div>
        </div>
    )
}