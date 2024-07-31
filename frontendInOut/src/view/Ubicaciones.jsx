import React, { useState, useEffect } from "react";
import axiosClient from '../components/config/axiosClient'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { columnslocation, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/locationsData'
import { FormDataUbicacion } from "../functions/Register/RegisterElemento/FormDataUbicacion";
import { FormUpdateUbicacion } from "../functions/Update/UpdateElemento/FormUpdateUbicacion";
import Modal1 from "../components/Modal1";
import { DesactivarUbicacion } from "../functions/Desactivar";


export const Ubicaciones = () => {

  const [data, setData] = useState([])

  const ListarUbicaciones = async () => {
    try {
      const response = await axiosClient.get('ubicacion/listar');
      setData(response.data.data)
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

  useEffect(() => {
    ListarUbicaciones()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
        <Modal1
          title={"Registrar Ubicación"}
          size={"sm"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataUbicacion onClose={() => setIsOpen(false)} listar={ListarUbicaciones} />}
        />
      </div>
    )
  }

  const Actions = ({ item }) => {
    const [isOpenUpdate, setIsOpenupdate] = useState(false);

    const handleDesactivar = async (codigoElemento, estadoActual) => {
      const nuevoEstado = estadoActual == 1 ? '0' : '1';
      await DesactivarUbicacion(codigoElemento, nuevoEstado);
      ListarUbicaciones();
    };

    return (
      <div className="flex justify-center item-center gap-2">
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpenupdate(true)}>Actualizar</Button>
        <Modal1
          title={"Actualizar Ubicación"}
          size={"sm"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateUbicacion onClose={() => setIsOpenupdate(false)} category={item} Listar={ListarUbicaciones} />}
        />
        <Button
          color={item.status == 1 ? 'danger' : 'success'}
          variant="bordered"
          size="sm"
          className="w-[15px]"
          onClick={() => handleDesactivar(item.codigo, item.status)}
        >
          {item.status == 1 ? 'Desactivar' : 'Activar'}
        </Button>
      </div >
    )
  }


  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
      <NextUITable
        columns={columnslocation}
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
  )
};