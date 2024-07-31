import React, { useState, useEffect } from "react";
import { FormDataUsuario } from "../functions/Register/RegisterUsuario/FormDataUsuario";
import Modal1 from "../components/Modal1";
import { FormUpdateUsuario } from "../functions/Update/UpdateUsuario/FormUpdateUsuario";
import axiosClient from '../components/config/axiosClient'
import NextUITable from "../components/NextUITable"
import { columnsUsers, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/UserData'
import { Button, user } from '@nextui-org/react'
import { DesactivarUsuario } from "../functions/Desactivar";
import { useAuth } from "../context/AuthProvider";

export const Usuarios = () => {
  const [data, setData] = useState([]);

  const { user } = useAuth();

  const ListarUsuario = async () => {
    try {
      const response = await axiosClient.get('usuario/listar');
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
    ListarUsuario()
  }, [])


  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        {user.role_id == 1 ? (
          <>
            <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
            <Modal1
              title={"Registrar Usuario"}
              size={"2xl"}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              form={<FormDataUsuario onClose={() => setIsOpen(false)} Listar={ListarUsuario} />}
            />
          </>
        ) : (null)}
      </div>
    )
  }

  const Actions = ({ codigo }) => {
    const [isOpenUpdate, setIsOpenupdate] = useState(false);

    const handleDesactivar = async (CodigoUsuario, estadoActual) => {
      const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
      await DesactivarUsuario(CodigoUsuario, nuevoEstado);
      ListarUsuario();
    };

    return (
      <div className="flex justify-center items-center gap-2">
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
          title={"Actualizar Usuario"}
          size={"2xl"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenupdate(false)}
          form={<FormUpdateUsuario onClose={() => setIsOpenupdate(false)} category={codigo} Listar={ListarUsuario} />}
        />
        <Button
          color={user.role_id != 1 ? 'default' : codigo.status === 'Activo' ? 'danger' : 'success'}
          variant="bordered"
          size="sm"
          className="w-[15px]"
          onClick={() => handleDesactivar(codigo.codigo, codigo.status)}
          disabled={user.role_id != 1}
        >
          {codigo.status === 'Activo' ? 'Desactivar' : 'Activar'}
        </Button>
      </div >
    )
  }

  return (
    <div className='w-[95%] ml-[2.5%] mr-[2.5%] mt-4'>
      <NextUITable
        columns={columnsUsers}
        rows={data}
        statusOptions={statusOptions}
        statusColorMap={statusColorMap}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        searchKeys={searchKeys}
        buttons={Buttons}
        statusOrType={'status'}
        actions={Actions}
      />
    </div>
  )
};
