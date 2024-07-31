import React, { useState, useEffect } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';


export const FormDataUbicacion = ({ listar, onClose }) => {
    const [bodegas, setBodegas] = useState([]);
    const [values, setValues] = useState({
        name: "",
        warehouse_id: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBodegas = async () => {
            try {
                const response = await axiosClient.get('bodega/listar');
                setBodegas(response.data.data);
            } catch (error) {
                swal({
                    title: "Error",
                    text: error.response.data.message,
                    icon: `warning`,
                    buttons: true,
                    timer: 2000,
                });
            }
        };

        fetchBodegas();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        setValues({
            ...values,
            [name]: formattedValue,
        });
    };

    const handleForm = async (event) => {
        event.preventDefault();

        let hasError = false;

        let errorObject = {
            name: '',
            warehouse_id: ''
        }

        if (!values.name) {
            errorObject.name = 'El nombre es obligatorio';
            hasError = true;
        }

        if (!values.warehouse_id) {
            errorObject.warehouse_id = 'Debe seleccionar una bodega';
            hasError = true;
        }

        if (hasError) {
            setErrors(errorObject);
            return;
        }

        try {
            const response = await axiosClient.post('ubicacion/registrar', values);
            if (response.status === 200) {
                setValues({ name: '', warehouse_id: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La ubicación se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
                onClose();
                listar();
            }
        } catch (error) {
            if (error.response && error.response.data.message.includes('Duplicate entry')) {
                setErrors({ name: 'El nombre de la categoría ya existe.' });
            } else {
                setErrors({ name: 'Ocurrió un error al registrar la categoría. Inténtalo de nuevo.' });
            }
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleForm}>
                    <div className='flex flex-col justify-center items-center gap-3'>
                    <div className="w-full" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Ubicación'
                            name='name'
                            color={errors.name ? 'danger' : ''}
                            errorMessage={errors.name}
                            isInvalid={errors.name}
                            value={values.name}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                    </div>
                    <div className="w-full mb-2" data-twe-input-wrapper-init>
                        <select
                            name="warehouse_id"
                            value={values.warehouse_id}
                            onChange={handleInputChange}
                            className={`${errors.warehouse_id ? 'bg-[#fee7ef] hover:bg-[#fdd0df] text-red-500' : 'bg-[#F4F4F5]'} border border-gray-300 w-[100%] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
                        >
                            <option value="" disabled>Seleccione una Bodega</option>
                            {bodegas.length > 0 ? (
                                bodegas.map(bodega => (
                                    <option
                                        value={bodega.warehouse_id}
                                        key={bodega.name}
                                    >
                                        {bodega.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No hay Ubicaciones disponibles</option>
                            )}
                        </select>
                        {errors.warehouse_id && <span className='text-[10px] text-left text-xs w-full pl-3 text-red-500'>{errors.warehouse_id}</span>}
                    </div>
                    <div className='w-full flex justify-end gap-3 mb-3'>
                        <ButtonCerrar onClose={onClose} />
                        <ButtonRegistrar label={"Registrar"} />
                    </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
