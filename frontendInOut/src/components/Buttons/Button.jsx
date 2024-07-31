import React from 'react'
import { Button, ButtonGroup } from "@nextui-org/react";

export const ButtonGeneral = ({color, label, onClick, type}) => {
    return (
        <div>
            <Button className='cursor-pointer' color={color} onClick={onClick} type={type}>
                <label className='font-bold text-white cursor-pointer'>{label}</label>
            </Button>
        </div>
    )
}
