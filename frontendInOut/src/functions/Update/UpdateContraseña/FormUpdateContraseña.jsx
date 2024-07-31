import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import axiosClient from '../../../components/config/axiosClient';
import Swal from 'sweetalert2';

export const FormUpdateContraseña = ({ onClose, Listar }) => {
    const [values, setValues] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const togglePasswordVisibility = (type) => {
        switch (type) {
            case 'password':
                setShowPassword(!showPassword);
                break;
            case 'newPassword':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirmPassword':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = validateForm();

        if (hasError) return;

        try {
            const userId = localStorage.getItem('user_id');
            const dataToUpdate = {
                password: values.password,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };

            const response = await axiosClient.put(`/usuario/contrasena/${userId}`, dataToUpdate);

            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: response.data.message,
                timer: 2000,
    
            });
            onClose();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contraseña Actual Incorrecta,intenta nuevamente.',
                timer: 1000,
            });
        }
    };

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        };

        if (values.newPassword.length < 8) {
            newErrorMessages.newPassword = 'La contraseña debe tener al menos 8 caracteres.';
            hasError = true;
        }
        if (!values.password.trim()) {
            newErrorMessages.password = 'La contraseña actual es Requerida.';
            hasError = true;
        }
        if (!values.newPassword.trim()) {
            newErrorMessages.newPassword = 'La nueva contraseña es requerida.';
            hasError = true;
        }
        if (!values.confirmPassword.trim()) {
            newErrorMessages.confirmPassword = 'La Confirmación de nueva contraseña es requerida.';
            hasError = true;
        }

        if (values.newPassword !== values.confirmPassword) {
            newErrorMessages.confirmPassword = 'Las contraseñas no coinciden.';
            hasError = true;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(values.newPassword)) {
            newErrorMessages.newPassword = 'La contraseña debe contener al menos una letra minúscula y una mayúscula.';
            hasError = true;
        }

        setErrorMessages(newErrorMessages);

        return hasError;
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className="relative w-full">
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label='Contraseña Actual'
                                name='password'
                                value={values.password}
                                onChange={handleInputChange}
                                className="w-full pr-12"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center"
                                onClick={() => togglePasswordVisibility('password')}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errorMessages.password && (
                            <div className="flex items-center text-red-500 text-xs mt-1">
                            
                                {errorMessages.password}
                            </div>
                        )}
                    </div>

                    <div className="relative w-full">
                        <div className="relative">
                            <Input
                                type={showNewPassword ? 'text' : 'password'}
                                label='Nueva Contraseña'
                                name='newPassword'
                                value={values.newPassword}
                                onChange={handleInputChange}
                                className="w-full pr-12"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center"
                                onClick={() => togglePasswordVisibility('newPassword')}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errorMessages.newPassword && (
                            <div className="flex items-center text-red-500 text-xs mt-1">
                             
                                {errorMessages.newPassword}
                            </div>
                        )}
                    </div>

                    <div className="relative w-full">
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                label='Confirmar Nueva Contraseña'
                                name='confirmPassword'
                                value={values.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full pr-12"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errorMessages.confirmPassword && (
                            <div className="flex items-center text-red-500 text-xs mt-1">
                         
                                {errorMessages.confirmPassword}
                            </div>
                        )}
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
    );
};
