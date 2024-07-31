import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormUpdateEmpaque = ({ onClose, category, Listar }) => {
  const [nombre, setNombre] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setNombre(category.name);
    }
  }, [category]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    let errorObject = {
      nombre: ''
    }

    if (!nombre || /\d/.test(nombre)) {
      errorObject.nombre = 'No puede contener números ni estar vacío';
      hasError = true;
    }

    if (hasError) {
      setErrors(errorObject);
      return;
    }

    try {
      await axiosClient.put(`empaque/actualizar/${category.codigo}`, {
        name: nombre,
      });
      swal({
        title: "Actualizado",
        text: "Empaque actualizado correctamente.",
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      onClose();
      Listar();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Empaque ya existe') {
        setErrors({ nombre: 'El empaque ya existe' });
      } else {
        setErrors({ nombre: 'El nombre del empaque ya existe' });
      }
    }
  };

  return (
    <div>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center'></div>
            <div className="relative mb-4 justify-center items-center h-[65px]" data-twe-input-wrapper-init>
              <Input
                type='text'
                label='Nombre Empaque'
                className="w-[100%]"
                color={errors.nombre ? 'danger' : ''}
                errorMessage={errors.nombre}
                isInvalid={errors.nombre}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className='flex justify-end gap-3 mb-3'>
              <Button color="danger" className='bg-[#BF2A50] font-bold text-white' onClick={onClose}>
                Cancelar
              </Button>
              <ButtonRegistrar label={"Actualizar"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
