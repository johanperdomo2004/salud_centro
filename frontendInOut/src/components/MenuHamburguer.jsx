import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { FaAccessibleIcon } from 'react-icons/fa'

export const MenuHamburguer = () => {

    const [click, setClick] = useState(false);

    const LinksArray = [
        {
            icon: <FaAccessibleIcon className='text-[25px]' />,
            label: "lalala",
            to: '/hola'
        },
        {
            icon: <FaAccessibleIcon className='text-[25px]'/>,
            label: "lalala",
            to: '/hola'
        }
    ]

    const SecondarylinksArray = [{}]

    return (
        <>
            <div className='bg-gray-600'>
                <nav className='flex justify-between items-center h-screen'>
                    <section>
                        <span onClick={() => setClick(!click)}>
                            <label
                                className={`relative w-[30px] h-[30px] pointer-pointer flex flex-col items-center justify-center gap-1.5 duration-500 ${click ? "duration-500 rotate-180" : ""}`}
                                for="checkbox"
                            >
                                <div className="w-[70%] h-[4px] bg-white rounded" id="bar1"></div>
                                <div className="w-full h-[4px] bg-white rounded duration-700" id="bar2"></div>
                                <div className="w-[70%] h-[4px] bg-white rounded" id="bar3"></div>
                            </label>
                        </span>
                    </section>
                    <div $click={click.toString()}>
                        {LinksArray.map(({ icon, label, to }) => (
                            <div
                                onClick={() => setClick(!click)}
                                className="hover:bg-white"
                                key={label}
                            >
                                <NavLink to={to} className="w-[100vw]">
                                    <div className="Linkicon">{icon}</div>
                                    <span>{label}</span>
                                </NavLink>
                            </div>
                        ))}
                        <div className='h-[1px] w-full bg-black m-[4px]' />
                        {SecondarylinksArray.map(({ icon, label, to }) => (
                            <div
                                className="hover:bg-green-600"
                                key={label}
                                onClick={() => setClick(!click)}
                            >
                                <NavLink to={to} className="w-[100vw] flex items-center no-underline text-white h-[80px]">
                                    <div className="flex p-[10px]">{icon}</div>
                                    <span>{label}</span>
                                </NavLink>
                            </div>
                        ))}

                        <div className='h-[1px] w-full bg-black m-[4px]' />
                    </div>
                </nav>
            </div>
        </>
    )
}
