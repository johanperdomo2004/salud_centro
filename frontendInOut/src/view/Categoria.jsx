import React, { useState, useEffect } from "react";
import axiosClient from '../components/config/axiosClient'
import NextUITable from "../components/NextUITable"
import { Button } from '@nextui-org/react'
import { TableGeneral } from "../components/tables/Elemento/TablaGeneral/Table";
import { columnsCategory, INITIAL_VISIBLE_COLUMNS, statusColorMap, statusOptions, searchKeys } from '../functions/Data/CategoryData'
import { FormDataCategoria } from "../functions/Register/RegisterElemento/FormDataCategoria";
import { FormUpdateCategoria } from "../functions/Update/UpdateElemento/FormUpdateCategoria";
import Modal1 from "../components/Modal1";
import { DesactivarCategorias } from "../functions/Desactivar";
import { useAuth } from "../context/AuthProvider";

export const Categoria = () => {

  const { user } = useAuth();

  const [data, setData] = useState([])

  const ListarCategorias = async () => {
    try {
      const response = await axiosClient.get('categoria/listar');
      setData(response.data)
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
    ListarCategorias()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        {user.role_id == 1 ? (
          <>
            <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
            <Modal1
              title={"Registrar Categoría"}
              size={"sm"}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              form={<FormDataCategoria onClose={() => setIsOpen(false)} listar={ListarCategorias} />}
            />
          </>
        ) : (null)}
      </div>
    )
  }

  const Actions = ({ item }) => {
    const [isOpenUpdate, setIsOpenupdate] = useState(false);

    const handleDesactivar = async (codigoElemento, estadoActual) => {
      const nuevoEstado = estadoActual == 1 ? '0' : '1';
      await DesactivarCategorias(codigoElemento, nuevoEstado);
      ListarCategorias();
    };

    return (
      <div className="flex justify-center items-center gap-2">
        <Button
          color={user.role_id == 1 ? 'primary' : 'default'} variant="bordered" size="sm" className="w-[15px]"
          onClick={() => setIsOpenupdate(true)}
          disabled={user.role_id != 1}>Actualizar</Button>
        <Modal1
          title={"Actualizar Categoría"}
          size={"sm"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateCategoria onClose={() => setIsOpenupdate(false)} category={item} Listar={ListarCategorias} />}

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
      </div >
    )
  }


  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
      <NextUITable
        columns={columnsCategory}
        rows={data}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        statusOptions={statusOptions}
        statusColorMap={statusColorMap}
        searchKeys={searchKeys}
        buttons={Buttons}
        statusOrType={'status'}
        actions={Actions}
      />
    </div>
  )
};
