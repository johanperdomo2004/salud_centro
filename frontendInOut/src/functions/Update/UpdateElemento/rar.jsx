import React, { useState, useEffect } from 'react'
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonGeneral } from '../../../components/Buttons/Button';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';



export const FormDataEmpaque = ({onRegisterSuccess, onClose}) => {

    const [errorMessage, setErrorMessage] = useState('');

    const [values, setValues] = useState(
        {
            Nombre_Empaque: "",
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

        if (!values.Nombre_Empaque.trim() || /\d/.test(values.Nombre_Empaque.trim())) {
            setErrorMessage('No debe estar vacío ni tener números.');
            return; 
        } else {
            setErrorMessage('');
        }

        try {
            const response = await axiosClient.post('empaque/registrar', values);
            if (response.status === 200) {
                
                setValues({ Nombre_Empaque: '' });
                swal({
                    title: "Registro exitoso",
                    text: "El empaque se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000, 
                });
                
                onClose(); 
                onRegisterSuccess();
            }
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

    return (
        <div>
            <div>
                <form onSubmit={handleForm}>
                    <div className='flex justify-center items-center'></div>
                    <div class="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
                        <Input
                            type='text'
                            label='Nombre Empaque'
                            name='Nombre_Empaque'
                            value={values.Nombre_Empaque}
                            onChange={handleInputChange}
                            className="w-[100%]"
                        />
                        {errorMessage && (
                            <div className="flex items-center text-red-500 text-xs mt-2 ml-3">
                                <FaExclamationCircle className="mr-1" />
                                {errorMessage}
                            </div>
                        )}
                    </div>
                    <div className='flex justify-end gap-3 mb-3'>
                        <ButtonCerrar onClose={onClose}/>
                        <ButtonRegistrar/>
                    </div>
                </form>
            </div>
        </div>
    )
}