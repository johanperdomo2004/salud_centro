import React, { useState, useEffect } from 'react';
import { Input, Button } from "@nextui-org/react";
import axiosClient from '../../../components/config/axiosClient';
import swal from 'sweetalert';
import { FaExclamationCircle } from 'react-icons/fa';
import { ListarTipo, ListarMedidas, ListarCategorias, ListarEmpaques } from '../../Listar';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormUpdateElemento = ({ onClose, category, Listar }) => {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [medida, setMedida] = useState('')
  const [categoria, setCategoria] = useState('')
  const [empaque, setEmpaque] = useState('')
  const [errors, setErrors] = useState({})

  const [tipos, setTipos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empaques, SetEmpaques] = useState([]);

  useEffect(() => {
    if (category) {
      setNombre(category.name)
      setTipo(category.code_elementType)
      setMedida(category.code_Unit)
      setCategoria(category.code_Category)
      setEmpaque(category.code_Package)
    }
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposData, MedidasData, CategoriasData, EmpaquesData] = await Promise.all([
          ListarTipo(),
          ListarMedidas(),
          ListarCategorias(),
          ListarEmpaques()
        ]);

        setTipos(tiposData);
        setMedidas(MedidasData);
        setCategorias(CategoriasData);
        SetEmpaques(EmpaquesData);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;
    let errorsObject = {};

    if (!nombre) {
      errorsObject.nombre = 'No puede estar vacío';
      hasError = true;
    }

    if (hasError) {
      setErrors(errorsObject);
      return; // Detener el envío del formulario si hay errores
    }

    try {
      await axiosClient.put(`elemento/actualizar/${category.codigo}`, {
        name: nombre,
        elementType_id: tipo,
        measurementUnit_id: medida,
        category_id: categoria,
        packageType_id: empaque
      });
      swal({
        title: "Actualizado",
        text: "Elemento actualizado con éxito.",
        icon: "success",
        buttons: false,
        timer: 2000,
      });
      onClose();
      Listar(); // Actualiza la lista de elementos
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Empaque ya existe') {
        setErrors({ nombre: 'El elemento ya existe' });
      } else {
        setErrors({ nombre: 'El nombre del elemeneto ya existe' });
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col justify-center items-center gap-3 mb-4'>
          <div className='w-full'>
            <Input
              type='text'
              label='Nombre Elemento'
              className="w-full"
              color={errors.nombre ? 'danger' : ''}
              errorMessage={errors.nombre}
              isInvalid={errors.nombre}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="" disabled>Seleccione un Tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo.elementType_id} value={tipo.elementType_id}>
                {tipo.name}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <div className="flex items-center text-red-500 text-xs mt-1">
              <FaExclamationCircle className="mr-2" />
              {errors.tipo}
            </div>
          )}
          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={medida}
            onChange={(e) => setMedida(e.target.value)}
          >
            <option value="" disabled>Seleccione una medida</option>
            {medidas.map((medida) => (
              <option key={medida.measurementUnit_id} value={medida.measurementUnit_id}>
                {medida.name}
              </option>
            ))}
          </select>
          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="" disabled>Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.category_id} value={categoria.category_id}>
                {categoria.name}
              </option>
            ))}
          </select>
          <select
            className="w-[100%] h-[58px] p-2 border rounded-xl text-sm text-[#1c1c1cff] bg-[#f5f5f5ff]"
            value={empaque}
            onChange={(e) => setEmpaque(e.target.value)}
          >
            <option value="" disabled>Seleccione un Empaque</option>
            {empaques.map((empaque) => (
              <option key={empaque.packageType_id} value={empaque.packageType_id}>
                {empaque.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose} />
          <ButtonRegistrar label={"Actualizar"} />
        </div>
      </form>
    </div>
  );
};
