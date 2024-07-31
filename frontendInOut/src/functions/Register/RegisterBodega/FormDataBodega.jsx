import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import axiosClient from '../../../components/config/axiosClient';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormDataBodega = ({ listar, onClose }) => {

    const [values, setValues] = useState({
        name: ""
    });

    const [errors, setErrors] = useState({});

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

        let hasErrors = false;

        let errorObject = {
            name: ''
        };

        if (!values.name) {
            errorObject.name = 'Debe ingresar una unidad productiva.';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(errorObject);
            return;
        }


        try {
            const response = await axiosClient.post('bodega/registrar', values);
            if (response.status === 200) {
                setValues({
                    name: ''
                });
                swal({
                    title: "Registro exitoso",
                    text: "La unidad productiva se ha registrado correctamente.",
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
            <form onSubmit={handleForm}>
                <div className='w-[100%] flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-[100%]'>
                        <Input
                            type='text'
                            label='Unidad Productiva'
                            name='name'
                            color={errors.name ? 'danger' : ''}
                            errorMessage={errors.name}
                            isInvalid={errors.name}
                            value={values.name}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                    </div>
                </div>
                <div className='flex justify-end gap-3 mb-3'>
                    <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className='font-bold text-white' color="success" type='submit'>
                        Registrar
                    </Button>
                </div>
            </form>
        </div>
    )
}