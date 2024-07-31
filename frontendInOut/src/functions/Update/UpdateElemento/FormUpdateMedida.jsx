import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';


export const FormUpdateMedida = ({ onClose, category, Listar }) => {

  const [nombre, setNombre] = useState('');
  const [errors, setErros] = useState({});

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
      errorObject.nombre = 'No puede contener números no estar vacío';
      hasError = true;
    }

    if(hasError) {
      setErros(errorObject);
      return;
    }

    try {
      await axiosClient.put(`medida/actualizar/${category.codigo}`, {
        name: nombre,
      });
      swal({
        title: "Actualizado",
        text: "Medida actualizada con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000, 
    });
      onClose();
      Listar();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Empaque ya existe') {
        setErros({ nombre: 'La medida ya existe' });
      } else {
        setErros({ nombre: 'El nombre de la medida ya existe' });
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
                label='Nombre Medida'
                className="w-[100%]"
                color={errors.nombre ? 'danger' : ''}
                errorMessage={errors.nombre}
                isInvalid={errors.nombre}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className='flex justify-end gap-3 mb-3'>
              <ButtonCerrar onClose={onClose}/>
              <ButtonRegistrar label={"Actualizar"}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}