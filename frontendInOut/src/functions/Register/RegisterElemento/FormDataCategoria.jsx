import React, { useState } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { ButtonGeneral } from '../../../components/Buttons/Button';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormDataCategoria = ({ listar, onClose }) => {

    const [errors, setErrors] = useState({})

    const [values, setValues] = useState(
        {
            name: "",
        }
    )

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
            name: ''
        }

        if (!values.name || /\d/.test(values.name)) {
            errorObject.name = 'No puede contener números ni estar vacío';
            hasError = true;
        }

        if (hasError) {
            setErrors(errorObject);
            return;
        }

        try {
            const response = await axiosClient.post('categoria/registrar', values);
            if (response.status === 200) {
                setValues({ name: '' });
                swal({
                    title: "Registro exitoso",
                    text: "La categoría se ha registrado correctamente.",
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
                    <div className='flex justify-center items-center'></div>
                    <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Nombre Categoría'
                            name='name'
                            color={errors.name ? 'danger' : ''}
                            errorMessage={errors.name}
                            isInvalid={errors.name}
                            value={values.name}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                    </div>
                    <div className='flex justify-end gap-3 mb-3'>
                        <ButtonCerrar onClose={onClose} />
                        <ButtonRegistrar label={"Registrar"} />
                    </div>
                </form>
            </div>
        </div>
    )
}
