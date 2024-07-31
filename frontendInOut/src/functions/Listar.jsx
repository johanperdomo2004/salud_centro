import React, { useEffect } from 'react'
import axios from 'axios';
import axiosClient from '../components/config/axiosClient';

export const ListarElementos = async () => {
    try {
        const response = await axiosClient.get('elemento/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const BuscarElemento = async (codigoElemento) => {
    try {
        const response = await axiosClient.get(`elemento/buscar/${codigoElemento}`);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarUsuarios = async () => {
    try {
        const response = await axiosClient.get('usuario/listar');
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarTipo = async () => {
    try {
        const response = await axiosClient.get('tipo/listar')
        if (response.status === 200) {
            return response.data
        } else if (response.status === 204) {
            return response.data
        }
    } catch (error) {
        console.log(error);
    }
}

export const ListarCategorias = async () => {
    try {

        const response = await axiosClient.get('categoria/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const Listarubicacion = async () => {
    try {
        const response = await axiosClient.get('ubicacion/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarEmpaques = async () => {
    try {
        const response = await axiosClient.get('empaque/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarMedidas = async () => {
    try {
        const response = await axiosClient.get('medida/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const Listarbodegas = async () => {
    try {
        const response = await axiosClient.get('bodega/listar')
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const ListarUbicacionesYBodegas = async () => {
    try {
        const [ubicaciones, bodegas] = await Promise.all([
            Listarubicacion(),
            Listarbodegas()
        ]);

        const bodegasMap = bodegas.reduce((acc, bodega) => {
            acc[bodega.codigo_Bodega] = bodega.Nombre_bodega; // Asume que la bodega tiene una propiedad 'id' y 'Nombre_bodega'
            return acc;
        }, {});

        // Agregar el nombre de la bodega a cada ubicación
        const ubicacionesConBodega = ubicaciones.map(ubicacion => ({
            ...ubicacion,
            Nombre_bodega: bodegasMap[ubicacion.fk_bodega] // Asume que ubicacion tiene una propiedad 'bodegaId'
        }));

        return ubicacionesConBodega;
    } catch (error) {
        console.log(error);
    }
};

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertirAMinusculas = (texto) => {
    return texto.toLowerCase();

}

export const convertirAMayusculas = (texto) => {
    return texto.toUpperCase();
}

export const ListarMovimientosSolicitados = async () => {
    try {
        const response = await axiosClient.get('movimientos/listar')
        const datos = response.data.datos;
        const newData = [];
        datos.forEach(dato => {
            if (dato.Tipo === "Prestamo" && (dato.Estado === "En espera" || dato.Estado === "Confirmada")) {
                newData.push(dato)
            }
        });
        return newData;
    } catch (error) {
        console.log(error);
    }
}

export const BuscarMovimientosSolicitados = async (codigoMovimiento) => {
    try {
        // Realizar una solicitud específica para obtener un movimiento por su código
        const response = await axiosClient.get(`movimientos/buscar/${codigoMovimiento}`);
        const data = response.data.Movimiento;
        console.log(data)
        const newData = [];
        data.forEach(datum => {
            if (datum.Tipo === "Prestamo" && (datum.Estado === "En espera" || datum.Estado === "Confirmada")) {
                newData.push(datum)
            }
        });

        return newData;
    } catch (error) {
        console.log(error)
        const status = error.response.request.status;
        if (status === 404) {
            // Si la respuesta es 404, devolver un arreglo vacío
            return [];
        }
    }
}

export const ListarMovimientosEnPrestamo = async () => {
    try {
        const response = await axiosClient.get('movimientos/listar')
        const datos = response.data.datos;
        const newData = []
        datos.forEach(dato => {
            if (dato.Tipo === "Prestamo" && dato.Estado === "En Prestamo") {
                newData.push(dato)
            }
        });
        return newData
    } catch (error) {
        console.log(error);
    }
}

export const ListarMovimientosCancelados = async () => {
    try {
        const response = await axiosClient.get('movimientos/listar')
        const datos = response.data.datos;
        const newData = []
        datos.forEach(dato => {
            if (dato.Tipo === "Prestamo" && (dato.Estado === "Cancelada" || dato.Estado === "Finalizada")) {
                newData.push(dato)
            }
        });
        return newData
    } catch (error) {
        console.log(error);
    }
}

export const MovementList = async () => {
    try {
        const response = await axiosClient.get('movimientos/list', {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const LoansList = async () => {
    try {
        const response = await axiosClient.get('movimientos/loans/list', {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const MovementDetailsById = async (id) => {
    try {
        const response = await axiosClient.get(`movimientos/movement-details/list/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const MovementsByUserId = async (id) => {
    try {
        const response = await axiosClient.get(`movimientos/list/user/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}