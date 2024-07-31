import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';

export const FormUpdateBodega = ({ onClose, category, Listar }) => {

    const [nombre, setNombre] = useState('')
    const [errors, setErrors] = useState({
        nombre: '',
    })

    useEffect(() => {
        if (category) {
            setNombre(category.name);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = false;

        let errorObject = {
            nombre: ''
        }

        if (!nombre) {
            errorObject.nombre = 'Debe ingresar una unidad productiva.';
            hasError = true;
        }

        if (hasError) {
            setErrors(errorObject);
            return;
        }

        try {
            const response = await axiosClient.put(`bodega/actualizar/${category.codigo}`, {
                name: nombre
            });
            if (response.status === 200) {
                swal({
                    title: "Actualizado",
                    text: "La unidad productiva se ha actualizada con éxito",
                    icon: "success",
                    button: false,
                    timer: 1500,
                });
            }
            onClose();
            Listar();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === 'Empaque ya existe') {
                setErrors({ nombre: 'La bodega ya existe' });
              } else {
                setErrors({ nombre: 'El nombre de la bodega ya existe' });
              }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='w-[100%] flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-[100%]'>
                        <Input
                            type='text'
                            label='Nombre Bodega'
                            color={errors.nombre ? 'danger' : ''}
                            errorMessage={errors.nombre}
                            isInvalid={errors.nombre}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-[100%]"
                        />
                    </div>
                </div>
                <div className='flex justify-end gap-3 mb-3'>
                    <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className='font-bold text-white' color="success" type='submit'>
                        Actualizar
                    </Button>
                </div>
            </form>
        </div>
    );
};
