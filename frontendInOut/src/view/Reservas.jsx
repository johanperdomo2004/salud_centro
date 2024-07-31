import React, { useState, useEffect, useMemo } from 'react';
import { Input, Textarea, Tooltip, Button } from '@nextui-org/react';
import axiosClient from '../components/config/axiosClient';
import { ListarElementos, MovementsByUserId } from '../functions/Listar';
import AutocompleteMine from '../components/AutoCompleteMine';
import { useAuth } from './../context/AuthProvider';
import NextUITable from '../components/NextUITable';
import { statusColorMapLoans, statusOptionsLoans } from '../functions/Data/LoansData';
import { EyeIcon } from '../components/icons/EyeIcon';
import Modal1 from '../components/Modal1';
import { UserMovementDetails } from '../components/infos/Loans/UserMovmenetDetails';

const columns = [
  { name: 'Código', uid: 'codigo', sortable: true },
  { name: 'Usuario Manager', uid: 'usuario_manager', sortable: true },
  { name: 'Usuario Recibió', uid: 'usuario_receiving', sortable: true },
  { name: 'Usuario Devolvió', uid: 'usuario_returning', sortable: true },
  { name: 'Fecha', uid: 'fecha' },
  { name: 'Tipo', uid: 'tipo' },
  { name: 'Estado', uid: 'status' },
  { name: 'Acciones', uid: 'actions' }
]

const INITIAL_VISIBLE_COLUMNS = ["codigo", "fecha", "actions", "status"];

const searchKeysLoans = ['codigo', "fecha", "identificacion_manager", "usuario_manager"]


export const Reservas = () => {

  const { user } = useAuth();

  const [errors, setErrors] = useState({
    quantity: '',
    element_id: ''
  });

  const objectRegister = {
    estimated_return: null,
    details: [{
      element_id: '',
      quantity: 0,
      remarks: ''
    }]
  }

  //Guardar la información que se envia para un nuevo registro
  const [newRegister, setNewRegister] = useState(objectRegister);
  const [elementsData, setElementsData] = useState([]);
  const [editIndex, setEditIndex] = useState(0);
  const [minDate, setMinDate] = useState('');
  const [data, setData] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

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
      const elements = await ListarElementos();
      const movements = await MovementsByUserId(user.user_id);
      setElementsData(elements);
      setData(movements.data);
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

  const filteredItems = useMemo(() => {
    if (elementsData.length > 0) {
      const info = elementsData.filter(item => item.code_elementType == 2 && item.status == 1);
      return info;
    };

    return [];
  }, [elementsData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let res = validateForm();
    if (res) return;

    try {
      const register = await axiosClient.post('movimientos/register-loan', newRegister);

      const status = register.status >= 200 && register.status <= 210 ? true : false

      swal({
        title: "Registro exitoso",
        text: "La categoría se ha registrado correctamente.",
        icon: `${status ? 'success' : "warning"}`,
        buttons: false,
        timer: 2000,
      });
      list();
      setNewRegister(objectRegister);
      window.location.reload()
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
      element_id: '',
      quantity: '',
      estimated_return: '',
    };

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
  }, []);

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

  const Actions = ({ codigo }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div className="relative flex items-center gap-2">
        <Tooltip content="Details">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <Button
              color='primary'
              variant="ligth"
              className="text-lg"
              onClick={() => { setIsOpen(true) }}
              isIconOnly
            >
              <EyeIcon color="#007BFF" />
            </Button>
            <Modal1
              title={`Movimiento # ${codigo.codigo}`}
              size={'2xl'}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              form={<UserMovementDetails item={codigo} onClose={() => {
                list();
                setIsOpen(false);
              }} />} />
          </span>
        </Tooltip>
      </div>
    )
  }

  const Buttons = () => {
    return (
      null
    )
  }

  return (
    <div className='flex items-center justify-center flex-col lg:flex-row gap-4 lg:gap-96 mt-16 px-4'>
      <div className='w-[350px]  md:w-auto bg-white rounded-xl p-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'>
        <form className='flex flex-col gap-4 mb-1' onSubmit={handleSubmit}>
          <h1 className='text-xl font-bold'>Reservar Elementos</h1>
          {newRegister.details.map((detail, index) => (
            <div className='w-full flex flex-col justify-center items-center' key={index}>
              <span className='mb-2'>Detalle {index + 1}</span>
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
          <div className='w-full flex items-center justify-center'>
            <div className={`relative px-3 cursor-text tap-highlight-transparent shadow-sm focus-within:hover:bg-default-100 group-data-[invalid=true]:bg-danger-50 group-data-[invalid=true]:hover:bg-danger-100 group-data-[invalid=true]:focus-within:hover:bg-danger-50 min-h-10 rounded-medium flex-col  justify-center gap-0 w-[70%] transition-background motion-reduce:transition-none !duration-150 h-14 py-2 flex items-center ${errors.estimated_return ? 'bg-[#fee7ef] hover:bg-[#fdd0df]' : 'bg-default-100 hover:bg-default-200 '}`}>
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
          <div className='flex justify-center gap-3 mt-2'>
            <Button color='success' className='text-white font-bold' type='submit'>Registrar</Button>
          </div>
        </form>
      </div>
      <div className='w-full lg:w-auto'>
        <NextUITable
          columns={columns}
          rows={data}
          searchKeys={searchKeysLoans}
          statusOptions={statusOptionsLoans}
          statusColorMap={statusColorMapLoans}
          initialColumns={INITIAL_VISIBLE_COLUMNS}
          statusOrType={'status'}
          actions={Actions}
          buttons={Buttons}
        />
      </div>
    </div>
  );
}