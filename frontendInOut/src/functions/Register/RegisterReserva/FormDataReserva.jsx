
import React from 'react'

import { Input, Textarea } from '@nextui-org/react';
import { ButtonCerrar } from '../../../components/Buttons/ButtonCerrar';
import { ButtonRegistrar } from '../../../components/Buttons/ButtonRegistrar';

export const FormDataReserva = ({onClose}) => {
  return (
    <div className=''>
        <form action="" className='flex flex-col gap-3 mb-1' >
        <Input type="text" label="Elemento" />
        <Input type="number" label="Cantidad" />
        <Textarea
            label="Description"
            placeholder="Enter your description"
            className="max-w-xs mb-2"
        />
        <div className='w-full flex justify-end gap-3 mb-3'>
          <ButtonCerrar onClose={onClose} />
          <ButtonRegistrar label={"Reservar"} />
        </div>
        </form>
    </div>
  )

}
