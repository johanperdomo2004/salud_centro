import axiosClient from '../components/config/axiosClient';

export const DesactivarElemento = async (codigoElemento, nuevoEstado) => {
    try {
        await axiosClient.put(`elemento/desactivar/${codigoElemento}`, { estado: nuevoEstado });
    } catch (error) {
        // Mostrar alerta de error
        const errorMessage = error.response?.data?.message || "Ocurrió un error al desactivar el elemento.";
        swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
            buttons: false,
            timer: 2000,
        });
    }
};


export const DesactivarCategorias = async (codigoCategoria, nuevoEstado) => {
    try {
        await axiosClient.put(`categoria/desactivar/${codigoCategoria}`, { estado: nuevoEstado });
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Ocurrió un error al desactivar la categoría.";
        swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
            buttons: false,
            timer: 2000,
        });  
    }
};

export const DesactivarEmpaque = async (codigoEmpaque, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`empaque/desactivar/${codigoEmpaque}`, { estado: nuevoEstado });

        // Mostrar alerta de éxito
        
    } catch (error) {
        // Mostrar alerta de error
        const errorMessage = error.response?.data?.message || "Ocurrió un error al desactivar el empaque.";
        swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
            buttons: false,
            timer: 2000,
        });
    }
};

export const DesactivarMedida = async (codigoMedida, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`medida/desactivar/${codigoMedida}`, { estado: nuevoEstado });

    } catch (error) {
        const errorMessage = error.response?.data?.message || "Ocurrió un error al desactivar la medida.";
        swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
            buttons: false,
            timer: 2000,
        });
    }
};

export const DesactivarUbicacion = async (codigoUbicacion, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`ubicacion/desactivar/${codigoUbicacion}`, { estado: nuevoEstado });

    } catch (error) {
        const errorMessage = error.response?.data?.message || "Ocurrió un error al desactivar la ubicación.";
        swal({
            title: "Error",
            text: errorMessage,
            icon: "error",
            buttons: false,
            timer: 2000,
        });
    }
};

export const DesactivarBodega = async (codigoBodega, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`bodega/desactivar/${codigoBodega}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar la bodega:", error);
    }
};

export const DesactivarUsuario = async (CodigoUsuario, nuevoEstado) => {
    try {
        // Realiza la solicitud para desactivar/activar el empaque
        await axiosClient.put(`usuario/desactivar/${CodigoUsuario}`, { estado: nuevoEstado });

    } catch (error) {
        console.error("Error al desactivar el Usuario:", error);
    }
};