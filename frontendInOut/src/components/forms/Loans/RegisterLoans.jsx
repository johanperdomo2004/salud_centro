import React, { useState, useMemo, useEffect } from 'react';
import {
    Autocomplete,
    AutocompleteItem,
    Input,
    Button,
    Textarea
} from '@nextui-org/react';
import { ListarUsuarios, ListarElementos } from '../../../functions/Listar';
import { capitalize } from '../../../utils/columnsData';
import axiosClient from '../../config/axiosClient';
import AutocompleteMine from '../../AutoCompleteMine';

export const RegisterLoans = ({ onClose, listarMovimientos }) => {

    const [errors, setErrors] = useState({
        user_application: '',
        element_id: '',
        quantity: '',
        estimated_return: '',
    });

    const objectRegister = {
        user_application: null,
        estimated_return: null,
        details: [{
            element_id: '',
            quantity: 0,
            remarks: ''
        }]
    }

    //Guardar la información que se envia para un nuevo registro
    const [newRegister, setNewRegister] = useState(objectRegister);
    const [usersData, setUsersData] = useState([]);
    const [elementsData, setElementsData] = useState([]);
    const [editIndex, setEditIndex] = useState(0);
    const [minDate, setMinDate] = useState('');

    const addDetail = () => {

        const lastDetail = newRegister.details[newRegister.details.length - 1];

        let hasError = false;

        let objectError = {
            user_application: '',
            element_id: '',
            quantity: '',
            estimated_return: '',
        }

        // Validar que el último detalle tenga `element_id` y `quantity`
        if (!lastDetail.element_id) {
            objectError.element_id = 'Debes seleccionar un elemento antes de agregar otro detalle';
            hasError = true;
        }

        if (!lastDetail.quantity) {
            objectError.quantity = 'Debes colocar una cantidad antes de agregar otro detalle';
            hasError = true;
        }

        if (hasError) {
            setErrors(objectError)
            return
        }

        setNewRegister(prevData => ({
            ...prevData,
            details: [...prevData.details, { element_id: '', quantity: 0, remarks: '' }]
        }));

        setEditIndex(newRegister.details.length)

        // Limpiar los errores al agregar un nuevo detalle correctamente
        setErrors({
            user_application: '',
            element_id: '',
            quantity: '',
            estimated_return: '',
        });
    };

    const removeDetail = (index) => {
        setNewRegister(prevData => ({
            ...prevData,
            details: prevData.details.filter((_, i) => i !== index)
        }));
    };

    const handleDetailChange = (index, field, value) => {
        setNewRegister(prevData => ({
            ...prevData,
            details: prevData.details.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        }));
    };

    const list = async () => {
        try {
            const users = await ListarUsuarios();
            const elements = await ListarElementos();

            setUsersData(users);
            setElementsData(elements);
        } catch (error) {
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    }

    const filteredItems = useMemo(() => {
        if (elementsData.length > 0) {
            const info = elementsData.filter(item => item.code_elementType == 2);
            return info;
        };

        return [];
    }, [elementsData]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let res = validateForm();
        if (res) return;

        try {
            const register = await axiosClient.post('movimientos/register-loan-in-warehouse', newRegister);

            const status = register.status >= 200 && register.status <= 210 ? true : false

            swal({
                title: "Registro exitoso",
                text: "La categoría se ha registrado correctamente.",
                icon: `${status ? 'success' : "warning"}`,
                buttons: false,
                timer: 2000,
            });
            listarMovimientos();
            onClose();
        } catch (error) {
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    }

    const validateForm = () => {
        let hasError = false;
        let newErrorMessages = {
            user_application: '',
            element_id: '',
            quantity: '',
            estimated_return: '',
        };

        if (!newRegister.user_application) {
            newErrorMessages.user_application = 'Debes seleccionar un usuario';
            hasError = true;
        }

        if (!newRegister.estimated_return) {
            newErrorMessages.estimated_return = 'Debes seleccionar una fecha estimada de devolución';
            hasError = true;
        }

        if (newRegister.estimated_return && (new Date(newRegister.estimated_return) < new Date(minDate))) {
            newErrorMessages.estimated_return = `Debes seleccionar una fecha mayor a ${minDate}`;
            hasError = true;
        }

        const lastDetailIndex = newRegister.details.length - 1;
        const lastDetail = newRegister.details[lastDetailIndex];

        if (!lastDetail.element_id) {
            newErrorMessages.element_id = 'Debes seleccionar un Elemento';
            hasError = true;
        }

        if (!lastDetail.quantity) {
            newErrorMessages.quantity = 'Debes colocar una cantidad';
            hasError = true;
        }

        setErrors(newErrorMessages);

        return hasError;
    };

    useEffect(() => {
        list();
        const date = getTargetDate();
        const dateString = date.toISOString()
        setNewRegister(precData => ({
            ...precData,
            estimated_return: dateString.slice(0, 16)
        }));

        const now = new Date();
        now.setHours(now.getHours() - 5);
        const formattedNow = (now).toISOString().slice(0, 16);
        setMinDate(formattedNow);
    }, [])

    useEffect(() => {
        const num = newRegister.details.length;
        if (num == 1) {
            setEditIndex(0)
        }
    }, [newRegister]);

    useEffect(() => {
        const handleErrors = () => {
            let newErrorMessages = { ...errors };

            if (newRegister.user_application) {
                newErrorMessages.user_application = '';
            }

            if (newRegister.details[0].element_id) {
                newErrorMessages.element_id = '';
            }

            if (newRegister.details[0].quantity) {
                newErrorMessages.quantity = '';
            }

            if (newRegister.estimated_return) {
                newErrorMessages.estimated_return = '';
            }

            setErrors(newErrorMessages);
        };

        handleErrors();
    }, [newRegister]);

    const getTargetDate = () => {
        const now = new Date();
        const currentHour = now.getUTCHours(); // Obtener la hora actual en UTC
        let targetDate;

        if (currentHour < 17) {
            // Si la hora actual es antes de las 5 de la tarde UTC
            targetDate = new Date(now);
        } else {
            // Si la hora actual es después de las 5 de la tarde UTC
            targetDate = new Date(now);
            targetDate.setUTCDate(targetDate.getUTCDate() + 1);
        }

        targetDate.setUTCHours(17, 0, 0, 0); // Establecer la hora a las 5 de la tarde UTC
        // Ajustar la fecha según la diferencia de zona horaria (por ejemplo, UTC-5)
        const offsetHours = 5; // Diferencia de horas
        targetDate.setHours(targetDate.getHours());

        return targetDate;
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='w-full flex gap-3 mb-2'>
                        <Autocomplete
                            aria-label='autocomplete-users'
                            label="Seleccionar el usuario"
                            placeholder="Busca un usuario"
                            isRequired
                            isInvalid={errors.user_application ? true : false}
                            errorMessage={errors.user_application}
                            className='h-[60px]'
                            onSelectionChange={(value) => {
                                const element = value;
                                setNewRegister(precData => ({
                                    ...precData,
                                    user_application: parseInt(value)
                                }));
                            }}
                        >
                            {usersData.map((user) => (
                                <AutocompleteItem
                                    key={user.codigo}
                                    value={user.codigo}
                                >
                                    {user.identification + ' - ' + capitalize(user.nombre)}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>

                    {newRegister.details.map((detail, index) => (
                        <div className='w-full flex flex-col justify-center items-center' key={index}>
                            <span>Detalle {index + 1}</span>
                            {editIndex === index ? (
                                <>
                                    <div className='w-full flex gap-3'>
                                        <div className='w-[70%]'>
                                            <AutocompleteMine
                                                items={filteredItems}
                                                handleDetailChange={handleDetailChange}
                                                index={index}
                                                errors={errors}
                                                newRegister={newRegister}
                                            />
                                        </div>
                                        <div className='w-[30%]'>
                                            <Input
                                                isRequired
                                                type="number"
                                                label="Cantidad"
                                                placeholder='Ingresa una cantidad'
                                                isInvalid={errors.quantity}
                                                errorMessage={errors.quantity}
                                                color={errors.quantity && 'danger'}
                                                min={0}
                                                value={newRegister.details[index].quantity ? newRegister.details[index].quantity : null}
                                                onChange={(e) => {
                                                    let nuevaCantidad = parseInt(e.target.value);
                                                    if (isNaN(nuevaCantidad)) nuevaCantidad = null;
                                                    handleDetailChange(index, 'quantity', nuevaCantidad);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <Textarea
                                            isRequired
                                            type="text"
                                            label="Observaciones"
                                            placeholder=''
                                            labelPlacement="outside"
                                            value={newRegister.details[index].remarks}
                                            min={0}
                                            onChange={(e) => {
                                                handleDetailChange(index, 'remarks', e.target.value);
                                            }}
                                        />
                                    </div>
                                    {(newRegister.details.length > 1) && <Button onClick={() => removeDetail(index)} color='danger' size='sm' className='text-white font-bold w-[10%]'>Eliminar</Button>}
                                </>
                            ) : (
                                <div className='flex w-full justify-center items-center gap-2'>
                                    <div className='flex w-[33%] items-center justify-center'>
                                        <span>{filteredItems.find(item => item.codigo === detail.element_id)?.name || 'No se ha seleccionado'}</span>
                                    </div>
                                    <div className='flex w-[25%] items-center justify-center'>
                                        <span>{detail.quantity}</span>
                                    </div>
                                    {(newRegister.details.length > 1) && <Button onClick={() => removeDetail(index)} color='danger' size='sm' className='text-white font-bold w-[10%]'>Eliminar</Button>}
                                </div>
                            )}
                        </div>
                    ))}
                    <Button onClick={addDetail} color='primary' className='text-white font-bold'>Agregar Detalle</Button>
                    <div className='w-auto'>
                        <div className={`relative px-3 cursor-text tap-highlight-transparent shadow-sm  focus-within:hover:bg-default-100 group-data-[invalid=true]:bg-danger-50 group-data-[invalid=true]:hover:bg-danger-100 group-data-[invalid=true]:focus-within:hover:bg-danger-50 min-h-10 rounded-medium flex-col  justify-center gap-0 w-full transition-background motion-reduce:transition-none !duration-150 h-14 py-2 flex items-center ${errors.estimated_return ? 'bg-[#fee7ef] hover:bg-[#fdd0df]' : 'bg-default-100 hover:bg-default-200 '}`}>
                            <span className="block subpixel-antialiased text-default-600 group-data-[required=true]:after:content-['*'] group-data-[required=true]:after:text-danger group-data-[required=true]:after:ml-0.5 group-data-[invalid=true]:text-danger w-full text-tiny cursor-text !ease-out !duration-200 will-change-auto motion-reduce:transition-none transition-[color,opacity] ">Fecha de devolución <span className='text-red-500'>*</span> </span>
                            <input
                                className={`flex items-center  text-[14px] w-full gap-x-2 h-6 bg-transparent   ${errors.estimated_return ? 'text-red-500' : 'text-default-400'} `}
                                type="datetime-local"
                                name='estimated_return'
                                value={newRegister.estimated_return}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (value) { // Verificar si el nuevo valor es un número
                                        setNewRegister(precData => ({
                                            ...precData,
                                            estimated_return: value
                                        }));
                                    }
                                }}
                            />

                        </div>
                        {
                            errors.estimated_return && <span className='text-tiny text-danger'>{errors.estimated_return}</span>
                        }
                    </div>
                    <div className='flex justify-end gap-3 mt-2'>
                        <Button color='success' className='text-white font-bold' type='submit'>Registrar</Button>
                        <Button onClick={onClose} color='danger' className='text-white font-bold'>Cancelar</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
