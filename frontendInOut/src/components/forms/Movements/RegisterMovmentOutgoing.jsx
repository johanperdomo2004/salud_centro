import React, { useEffect, useState, useMemo } from "react";
import {
    Autocomplete,
    AutocompleteItem,
    Checkbox,
    Input,
    Button,
    Textarea
} from '@nextui-org/react';
import { ListarUsuarios } from "../../../functions/Listar";
import { ListarElementos } from "../../../functions/Listar";
import { Listarbodegas } from "../../../functions/Listar";
import { Listarubicacion } from "../../../functions/Listar";
import { capitalize } from "../../../utils/columnsData";
import swal from "sweetalert";
import axiosClient from "../../config/axiosClient";
import AutocompleteMine from "../../AutoCompleteMine";

export const RegisterMovmentOutgoing = ({ onClose, listarMovements }) => {

    const [errors, setErrors] = useState({
        user_application: '',
        element_id: '',
        quantity: '',
        expiration: '',
        warehouse: '',
        location: '',
    })

    const [warehouse, setWarehouse] = useState(null);
    const [checkUser, setCheckUser] = useState(false);

    const [dataUsers, setDataUsers] = useState([]);
    const [dataElements, setDataElements] = useState([]);
    const [dataWarehouses, setDataWarehouses] = useState([]);
    const [dataLocations, setDataLocations] = useState([]);

    const [editIndex, setEditIndex] = useState(0);

    const objectOutgoing = {
        user_application: null,
        details: [{
            element_id: null,
            quantity: null,
            remarks: null,
            warehouseLocation_id: null,
        }]
    }

    const [outgoingData, setOutgoing] = useState(objectOutgoing);

    const filteredItems = useMemo(() => {
        if (dataLocations.length > 0) {
            const info = dataLocations.filter(item => item.code_warehouse == warehouse);
            return info;
        };

        return [];
    }, [dataLocations, warehouse]);

    const list = async () => {
        try {
            const users = await ListarUsuarios();
            const elements = await ListarElementos();
            const warehouses = await Listarbodegas();
            const locations = await Listarubicacion();

            setDataUsers(users)
            setDataElements(elements);
            setDataWarehouses(warehouses.data);
            setDataLocations(locations.data);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const res = validateForm();

        if (res) return;

        try {
            const register = await axiosClient.post('movimientos/register-outgoing', outgoingData);

            const status = register.status >= 200 && register.status <= 210 ? true : false

            swal({
                title: "Registro exitoso",
                text: "La categoría se ha registrado correctamente.",
                icon: `${status ? 'success' : "warning"}`,
                buttons: false,
                timer: 2000,
            });

            listarMovements();
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
            expiration: '',
            warehouse: '',
            location: '',
        };

        const index = outgoingData.details.length - 1;

        if (checkUser && !outgoingData.user_application) {
            newErrorMessages.user_application = 'Debes seleccionar un usuario';
            hasError = true;
        }

        if (!outgoingData.details[index].element_id) {
            newErrorMessages.element_id = 'Debes seleccionar un Elemento';
            hasError = true;
        }

        if (!outgoingData.details[index].quantity) {
            newErrorMessages.quantity = 'Debes colocar una cantidad';
            hasError = true;
        }

        if (!warehouse) {
            newErrorMessages.warehouse = 'Debes elegir una bodega';
            hasError = true;
        }

        if (!outgoingData.details[index].warehouseLocation_id) {
            newErrorMessages.location = 'Debes elegir una ubicacion en Bodega';
            hasError = true;
        }

        setErrors(newErrorMessages);

        return hasError;
    };

    useEffect(() => {
        list();
    }, [])

    useEffect(() => {
        const num = outgoingData.details.length;
        if (num == 1) {
            setEditIndex(0)
        }
    }, [outgoingData])

    useEffect(() => {
        const handleErrors = () => {
            let newErrorMessages = { ...errors };

            let iDetail = outgoingData.details.length - 1;

            if (checkUser && outgoingData.user_application) {
                newErrorMessages.user_application = '';
            }

            if (outgoingData.details[iDetail].element_id) {
                newErrorMessages.element_id = '';
            }

            if (outgoingData.details[iDetail].quantity) {
                newErrorMessages.quantity = '';
            }

            if (warehouse) {
                newErrorMessages.warehouse = '';
            }

            if (outgoingData.details[iDetail].warehouseLocation_id) {
                newErrorMessages.location = '';
            }
            setErrors(newErrorMessages);
        };

        handleErrors();
    }, [outgoingData, checkUser]);

    const addDetail = () => {

        const lastDetail = outgoingData.details[outgoingData.details.length - 1];

        let hasError = false;

        let objectError = {
            user_application: '',
            element_id: '',
            quantity: '',
            location: '',
            warehouse: ''
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

        if (!warehouse) {
            objectError.warehouse = 'Debes elegir la ubicacion';
            hasError = true;
        }

        if (!lastDetail.warehouseLocation_id) {
            objectError.location = 'Debes elegir la ubicacion especifica';
            hasError = true;
        }

        if (hasError) {
            setErrors(objectError)
            return
        }

        setOutgoing(prevData => ({
            ...prevData,
            details: [...prevData.details, {
                element_id: null,
                quantity: null,
                remarks: null,
                warehouseLocation_id: null,
            }]
        }));
        setEditIndex(outgoingData.details.length)
        // Limpiar los errores al agregar un nuevo detalle correctamente
        setErrors({
            user_application: '',
            element_id: '',
            quantity: '',
            location: '',
            warehouse: ''
        });
    };

    const removeDetail = (index) => {
        setOutgoing(prevData => ({
            ...prevData,
            details: prevData.details.filter((_, i) => i !== index)
        }));
    };

    const handleDetailChange = (index, field, value) => {
        setOutgoing(prevData => ({
            ...prevData,
            details: prevData.details.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        }));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col justify-center items-center gap-3 mb-4'>
                    <div className='flex gap-3 mb-2 w-full'>
                        <div className='w-1/4 flex justify-center items-center'>
                            <Checkbox
                                onChange={() => {
                                    setCheckUser(!checkUser)
                                    if (checkUser) {
                                        setOutgoing(precData => ({
                                            ...precData,
                                            user_application: null
                                        }))
                                    }
                                }}
                                color='success'>
                                Solicitante
                            </Checkbox>
                        </div>
                        <div className='w-3/4'>
                            {checkUser &&
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
                                        setOutgoing(precData => ({
                                            ...precData,
                                            user_application: parseInt(value)
                                        }));
                                    }}
                                >
                                    {dataUsers.map((user) => (
                                        <AutocompleteItem
                                            key={user.codigo}
                                            value={user.codigo}
                                        >
                                            {user.identification + ' - ' + capitalize(user.nombre)}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>}
                        </div>
                    </div>
                    {outgoingData.details.map((detail, index) => (
                        <div className='w-full flex gap-3 flex-col items-center' key={index}>
                            <span>Detalle {index + 1}</span>
                            {editIndex === index ? (
                                <>
                                    <div className='w-full flex gap-3'>
                                        <div className='w-3/4'>
                                            <AutocompleteMine
                                                items={dataElements}
                                                handleDetailChange={handleDetailChange}
                                                index={index}
                                                errors={errors}
                                                newRegister={outgoingData}
                                            />
                                        </div>
                                        <div className='w-1/4'>
                                            <Input
                                                isRequired
                                                type="number"
                                                label="Cantidad"
                                                placeholder='Ingresa una cantidad'
                                                isInvalid={errors.quantity ? true : false}
                                                errorMessage={errors.quantity}
                                                color={errors.quantity && 'danger'}
                                                min={0}
                                                value={outgoingData.details[index].quantity ? outgoingData.details[index].quantity : null}
                                                onChange={(e) => {
                                                    const nuevaCantidad = e.target.value;
                                                    // Verificar si el nuevo valor es un número
                                                    handleDetailChange(index, 'quantity', parseInt(nuevaCantidad))

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
                                            min={0}
                                            onChange={(e) => {
                                                handleDetailChange(index, 'remarks', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className='w-full flex gap-3'>
                                        <div className='w-1/2'>
                                            <Autocomplete
                                                aria-label='autocomplete-warehouese'
                                                label="Seleccionar la bodega"
                                                placeholder="Busca una bodega"
                                                isRequired
                                                className='h-[60px]'
                                                isInvalid={errors.warehouse}
                                                errorMessage={errors.warehouse}
                                                color={errors.warehouse && 'danger'}
                                                onSelectionChange={(value) => {
                                                    const item = value;
                                                    setWarehouse(item)
                                                }}
                                                defaultSelectedKey={warehouse}
                                            >
                                                {dataWarehouses.map((item) => (
                                                    <AutocompleteItem
                                                        key={item.warehouse_id}
                                                        value={item.warehouse_id}
                                                    >
                                                        {item.warehouse_id + ' - ' + item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete>
                                        </div>
                                        <div className='w-1/2'>
                                            <Autocomplete
                                                aria-label='autocomplete-location'
                                                label="Seleccionar la Ubicacion en Bodega"
                                                placeholder="Busca una ubicacion"
                                                isRequired
                                                className='h-[60px]'
                                                isInvalid={errors.location}
                                                errorMessage={errors.location}
                                                color={errors.location && 'danger'}
                                                onSelectionChange={(value) => {
                                                    const item = value;
                                                    handleDetailChange(index, 'warehouseLocation_id', value)
                                                }}
                                                defaultSelectedKey={outgoingData.details[index].warehouseLocation_id}
                                            >
                                                {filteredItems.map((item) => (
                                                    <AutocompleteItem
                                                        key={item.codigo}
                                                        value={item.codigo}
                                                    >
                                                        {item.codigo + ' - ' + item.name}
                                                    </AutocompleteItem>
                                                ))}
                                            </Autocomplete></div>
                                    </div>
                                    {(outgoingData.details.length > 1) && <Button onClick={() => removeDetail(index)} color='danger' size='sm' className='text-white font-bold w-[10%]'>Eliminar</Button>}
                                </>
                            ) : (
                                <div className='flex w-full justify-center items-center gap-2'>
                                    <div className='flex w-[33%] items-center justify-center'>
                                        <span>{dataElements.find(item => item.codigo == detail.element_id)?.name || 'No se ha seleccionado'}</span>
                                    </div>
                                    <div className='flex w-[25%] items-center justify-center'>
                                        <span>{detail.quantity}</span>
                                    </div>
                                    {(outgoingData.details.length > 1) && <Button onClick={() => removeDetail(index)} color='danger' size='sm' className='text-white font-bold w-[10%]'>Eliminar</Button>}
                                </div>
                            )}
                        </div>
                    ))}
                    <Button onClick={addDetail} color='primary' className='text-white font-bold'>Agregar Detalle</Button>
                    <div className='flex justify-end gap-3 mt-2'>
                        <Button color='success' className='text-white font-bold' type="submit">Registrar</Button>
                        <Button onClick={onClose} color='danger' className='text-white font-bold'>Cancelar</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}