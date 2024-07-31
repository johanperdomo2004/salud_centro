import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import NextUITable from "../components/NextUITable";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import { columnsElements, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/ElementsData';
import axiosClient from '../components/config/axiosClient';
import Modal1 from "../components/Modal1";
import { FormDataElemento } from "../functions/Register/RegisterElemento/FormDataElemento";
import { FormUpdateElemento } from "../functions/Update/UpdateElemento/FormUpdateElemento";
import { DesactivarElemento } from "../functions/Desactivar";
import { Categoria } from "./Categoria"; // Asegúrate de importar correctamente
import { Empaques } from "./Empaques"; // Asegúrate de importar correctamente
import { Medidas } from "./Medidas"; // Asegúrate de importar correctamente
import { useAuth } from '../context/AuthProvider';

export const Elemento = () => {
    const [data, setData] = useState([]);

    const { user } = useAuth();

    const ListarElementos = async () => {
        try {
            const response = await axiosClient.get('elemento/listar');
            setData(response.data);
        } catch (error) {
            swal({
                title: "Error",
                text: error.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    };

    useEffect(() => {
        ListarElementos();
    }, []);

    const Buttons = () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div>
                {user.role_id == 1 ? (
                    <>
                        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
                        <Modal1
                            title={"Registrar Elemento"}
                            size={"md"}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            form={<FormDataElemento onClose={() => setIsOpen(false)} listar={ListarElementos} />}
                        />
                    </>
                ) : (null)}
            </div>
        );
    };

    const Actions = ({ item }) => {
        const [isOpenUpdate, setIsOpenupdate] = useState(false);
        const [isOpenLotes, setIsOpenLotes] = useState(false);

        const handleDesactivar = async (codigoElemento, estadoActual) => {
            const nuevoEstado = estadoActual == 1 ? "0" : "1";
            await DesactivarElemento(codigoElemento, nuevoEstado);
            ListarElementos();
        };

        const [data, setData] = useState([]);

        const ListarBodegas = async () => {
            try {
                const response = await axiosClient.get(`batches/list/${item.codigo}`);
                setData(response.data.data);

            } catch (error) {
                swal({
                    title: "Error",
                    text: error.message,
                    icon: `warning`,
                    buttons: true,
                    timer: 2000,
                });
            }
        };

        const getBackGround = (date) => {
            if (date) {
                const itemDate = new Date(date);
                const now = new Date();

                const sixMonthFroMNow = new Date(now);
                sixMonthFroMNow.setMonth(now.getMonth() + 6);

                const oneYearFroMNow = new Date(now);
                oneYearFroMNow.setFullYear(now.getFullYear() + 1);

                if (itemDate < now) {
                    return 'bg-purple-400'
                } else if (itemDate < sixMonthFroMNow) {
                    return 'bg-red-400'
                } else if (itemDate < oneYearFroMNow) {
                    return 'bg-yellow-400'
                } else {
                    return 'bg-green-400'
                }
            }
        }

        useEffect(() => {
            ListarBodegas();
        }, []);

        const classNames = React.useMemo(
            () => ({
                wrapper: ["max-h-[382px]", "max-w-3xl"],
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
            }),
            [],
        );

        const columns = [
            {
                key: 'batch_id',
                label: "CODIGO"
            },
            {
                key: "quantity",
                label: "CANTIDAD"
            },
            {
                key: "expiration",
                label: "EXPIRACIÓN"
            },
            {
                key: "location_nanme",
                label: "UBICACIÓN"
            }
        ];

        const formDate = (date) => {
            if (date) {
                const itemDate = new Date(date);
                const day = String(itemDate.getDate()).padStart(2, '0');

                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                const month = monthNames[itemDate.getMonth()];
                const year = String(itemDate.getFullYear());

                return `${day} - ${month} - ${year}`
            }
        }
        return (
            <div className='flex justify-center items-center gap-3'>
                <Button
                    color={user.role_id == 1 ? 'primary' : 'default'}
                    variant="bordered"
                    size="sm"
                    className="w-[15px]"
                    onClick={() => setIsOpenupdate(true)}
                    disabled={user.role_id != 1}
                >
                    Actualizar
                </Button>
                <Modal1
                    title={"Actualizar Elemento"}
                    size={"md"}
                    isOpen={isOpenUpdate}
                    onClose={() => setIsOpenupdate(false)}
                    form={<FormUpdateElemento onClose={() => setIsOpenupdate(false)} category={item} Listar={ListarElementos} />}
                />
                <Button
                    color={user.role_id != 1 ? 'default' : item.status === 'Activo' ? 'danger' : 'success'}
                    variant="bordered"
                    size="sm"
                    className="w-[15px]"
                    onClick={() => handleDesactivar(item.codigo, item.status)}
                    disabled={user.role_id != 1}
                >
                    {item.status == 1 ? 'Desactivar' : 'Activar'}
                </Button>
                <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => {
                    setIsOpenLotes(true);
                    ListarBodegas();
                }}>Lotes</Button>
                <Modal1
                    title={"Lotes"}
                    size={"3xl"}
                    isOpen={isOpenLotes}
                    onClose={() => setIsOpenLotes(false)}
                    form={
                        <Table
                            aria-label="info table"
                            removeWrapper
                            classNames={classNames}>
                            <TableHeader columns={columns}>
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={data} emptyContent={'No hay detalles'}>
                                {(item) => (
                                    <TableRow key={item.batch_id} className={`${getBackGround(item.expiration)} rounded-3xl mt-2`}>
                                        {(columnKey) => <TableCell className={`${columnKey == 'batch_id' ? 'rounded-s-xl' : columnKey == 'location_nanme' ? 'rounded-e-xl' : ''}`}>{columnKey == 'expiration' ? formDate(item[columnKey]) : getKeyValue(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    }
                />
            </div>
        );
    };

    return (
        <div className="flex w-[95%] mr-[2.5%] ml-[2.5%] flex-col mt-2">
            <Tabs aria-label="Options" className='ml-7'>
                <Tab key="elementos" title="Elementos" color="primary">
                    <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
                        <NextUITable
                            columns={columnsElements}
                            rows={data}
                            initialColumns={INITIAL_VISIBLE_COLUMNS}
                            statusColorMap={statusColorMap}
                            statusOptions={statusOptions}
                            searchKeys={searchKeys}
                            buttons={Buttons}
                            statusOrType={'status'}
                            actions={Actions}
                        />
                    </div>
                </Tab>
                <Tab key="categorias" title="Categorías">
                    <Categoria />
                </Tab>
                <Tab key="empaques" title="Empaques">
                    <Empaques />
                </Tab>
                <Tab key="medidas" title="Medidas">
                    <Medidas />
                </Tab>
            </Tabs>
        </div>
    );
};
