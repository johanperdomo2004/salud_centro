import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import axiosClient from '../../../components/config/axiosClient';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormUpdateUbicacion = ({ onClose, category, Listar }) => {
  const [bodegas, setBodegas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [bodega, setNombreBodega] = useState('');

  const [errors, setErrors] = useState({});

  const BodegasListar = async () => {
    try {
      const response = await axiosClient.get('bodega/listar');
      setBodegas(response.data.data);
    } catch (error) {
      swal("Error", "Hubo un problema al cargar las bodegas", "error");
    }
  };

  useEffect(() => {
    if (category) {
      setNombre(category.name);
      setNombreBodega(category.code_warehouse);
    }
    BodegasListar();
  }, [category]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    let errorObject = {
      nombre: '',
      bodega: ''
    }

    if (!nombre) {
      errorObject.nombre = 'El nombre es obligatorio';
      hasError = true;
    }

    if (!bodega) {
      errorObject.bodega = 'La bodega es obligatoria';
      hasError = true;
    }

    if (hasError) {
      setErrors(errorObject);
      return;
    }

    try {
      await axiosClient.put(`ubicacion/actualizar/${category.codigo}`, {
        name: nombre,
        warehouse_id: bodega,
      });
      swal({
        title: "Actualizado",
        text: "Ubicación actualizada con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      onClose();
      Listar();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Empaque ya existe') {
        setErrors({ nombre: 'La ubicación ya existe' });
      } else {
        setErrors({ nombre: 'El nombre de la ubicación ya existe' });
      }
    }
  };

  return (
    <div>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-3 justify-center items-center'>
            <div className="w-full" data-twe-input-wrapper-init>
              <Input
                type='text'
                label='Nombre Ubicación'
                className="w-[100%]"
                color={errors.nombre ? 'danger' : ''}
                errorMessage={errors.nombre}
                isInvalid={errors.nombre}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="w-full" data-twe-input-wrapper-init>
              <select
                className={`${errors.bodega ? 'bg-[#fee7ef] hover:bg-[#fdd0df] text-red-500' : 'bg-[#F4F4F5]'} border border-gray-300 w-[100%] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
                value={bodega}
                onChange={(e) => setNombreBodega(e.target.value)}
              >
                <option value="" disabled>Seleccione una bodega</option>
                {bodegas.map((bodega) => (
                  <option key={bodega.warehouse_id} value={bodega.warehouse_id}>
                    {bodega.name}
                  </option>
                ))}
              </select>
              {errors.bodega && <span className='text-[10px] text-left text-xs w-full pl-3 text-red-500'>{errors.bodega}</span>}
            </div>
            <div className='w-full flex justify-end gap-3 mb-3'>
              <ButtonCerrar onClose={onClose} />
              <ButtonRegistrar label={"Actualizar"} />
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
