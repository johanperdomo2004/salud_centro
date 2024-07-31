import React, { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';

export const FormUpdateUsuario = ({ onClose, category, Listar }) => {

    const [dataRoles, setDataRoles] = useState([]);
    const [dataPositions, setDataPositions] = useState([]);

    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_id: '', // Cambiado de role_id a role_name
        position_id: '',
        course_id: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        identification: '',
        role_id: '',
        position_id: '',
        course_id: ''
    });

    const listData = async () => {
        try {
            const roles = await axiosClient.get('roles/list');
            const positions = await axiosClient.get('positions/list');

            setDataRoles(roles.data.data);
            setDataPositions(positions.data.data);

        } catch (error) {
            swal({
                title: "Error",
                text: "error.",
                icon: "warning",
                buttons: false,
                timer: 2000,
            });
        }
    }

    useEffect(() => {

        listData();

        if (category) {

            let dataName = category.nombre.split(" ");
            const name = dataName[0]
            const lastname = dataName[1]

            setValues({
                name: name || '',
                lastname: lastname || '',
                phone: category.phone || '',
                email: category.correo || '',
                identification: category.identification || '',
                role_id: category.role_id || '', // Cambiado de role_id a role_name
                position_id: category.position_id || '',
                course_id: category.course_id || '',
            });
        }
    }, [category]);

    useEffect(() => {
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const allowOnlyNumbers = (event) => {
        const isValidKey = /^\d$/.test(event.key);
        if (!isValidKey) {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = validateForm();

        if (hasError) return;

        try {
            // Preparar los datos para enviar en la solicitud PUT
            const dataToUpdate = {
                name: values.name,
                lastname: values.lastname,
                phone: values.phone,
                email: values.email,
                identification: values.identification,
                role_id: values.role_id,
                position_id: values.position_id
            };
            // Incluir course_id solo si position_id es '1' (aprendiz)
            if (values.position_id == '1') {
                dataToUpdate.course_id = values.course_id;
            }

            // Enviar solicitud PUT para actualizar el usuario
            await axiosClient.put(`usuario/actualizar/${category.codigo}`, dataToUpdate);

            // Mostrar mensaje de éxito usando SweetAlert
            swal({
                title: "Actualizado",
                text: "Usuario actualizado con éxito.",
                icon: "success",
                buttons: false,
                timer: 2000,
            });

            // Actualizar la lista y cerrar el modal o ventana
            Listar();
            onClose();

        } catch (error) {
            // Mostrar mensaje de error genérico o específico
            if (error.response && error.response.data && error.response.data.message) {
                swal({
                    title: "Error",
                    text: error.response.data.message, // Mostrar el mensaje específico del servidor
                    icon: "error",
                    buttons: {
                        confirm: "Salir",
                    },
                    timer: 1000,
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al registrar el Usuario.",
                    icon: "error",
                    buttons: {
                        confirm: "Salir",
                    },
                    timer: 1000,
                });
            }
        }
    };

    useEffect(() => {
    }, [values])

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            name: '',
            lastname: '',
            phone: '',
            email: '',
            identification: '',
            role_id: '',
            position_id: '',
            course_id: ''
        };
        if (!values.name.trim()) {
            newErrorMessages.name = 'El nombre es requerido.';
            hasError = true;
        } else if (/\d/.test(values.name.trim())) {
            newErrorMessages.name = 'El nombre no puede contener números.';
            hasError = true;
        } else if (values.name.trim().length < 3 || values.name.trim().length > 40) {
            newErrorMessages.name = 'El Nombre debe tener más de 3 Letras';
            hasError = true;
        }

        if (!values.lastname.trim()) {
            newErrorMessages.lastname = 'El apellido es requerido.';
            hasError = true;
        } else if (/\d/.test(values.lastname.trim())) {
            newErrorMessages.lastname = 'El apellido no puede contener números.';
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

        if (!values.email.trim()) {
            newErrorMessages.email = 'El correo electrónico es requerido.';
            hasError = true;
        } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
            newErrorMessages.email = 'El correo electrónico no es válido.';
            hasError = true;
        }

        if (!values.identification.trim()) {
            newErrorMessages.identification = 'El campo de identificación es requerido.';
            hasError = true;
        } else if (values.identification.trim().length < 6 || values.identification.trim().length > 10) {
            newErrorMessages.identification = 'El campo de identificación debe tener entre 6 y 10 caracteres.';
            hasError = true;
        }

        if (!values.role_id) {
            newErrorMessages.role_id = 'El Rol es requerido.';
            hasError = true;
        }

        if (!values.position_id) {
            newErrorMessages.position_id = 'El cargo es requerido.';
            hasError = true;
        }



        setErrorMessages(newErrorMessages);

        return hasError;
    };



    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                        <div className="w-auto flex gap-3 mb-2">
                            <div>
                                <Input
                                    type='text'
                                    label='Nombre Usuario'
                                    name='name'
                                    value={values.name}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
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
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.lastname && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.lastname}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2">
                            <div>
                                <Input
                                    type='text'
                                    label='Email'
                                    name='email'
                                    value={values.email}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
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
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.phone && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2">
                            <div>
                                <Input
                                    type='number'
                                    label='Identificación'
                                    name='identification'
                                    value={values.identification}
                                    onChange={handleInputChange}
                                    className="w-[310px]"
                                />
                                {errorMessages.identification && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.identification}
                                    </div>
                                )}
                            </div>
                            <div>
                                <select
                                    className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                                    value={values.position_id}
                                    name='position_id'
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>Seleccione un cargo</option>
                                    {dataPositions.map((position) => (
                                        <option key={position.position_id} value={position.position_id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                                {errorMessages.position_id && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.position_id}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-auto flex gap-3 mb-2">
                            {values.position_id == 1 && (
                                <div>
                                    <Input
                                        type='text'
                                        label='Id Ficha'
                                        name='course_id'
                                        value={values.course_id}
                                        onChange={handleInputChange}
                                        className="w-[310px]"
                                    />
                                    {errorMessages.course_id && (
                                        <div className="flex items-center text-red-500 text-xs mt-1">
                                            <FaExclamationCircle className="mr-2" />
                                            {errorMessages.course_id}
                                        </div>
                                    )}
                                </div>)}
                            <div>
                                <select
                                    className="w-[310px] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
                                    value={values.role_id}
                                    name='role_id'
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>Seleccione un rol</option>
                                    {dataRoles.map((role) => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errorMessages.role_id && (
                                    <div className="flex items-center text-red-500 text-xs mt-1">
                                        <FaExclamationCircle className="mr-2" />
                                        {errorMessages.role_id}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end gap-3 mb-3'>
                        <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className='font-bold text-white' color="primary" type='submit'>
                            Actualizar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
