import React, { useState, useEffect } from "react";
import { Listarbodegas } from "../functions/Listar";
import { ButtonGeneral } from "../components/Buttons/Button";
import Modal1 from "../components/Modal1";
import { FormDataBodega } from "../functions/Register/RegisterBodega/FormDataBodega";
import { FormUpdateBodega } from "../functions/Update/UpdateBodega/FormUpdateBodega";
import { Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";
import { columnsWarehouses, statusOptions, INITIAL_VISIBLE_COLUMNS, statusColorMap, searchKeys } from '../functions/Data/WarehousesData';
import axiosClient from '../components/config/axiosClient';
import NextUITable from "../components/NextUITable";
import { DesactivarBodega } from "../functions/Desactivar";
import { Ubicaciones } from "./Ubicaciones"

const Bodegas = () => {

  const [data, setData] = useState([]);

  const ListarBodegas = async () => {
    try {
      const response = await axiosClient.get('bodega/listar');
      setData(response.data.data);

      console.log(response.data.data)
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
    ListarBodegas();
  }, []);

  const Buttons = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" className="w-[15px]" onClick={() => setIsOpen(true)}>Agregar</Button>
        <Modal1
          title={"Registrar Unidad Productiva"}
          size={"sm"}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          form={<FormDataBodega onClose={() => setIsOpen(false)} listar={ListarBodegas} />}
        />
      </div>
    )
  }

  const Actions = ({ codigo }) => {
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const handleDesactivar = async (codigoElemento, estadoActual) => {
      const nuevoEstado = estadoActual == 1 ? '0' : '1';
      await DesactivarBodega(codigoElemento, nuevoEstado);
      ListarBodegas();
    };
    return (
      <div>
        <Button color="primary" variant="bordered" size="sm" onClick={() => setIsOpenUpdate(true)}>Actualizar</Button>
        <Modal1
          title={"Actualizar Unidad Productiva"}
          size={"sm"}
          isOpen={isOpenUpdate}
          onClose={() => setIsOpenUpdate(false)}
          form={<FormUpdateBodega onClose={() => setIsOpenUpdate(false)} Listar={ListarBodegas} category={codigo} />}
        />
        <Button
          color={codigo.status == 1 ? 'danger' : 'success'}
          variant="bordered"
          size="sm"
          className="w-[15px] ml-1"
          onClick={() => handleDesactivar(codigo.codigo, codigo.status)}
        >
          {codigo.status == 1 ? 'Desactivar' : 'Activar'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-[95%] mr-[2.5%] ml-[2.5%] flex-col mt-8">
      <Tabs aria-label="Options" className='ml-7'>
        <Tab key="bodegas" title="Bodegas" color="primary">
          <div className='w-[95%] ml-[2.5%] mr-[2.5%]'>
            <NextUITable
              columns={columnsWarehouses}
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
        <Tab key="ubicaciones" title="Ubicaciones">
          <Ubicaciones />
        </Tab>
      </Tabs>
    </div>
  );

};

export default Bodegas;