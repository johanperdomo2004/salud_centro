import React, { useState, useEffect  } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { FaExclamationCircle } from 'react-icons/fa';
import swal from 'sweetalert';


export const FormDataUsuario = ({ onRegisterSuccess,category, onClose, Listar }) => {
    const [values, setValues] = useState({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        identification: "",
        role_id: "",
        position_id: "",
        course_id: ""
    });
    
const [dataRoles, setDataRoles] = useState([]);
const [dataPositions, setDataPositions] = useState([]);

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

    

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        let newValue = value;

        const maxLength = {
            lastname: 15,
            phone: 11,
            email: 50,
            identification: 11,
            role_id: 15,
            position_id: 15,
            course_id: 10
        };

        if (maxLength[name] && value.length > maxLength[name]) {
            newValue = value.slice(0, maxLength[name]);
        }

        if (name === 'role_id' || name === 'position_id' || name === 'course_id') {
            newValue = parseInt(newValue, 10);
        }

        setValues({
            ...values,
            [name]: newValue,
        });
    };

    const allowOnlyNumbers = (event) => {
        const isValidKey = /^\d$/.test(event.key);
        if (!isValidKey) {
            event.preventDefault();
        }
    };

    const handleForm = async (event) => {
        event.preventDefault();

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
            newErrorMessages.name = 'El nombre de usuario es requerido.';
            hasError = true;
        } else if (/\d/.test(values.name)) {
            newErrorMessages.name = 'El nombre de usuario no puede contener números.';
            hasError = true;
        } else if (values.name.trim().length < 3 || values.name.trim().length > 40) {
            newErrorMessages.name = 'El Nombre debe tener más de 3 Letras';
            hasError = true;
        }

        if (!values.lastname.trim()) {
            newErrorMessages.lastname = 'El apellido de usuario es requerido.';
            hasError = true;
        } else if (/\d/.test(values.lastname)) {
            newErrorMessages.lastname = 'El apellido de usuario no puede contener números.';
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
        

        if (!values.role_id.toString().trim()) {
            newErrorMessages.role_id = 'El campo de Rol es requerido.';
            hasError = true;
        }

        if (!values.position_id.toString().trim()) {
            newErrorMessages.position_id = 'El campo de Cargo es requerido.';
            hasError = true;
        }
        setErrorMessages(newErrorMessages);

        if (hasError) {
            return;
        }

        try {
            const response = await axiosClient.post('usuario/registrar', values);
        
            if (response.status === 200) {
                swal({
                    title: "Registro exitoso",
                    text: "El Usuario se ha registrado correctamente.",
                    icon: "success",
                    buttons: false,
                    timer: 2000,
                });
        
                setValues({
                    name: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    identification: "",
                    role_id: "",
                    position_id: "",
                    course_id: ""
                });
                Listar();
                // Llamar a onRegisterSuccess después de limpiar el formulario
                /* onRegisterSuccess(); */
            } else {
                throw new Error('Error al registrar el usuario');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.errors[0].msg;
        
                swal({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    buttons: {
                        confirm: 'Cerrar'
                    },
                    timer: 1000 
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al registrar el Usuario.",
                    icon: "error",
                    buttons: {
                        confirm: "Salir",
                    },
                    timer: 1000
                });
            }
        }
        
    };

    return (
        <div>
            <form onSubmit={handleForm}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-auto flex gap-3 mb-2'>
                        <div>
                            <Input
                                type='text'
                                label='Nombre Usuario'
                                name='name'
                                value={values.name}
                                onChange={handleInputChange}
                                className="w-[310px]"
                                maxLength={15}
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

                    <div className='w-auto flex gap-3 mb-2'>
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
                                label='Telefono'
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

                    <div className='w-auto flex gap-3 mb-2'>

                        <div>
                            <Input
                                type='number'
                                label='Identificacion'
                                name='identification'
                                value={values.identification}
                                onChange={handleInputChange}
                                className="w-[310px]"
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

                    <div className='w-auto flex gap-3 mb-2'>
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

                        {values.position_id == 1 && (
                        <div>
         
                            <Input
                                type='number'
                                label='Id ficha'
                                name='course_id'
                                value={values.course_id}
                                onChange={handleInputChange}
                                className="w-[310px]"
                                onKeyPress={allowOnlyNumbers}
                                inputMode="numeric"
                            />
                            {errorMessages.course_id && (
                                <div className="flex items-center text-red-500 text-xs mt-1">
                                    <FaExclamationCircle className="mr-2" />
                                    {errorMessages.course_id}
                                </div>
                            )}
                        </div>   )}
                    </div>


                </div>
                <div className='flex justify-end gap-3 mb-3'>
                    <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className='font-bold text-white' color="primary" type='submit'>
                        Registrar
                    </Button>
                </div>
            </form>
        </div>
    );
};
