//React importaciones y contextos
import React, { useEffect, useState } from 'react';
import { useAuth } from './../context/AuthProvider';

//Componentes de librerias
import NextUITable from './../components/NextUITable'
import { Button, Tooltip, Tabs, Tab } from '@nextui-org/react';
import Modal1 from '../components/Modal1';

//Iconos e imagenes
import { PlusIcon } from './../components/icons/PlusIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EditIcon } from '../components/icons/EditIcon';

//Datos estaticos
import {
    columnsMovements,
    INITIAL_VISIBLE_COLUMNS,
    searchKeys, statusColorMap,
    statusOptions
} from '../functions/Data/MovementsData'
import {
    columnsLoans,
    INITIAL_VISIBLE_COLUMNS_LOANS,
    searchKeysLoans,
    statusColorMapLoans,
    statusOptionsLoans
} from '../functions/Data/LoansData';

//Funciones propias
import { MovementList, LoansList } from '../functions/Listar'

//Formularios
import { RegisterMovement } from '../components/forms/Movements/RegisterMovement';
import { RegisterMovmentOutgoing } from '../components/forms/Movements/RegisterMovmentOutgoing';
import { MovementDetails } from '../components/infos/Movements/MovementDetails';
import { RegisterLoans } from '../components/forms/Loans/RegisterLoans';
import { LoanDetails } from '../components/infos/Loans/LoansDetails';

export const Movimientos3 = () => {

    const { user } = useAuth();

    const [data, setData] = useState([]);
    const [loans, setLoans] = useState([]);

    const list = async () => {
        try {
            const movements = await MovementList();
            const loans = await LoansList();
            setData(movements.data)
            setLoans(loans.data);
        } catch (error) {
            swal({
                title: "Error",
                text: error.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    }

    const Buttons = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [isOpen2, setIsOpen2] = useState(false);
        return (
            <>
                < Button
                    /* className="bg-foreground text-background" */
                    endContent={< PlusIcon />}
                    size="sm"
                    color="success"
                    variant="shadow"
                    className="text-white font-bold"
                    onClick={() => setIsOpen(true)}
                >
                    Ingreso
                </Button >
                <Modal1
                    title={"Registrar Ingreso"}
                    size={"2xl"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    form={<RegisterMovement onClose={() => setIsOpen(false)}
                        listarMovimientos={list} />}
                />
                < Button
                    /* className="bg-foreground text-background" */
                    endContent={< PlusIcon />}
                    size="sm"
                    color="danger"
                    variant="shadow"
                    className="text-white font-bold"
                    onClick={() => setIsOpen2(true)}
                >
                    Salida
                </Button >
                <Modal1
                    title={"Registrar Salida"}
                    size={"2xl"}
                    isOpen={isOpen2}
                    onClose={() => setIsOpen2(false)}
                    form={<RegisterMovmentOutgoing onClose={() => setIsOpen2(false)} listarMovements={list} />}
                />
            </>
        )
    }

    const ButtonsLoans = () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                < Button
                    /* className="bg-foreground text-background" */
                    endContent={< PlusIcon />}
                    size="sm"
                    color="warning"
                    variant="shadow"
                    className="font-bold"
                    onClick={() => setIsOpen(true)}
                >
                    Prestamo
                </Button >
                <Modal1
                    title={"Registrar Préstamo"}
                    size={"2xl"}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    form={<RegisterLoans onClose={() => setIsOpen(false)} listarMovimientos={list} />}
                />
            </>
        )
    }

    const Actions = ({ codigo }) => {
        const [isOpen3, setIsOpen3] = useState(false)
        return (
            <div className="relative flex items-center gap-2">
                <Tooltip content="Details">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Button
                            color='primary'
                            variant="ligth"
                            className="text-lg"
                            onClick={() => { setIsOpen3(true) }}
                            isIconOnly
                        >
                            <EyeIcon color="#007BFF" />
                        </Button>
                        <Modal1
                            title={`Movimiento # ${codigo.codigo}`}
                            size={'2xl'}
                            isOpen={isOpen3}
                            onClose={() => setIsOpen3(false)}
                            form={<MovementDetails movement={codigo} />} />
                    </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete user">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        {/* <DeleteIcon /> */}
                    </span>
                </Tooltip>
            </div>
        )
    }

    const ActionsLoan = ({ codigo }) => {
        const [isOpen3, setIsOpen3] = useState(false)
        return (
            <div className="relative flex items-center gap-2">
                <Tooltip content="Details">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Button
                            color='primary'
                            variant="ligth"
                            className="text-lg"
                            onClick={() => { setIsOpen3(true) }}
                            isIconOnly
                        >
                            <EyeIcon color="#007BFF" />
                        </Button>
                        <Modal1
                            title={`Movimiento # ${codigo.codigo}`}
                            size={'4xl'}
                            isOpen={isOpen3}
                            onClose={() => {
                                setIsOpen3(false)
                                list();
                            }}
                            form={<LoanDetails item={codigo} onClose={() => {
                                setIsOpen3(false)
                                list();
                            }} />}
                        />
                    </span>
                </Tooltip>
            </div>
        )
    }

    useEffect(() => {

        list();

        const interval = setInterval(() => {
            list();
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-[95%] h-[100%] m-auto flex flex-col justify-center pt-[15px]">
            <Tabs>
                <Tab key={'loans'} title={'Préstamos'}>
                    <NextUITable
                        columns={columnsLoans}
                        rows={loans}
                        searchKeys={searchKeysLoans}
                        statusOptions={statusOptionsLoans}
                        statusColorMap={statusColorMapLoans}
                        initialColumns={INITIAL_VISIBLE_COLUMNS_LOANS}
                        statusOrType={'status'}
                        actions={ActionsLoan}
                        buttons={ButtonsLoans}
                    />
                </Tab>
                <Tab key={'registerMovements'} title={'Ingresos y Salidas'}>
                    <NextUITable
                        columns={columnsMovements}
                        rows={data}
                        searchKeys={searchKeys}
                        statusOptions={statusOptions}
                        statusColorMap={statusColorMap}
                        initialColumns={INITIAL_VISIBLE_COLUMNS}
                        statusOrType={'tipo'}
                        actions={Actions}
                        buttons={Buttons}
                    />
                </Tab>
            </Tabs>
        </div>
    )
}
