import React, { useEffect, useState, useMemo } from 'react'
import { MovementDetailsById, ListarElementos, ListarUsuarios } from '../../../functions/Listar';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    Checkbox,
    Input,
    Textarea,
    Autocomplete,
    AutocompleteItem
} from "@nextui-org/react";
import { useAuth } from '../../../context/AuthProvider';
import axiosClient from '../../config/axiosClient';
import swal from 'sweetalert';
import './styles.css'
import { capitalize } from '../../../utils/columnsData';

export const LoanDetails = ({ item, onClose }) => {

    const { user } = useAuth();

    const [movement, setMovement] = useState(item);
    const [data, setData] = useState([]);
    const [dataElements, setElements] = useState([]);
    const [newStatus, setNewStatus] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [userReturning, setUserReturning] = useState(null);

    const stateNoActions = ["Solicitado", "Rechazado", "Aceptado", "Cancelado"];

    const baseColumns = [
        {
            key: "movementDetail_id",
            label: "CODIGO",
        },
        {
            key: "element_id",
            label: "ID",
        },
        {
            key: "element_name",
            label: "ELEMENTO",
        },
        {
            key: "batch_id",
            label: "LOTE",
        },
        {
            key: "quantity",
            label: "CANTIDAD",
        },
        {
            key: "remarks",
            label: "OBSERVACIONES",
        },
        {
            key: "loanStatus_id",
            label: "ESTADO",
        }
    ];
    const columns = (!stateNoActions.includes(movement.status))
        ? [...baseColumns, { key: "actions", label: "ENTREGA" }]
        : baseColumns;

    const esperar = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const list = async () => {
        try {

            await esperar(200);
            const detailsData = await MovementDetailsById(movement.codigo);
            const users = await ListarUsuarios();

            const elements = await ListarElementos();
            const details = detailsData.data
            let objectDetails = [];

            for (const detail of details) {
                const { movementDetail_id, loanStatus_id, remarks } = detail;

                const object = {
                    movementDetail_id: movementDetail_id,
                    loanStatus_id: loanStatus_id,
                    remarks: remarks
                }

                objectDetails.push(object);
            }

            setData(details);
            setElements(elements);
            setUsersData(users);

            const objectNewStatus = {
                user_returning: null,
                details: objectDetails
            }

            setNewStatus(objectNewStatus)
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

    const handleDetailChange = (item, numState) => {
        setNewStatus(prevNewStatus => {
            const detail = prevNewStatus.details.find(detail => detail.movementDetail_id === item.movementDetail_id);

            if (detail) {
                const detailIndex = prevNewStatus.details.indexOf(detail);
                const currentStatus = detail.loanStatus_id;
                const newDatum = currentStatus === numState[0] ? numState[1] : numState[0];
                // Realiza el cambio en el objeto encontrado
                const updatedDetails = prevNewStatus.details.map((detail, i) =>
                    i === detailIndex ? { ...detail, loanStatus_id: newDatum } : detail
                );
                return { ...prevNewStatus, details: updatedDetails };
            } else {
                return prevNewStatus;
            }
        })
    };

    const getKeyData = (item, columnKey) => {

        if (columnKey === 'element_name') {
            const filteredItems = Array.isArray(dataElements) ? dataElements.filter(element => element.codigo === item.element_id) : [];
            return filteredItems.length > 0 ? filteredItems[0].name : 'Elemento no encontrado';
        }

        if (columnKey === 'loanStatus_id') {
            const statusMap = {
                1: { estado: "Solicitado", color: "primary" },
                2: { estado: "En revisión", color: "secondary" },
                3: { estado: "Aceptado", color: "success" },
                4: { estado: "Rechazado", color: "danger" },
                5: { estado: "En préstamo", color: "warning" },
                6: { estado: "Completado", color: "default" },
                7: { estado: "Cancelado", color: "danger" },
            };

            const { estado, color } = statusMap[item.loanStatus_id] || {};

            return estado && color && (
                <Chip color={color} variant='flat' size='sm'>{estado}</Chip>
            );
        }

        if (columnKey === 'actions') {
            return (
                (user.role_id == 1 || user.role_id == 2) && (
                    <>
                        {item.loanStatus_id == 4 && (
                            <span>Cancelado</span>
                        )}
                        {item.loanStatus_id == 6 && (
                            <span>Completado</span>
                        )}
                        {item.loanStatus_id == 7 && (
                            <span>Rechazado</span>
                        )}
                        {movement.status == 'En revisión' && item.loanStatus_id == 2 && (
                            <div className='flex gap-4'>
                                <div className='flex flex-col gap-2 items-center'>
                                    <label className="text-sm leading-4 font-normal text-gray-800 dark:text-gray-100">
                                        Aceptar
                                    </label>
                                    <div className='bg-white dark:bg-gray-100 rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative'>
                                        <input
                                            type="radio"
                                            name={`radio ${item.movementDetail_id}`}
                                            className="checkbox appearance-none focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none border-1 rounded-full border-gray-800 absolute cursor-pointer w-full h-full"
                                            value={3}
                                            onChange={() => setNewStatus(prevData => {
                                                const detail = prevData.details.find(detail => detail.movementDetail_id === item.movementDetail_id);

                                                if (detail) {
                                                    const detailIndex = prevData.details.indexOf(detail);
                                                    const currentStatus = detail.loanStatus_id;
                                                    // Realiza el cambio en el objeto encontrado
                                                    const updatedDetails = prevData.details.map((detail, i) =>
                                                        i === detailIndex ? { ...detail, loanStatus_id: 3 } : detail
                                                    );
                                                    return { ...prevData, details: updatedDetails };
                                                } else {
                                                    return prevData;
                                                }
                                            })}
                                        />
                                        <div className="check-icon hidden border-4 border-indigo-700 rounded-full w-full h-full z-1"></div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2  items-center'>
                                    <label className="text-sm leading-4 font-normal text-gray-800 dark:text-gray-100">
                                        Rechazar
                                    </label>
                                    <div className='bg-white dark:bg-gray-100 rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative'>
                                        <input
                                            type="radio"
                                            name={`radio ${item.movementDetail_id}`}
                                            className="checkbox appearance-none focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none border-1 rounded-full border-gray-800 absolute cursor-pointer w-full h-full"
                                            value={3}
                                            onChange={() => setNewStatus(prevData => {
                                                const detail = prevData.details.find(detail => detail.movementDetail_id === item.movementDetail_id);

                                                if (detail) {
                                                    const detailIndex = prevData.details.indexOf(detail);
                                                    const currentStatus = detail.loanStatus_id;
                                                    // Realiza el cambio en el objeto encontrado
                                                    const updatedDetails = prevData.details.map((detail, i) =>
                                                        i === detailIndex ? { ...detail, loanStatus_id: 4 } : detail
                                                    );
                                                    return { ...prevData, details: updatedDetails };
                                                } else {
                                                    return prevData;
                                                }
                                            })}
                                        />
                                        <div className="check-icon hidden border-4 border-indigo-700 rounded-full w-full h-full z-1"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {movement.status == 'Aceptado' && item.loanStatus_id == 3 && (
                            <Checkbox
                                size='sm'
                                onClick={() => handleDetailChange(item, [3, 5])}
                            />
                        )}
                        {movement.status == 'En préstamo' && item.loanStatus_id == 5 && (
                            <Checkbox
                                size='sm'
                                onClick={() => handleDetailChange(item, [5, 6])}
                            />
                        )}
                    </>
                )
            )
        }

        if (columnKey === 'remarks') {

            let detail = newStatus.details.filter(detail => detail.movementDetail_id == item.movementDetail_id)

            return (
                [2, 3, 5].includes(item.loanStatus_id) ? (
                    <Textarea
                        /* readOnly */
                        variant='flat'
                        size='sm'
                        minRows={2}
                        placeholder='Observaciones'
                        defaultValue={detail[0].remarks}
                        onChange={(e) => {
                            const remarkValue = e.target.value;
                            setNewStatus(prevNewStatus => {
                                const detailIn = prevNewStatus.details.find(detail => detail.movementDetail_id == item.movementDetail_id)
                                if (detailIn) {
                                    const detailIndex = prevNewStatus.details.indexOf(detailIn);
                                    // Realiza el cambio en el objeto encontrado
                                    const updatedDetails = prevNewStatus.details.map((detail, i) =>
                                        i === detailIndex ? { ...detail, remarks: remarkValue } : detail
                                    );
                                    return { ...prevNewStatus, details: updatedDetails };
                                } else {
                                    return prevNewStatus;
                                }
                            })
                        }}
                    />
                ) : (
                    <span>
                        {detail[0].remarks}
                    </span>
                )


            );
        }
        return item[columnKey];
    };

    const StatusActions = ({ status }) => {
        switch (status) {
            case 'Solicitado':
                return <Button onClick={handleUpdateStatus}>Revisar</Button>
            case 'En revisión':
                return (
                    <div className='flex gap-5'>
                        <Button onClick={handleUpdateStatus}>Enviar Datos</Button>
                    </div>
                )
            case 'Aceptado':
                return (
                    <div className='flex gap-5'>
                        <Button onClick={handleUpdateStatus}>Realizar Entrega</Button>
                    </div>
                )
            case 'Rechazado':
                return null
            case 'En préstamo':
                return (
                    <Button size='sm' onClick={handleUpdateStatus}>
                        Aceptar devolución
                    </Button>
                );
            case 'Completado':
                return null
            case 'Cancelado':
                return null
            default:
                return null;
        }
    };

    useEffect(() => {
        list();
    }, [])

    useEffect(() => {
    }, [newStatus, movement])

    const classNames = React.useMemo(() => ({
        wrapper: ["max-h-[382px]", "max-w-3xl"],
        table: ["overflow-auto", "w-[150px]"],
        th: ["bg-transparent", "text-default-500", "border-b", "border-divider", "text-black", "text-center"],
        td: [
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
            "text-center"
        ],
    }), []);

    const handleUpdateStatus = async () => {
        try {
            const response = await axiosClient.put(`movimientos/update-logan-status/${movement.codigo}`, newStatus);
            const statusCode = response.status;

            // Puedes manejar la respuesta según el código de estado
            if (movement.status !== 'Solicitado') {
                swal({
                    title: `${statusCode === 201 ? 'Info' : 'Éxito'}`,
                    text: response.data.message,
                    icon: `${statusCode === 201 ? 'warning' : 'success'}`,
                    buttons: true
                }).then(() => {
                    setNewStatus('');
                    onClose(); // Asegúrate de definir onClose adecuadamente
                });
            }

            if (movement.status == "Solicitado") {
                list();
                const response = await axiosClient.get(`movimientos/loans/list/${movement.codigo}`)
                setMovement(response.data.data[0])
            }
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                swal({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "warning",
                    buttons: true
                });
                // Puedes manejar el error según el código de estado aquí
            }
        }
    };

    return (
        <div className='w-full px-3 pb-3 flex flex-col items-center justify-center gap-4'>
            {(movement.status == 'En préstamo' || movement.status == "Aceptado") && (
                <Autocomplete
                    aria-label='autocomplete-users'
                    label="Seleccionar el usuario"
                    placeholder="Busca un usuario"
                    isRequired
                    /* isInvalid={errors.user_application ? true : false}
                    errorMessage={errors.user_application} */
                    className='h-[60px]'
                    onSelectionChange={(value) => {
                        const element = value;
                        setNewStatus(precData => ({
                            ...precData,
                            user_returning: parseInt(value)
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
            )}
            <Table
                aria-label="info table"
                removeWrapper
                classNames={classNames}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={data} emptyContent={'No hay detalles'}>
                    {(item, index) => (
                        <TableRow key={item.movementDetail_id}>
                            {(columnKey) => <TableCell>{getKeyData(item, columnKey, index)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {(user.role_id == 1 || user.role_id == 2) && (
                <StatusActions status={movement.status} onUpdateStatus={handleUpdateStatus} />
            )}
        </div>
    )
}