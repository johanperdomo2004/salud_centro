import React, { useState, useEffect } from 'react';
import axiosClient from '../../../components/config/axiosClient';
import { Input } from "@nextui-org/react";
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import * as listarFunciones from '../../Listar'; // Importa todas las funciones de listar.js
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';

export const FormDataElemento = ({ listar, onClose }) => {
  const [UseTipo, SetTipo] = useState([]);
  const [UseCategorias, setCategorias] = useState([]);
  const [UseEmpaques, SetEmpaques] = useState([]);
  const [UseMedidas, SetMedidas] = useState([]);
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    name: "",
    elementType_id: "",
    measurementUnit_id: "",
    category_id: "",
    packageType_id: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipoData, categoriasData, empaquesData, medidasData] = await Promise.all([
          listarFunciones.ListarTipo(),
          listarFunciones.ListarCategorias(),
          listarFunciones.ListarEmpaques(),
          listarFunciones.ListarMedidas()
        ]);
        SetTipo(tipoData || []);
        setCategorias(categoriasData || []);
        SetEmpaques(empaquesData || []);
        SetMedidas(medidasData || []);
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
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === 'name' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;

    setValues({
      ...values,
      [name]: formattedValue,
    });
  };

  const handleForm = async (event) => {
    event.preventDefault();

    let hasError = false;

    let errorsObject = {
      name: '',
      elementType_id: '',
      measurementUnit_id: '',
      category_id: '',
      packageType_id: ''
    }

    if (!values.name) {
      errorsObject.name = 'No puede estar vacío';
      hasError = true;
    }

    if (!values.elementType_id) {
      errorsObject.elementType_id = 'No puede estar vacío';
      hasError = true;
    }

    if (!values.measurementUnit_id) {
      errorsObject.measurementUnit_id = 'No puede estar vacío';
      hasError = true;
    }

    if (!values.category_id) {
      errorsObject.category_id = 'No puede estar vacío';
      hasError = true;
    }

    if (!values.packageType_id) {
      errorsObject.packageType_id = 'No puede estar vacío';
      hasError = true;
    }

    if (hasError) {
      setErrors(errorsObject);
      return;
    }

    try {
      const response = await axiosClient.post('elemento/registrar', values);
      if (response.status === 200) {
        setValues({
          name: "",
          elementType_id: "",
          measurementUnit_id: "",
          category_id: "",
          packageType_id: ""
        });
        swal({
          title: "Registro exitoso",
          text: "El Elemento se ha registrado correctamente.",
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
      <form onSubmit={handleForm}>
        <div className='flex flex-col justify-center items-center gap-3 mb-4'>
          <div className='w-full'>
            <Input
              type='text'
              label='Nombre Elemento'
              name='name'
              color={errors.name ? 'danger' : ''}
              errorMessage={errors.name}
              isInvalid={errors.name}
              value={values.name}
              onChange={handleInputChange}
              className="w-[100%]"
            />
          </div>
          <div className='w-full'>
            <select
              name="elementType_id"
              value={values.elementType_id}
              onChange={handleInputChange}
              className={`${errors.elementType_id ? 'bg-[#fee7ef] hover:bg-[#fdd0df] text-red-500' : 'bg-[#F4F4F5]'} border border-gray-300 w-[100%] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
            >
              <option value="" disabled>Seleccione un tipo de elemento</option>
              {UseTipo.length > 0 ? (
                UseTipo.map(tipo => (
                  <option
                    value={tipo.elementType_id}
                    key={tipo.name}
                  >
                    {tipo.name}
                  </option>
                ))
              ) : (
                <option disabled>No hay tipos disponibles</option>
              )}
            </select>
            {errors.elementType_id && <span className='text-[10px] text-left text-xs w-full pl-3 text-red-500'>{errors.elementType_id}</span>}
          </div>
          <div className='w-full'>
            <select
              name="measurementUnit_id"
              value={values.measurementUnit_id}
              onChange={handleInputChange}
              className={`${errors.measurementUnit_id ? 'bg-[#fee7ef] hover:bg-[#fdd0df] text-red-500' : 'bg-[#F4F4F5]'} border border-gray-300 w-[100%] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
            >
              <option value="" disabled>Seleccione un tipo de medida</option>
              {UseMedidas.length > 0 ? (
                UseMedidas.map(medida => (
                  <option
                    value={medida.measurementUnit_id}
                    key={medida.name}
                  >
                    {medida.name}
                  </option>
                ))

              ) : (
                <option disabled>No hay tipos de medida disponibles</option>
              )}
            </select>
            {errors.measurementUnit_id && <span className='text-[10px] text-left text-xs w-full pl-3 text-red-500'>{errors.measurementUnit_id}</span>}
          </div>
          <div className='w-full'>
            <select
              name='category_id'
              value={values.category_id}
              onChange={handleInputChange}
              className={`${errors.category_id ? 'bg-[#fee7ef] hover:bg-[#fdd0df] text-red-500' : 'bg-[#F4F4F5]'} border border-gray-300 w-[100%] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
            >
              <option value="" disabled>Seleccione una categoría</option>
              {UseCategorias.length > 0 ? (
                UseCategorias.map(categoria => (
                  <option
                    value={categoria.category_id}
                    key={categoria.name}
                  >
                    {categoria.name}
                  </option>
                ))
              ) : (
                <option disabled>No hay categorías disponibles</option>
              )}
            </select>
            {errors.category_id && <span className='text-[10px] text-left text-xs w-full pl-3 text-red-500'>{errors.category_id}</span>}
          </div>
          <div className='w-full'>
            <select
              name='packageType_id'
              value={values.packageType_id}
              onChange={handleInputChange}
              className={`${errors.packageType_id ? 'bg-[#fee7ef] hover:bg-[#fdd0df] text-red-500' : 'bg-[#F4F4F5]'} border border-gray-300 w-[100%] h-[58px] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5`}
            >
              <option value="" disabled>Seleccione un empaque</option>
              {UseEmpaques.length > 0 ? (
                UseEmpaques.map(empaque => (
                  <option
                    value={empaque.packageType_id}
                    key={empaque.name}
                  >
                    {empaque.name}
                  </option>
                ))
              ) : (
                <option disabled>No hay empaques disponibles</option>
              )}
            </select>
            {errors.packageType_id && <span className='text-[10px] text-left text-xs w-full pl-3 text-red-500'>{errors.packageType_id}</span>}
          </div>
        </div>
        <div className='w-full flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose} />
          <ButtonRegistrar label={"Registrar"} />
        </div>
      </form>
    </div>
  );
};

export default FormDataElemento;
