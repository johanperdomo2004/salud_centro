import React from 'react'
import { Button, ButtonGroup } from "@nextui-org/react";

export const ButtonCerrar = ({onClose}) => {
    return (
        <div>
            <Button className='cursor-pointer' color="danger" onClick={onClose}>
                <label className='font-bold'>Cerrar</label>
            </Button>
        </div>
    )
}
