import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { useAuth } from '../../../context/AuthProvider';

export const FormUpdatePerfil = ({ onClose, category, Listar }) => {

    const { login } = useAuth()

    const userId = localStorage.getItem('user_id');

    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
    });

    const [errorMessages, setErrorMessages] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
    });

    useEffect(() => {
        if (category) {
            setValues({
                name: category.name,
                lastname: category.lastname,
                phone: category.phone,
                email: category.email,
                identification: category.identification,
            });
        } else {
            getDataUser();
        }
    }, [category]);

    const getDataUser = async () => {
        try {
            const response = await axiosClient.get(`usuario/buscar/${userId}`);
            const userData = response.data.Datos;

            setValues({
                name: userData.user_name,
                lastname: userData.lastname,
                phone: userData.phone,
                email: userData.email,
                identification: userData.identification,
                password: '101010'
            });
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

    const editValues = (event) => {
        const { name, value } = event.target;
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const allowOnlyNumbers = (event) => {
        const isValidKey = /^\d$/.test(event.key);
        if (!isValidKey) {
            event.preventDefault();
        }
    };

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            name: '',
            lastname: '',
            phone: '',
            email: '',
            identification: '',
        };

        if (!values.name.trim() || /\d/.test(values.name)) {
            newErrorMessages.name = !values.name.trim()
                ? 'El nombre del usuario no puede estar vacío.'
                : 'El nombre del usuario no puede contener números.';
            hasError = true;
        } else if (values.name.trim().length < 3 || values.name.trim().length > 40) {
            newErrorMessages.name = 'El Nombre debe tener más de 3 Letras';
            hasError = true;
        }

        if (!values.lastname.trim() || /\d/.test(values.lastname)) {
            newErrorMessages.lastname = !values.lastname.trim()
                ? 'El apellido del usuario no puede estar vacío.'
                : 'El apellido del usuario no puede contener números.';
            hasError = true;
        } else if (values.lastname.trim().length < 3 || values.lastname.trim().length > 40) {
            newErrorMessages.lastname = 'El Apellido debe tener más de 3 Letras';
            hasError = true;
        }

        if (!values.phone.trim()) {
            newErrorMessages.phone = 'El campo de teléfono es requerido.';
            hasError = true;
        } else if (values.phone.trim().length < 10 || values.phone.trim().length > 12) {
            newErrorMessages.phone = 'Debe tener 10 números';
            hasError = true;
        }

        if (!values.identification.trim()) {
            newErrorMessages.identification = 'El campo de identificación es requerido.';
            hasError = true;
        } else if (values.identification.trim().length < 6 || values.identification.trim().length > 10) {
            newErrorMessages.identification = 'El campo de identificación debe tener entre 6 y 10 caracteres.';
            hasError = true;
        }

        if (!values.email.trim()) {
            newErrorMessages.email = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            newErrorMessages.email = 'El correo electrónico no es válido.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);
        return !hasError;
    };

    const putUser = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axiosClient.put(`usuario/perfil/${userId}`, values);
            if (response.status === 200) {
                swal({
                    title: "Actualizado",
                    text: "Perfil actualizado con éxito.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
                await login({
                    email: values.email,
                    password: values.password
                });
                Listar();
                onClose();
            }

        } catch (error) {
            swal("Error", "Hubo un problema al actualizar el usuario", "error");
        }
    };

    return (
        <div>
            <form onSubmit={putUser}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className="w-auto flex flex-col md:flex-row gap-3 mb-2">
                        <div>
                            <Input
                                type='text'
                                label='Nombre Usuario'
                                name='name'
                                value={values.name}
                                onChange={editValues}
                                className="w-[250px] lg:w-[310px]"
                            />
                            {errorMessages.name && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.name}
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                type='text'
                                label='Apellido Usuario'
                                name='lastname'
                                value={values.lastname}
                                onChange={editValues}
                                className="w-[250px] lg:w-[310px]"
                            />
                            {errorMessages.lastname && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.lastname}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-auto flex flex-col md:flex-row gap-3 mb-2">
                        <div>
                            <Input
                                type='text'
                                label='Email'
                                name='email'
                                value={values.email}
                                onChange={editValues}
                                className="w-[250px] lg:w-[310px]"
                            />
                            {errorMessages.email && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.email}
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                type='number'
                                label='Teléfono'
                                name='phone'
                                value={values.phone}
                                onChange={editValues}
                                className="w-[250px] lg:w-[310px]"
                            />
                            {errorMessages.phone && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.phone}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-auto flex flex-col md:flex-row gap-3 mb-2">
                        <div>
                            <Input
                                type='number'
                                label='Identificación'
                                name='identification'
                                value={values.identification}
                                onChange={editValues}
                                className="w-[250px] lg:w-[310px]"
                                onKeyPress={allowOnlyNumbers}
                                inputMode="numeric"
                            />
                            {errorMessages.identification && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.identification}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex justify-end gap-3 mb-3'>
                    <ButtonCerrar onClose={onClose} />
                    <Button className='font-bold text-white' color="primary" type='submit'>
                        Actualizar
                    </Button>
                </div>
            </form>
        </div>
    );
};
