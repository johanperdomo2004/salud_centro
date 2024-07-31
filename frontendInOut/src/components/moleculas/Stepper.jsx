import React, { useState } from 'react'

export const Stepper = ({setSelected, selected}) => {

    return (
        <div className="w-full px-8 py-4">
            <div
                className="">
                <div className="w-full px-20 pb-6">
                    <div className="relative flex items-center justify-between w-full">
                        <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-black/50"></div>
                        <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-black transition-all duration-500">
                        </div>
                        <div
                            className={`relative z-10 grid h-4 w-4 cursor-pointer place-items-center rounded-full ${selected === 'solicitudes' ? " !bg-black  text-black" : "!bg-gray-600 text-gray-400"} font-bold ring-0 transition-all duration-300`}>
                            <div className="absolute -bottom-[2.3rem] w-max text-center text-xs">
                                <button
                                    onClick={() => { setSelected('solicitudes') }}
                                    className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-inherit">
                                    Solicitudes
                                </button>
                            </div>
                        </div>
                        <div
                            onClick={() => { setSelected('En Prestamo') }}
                            className={`relative z-10 grid h-4 w-4 cursor-pointer place-items-center rounded-full ${selected === 'En Prestamo' ? "!bg-black  text-black" : "!bg-gray-600 text-gray-400"} font-bold ring-0 transition-all duration-300`}>
                            <div className="absolute -bottom-[2.3rem] w-max text-center text-xs">
                                <button
                                    className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-inherit">
                                    En Prestamo
                                </button>
                            </div>
                        </div>
                        <div
                            onClick={() => { setSelected('canceladas') }}
                            className={`relative z-10 grid h-4 w-4 cursor-pointer place-items-center rounded-full ${selected === 'canceladas' ? " !bg-black  text-black" : "!bg-gray-600 text-gray-400"} font-bold ring-0 transition-all duration-300`}>
                            <div className="absolute -bottom-[2.3rem] w-max text-center text-xs">
                                <h6
                                    className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-inherit">
                                    Canceladas
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
