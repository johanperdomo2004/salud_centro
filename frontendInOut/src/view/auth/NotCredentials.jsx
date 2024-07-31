import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const NotCredentials = () => {

    const { user, isLogout, expire } = useAuth();

    const [countdown, setCountdown] = useState(5); // Configurar el tiempo inicial de cuenta regresiva (en segundos)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
        } else {
            // Redirigir a la página de reservas después de que termine la cuenta regresiva
            window.location.href = user ? '/reservas' : '/login';

        }
    }, [countdown]);

    return (
        isLogout ? (
            <Navigate to='/login' />
        ) : (
            <div className='min-h-screen flex items-center justify-center w-10/12 m-auto'>
                <div className="hidden md:flex md:w-1/2 p-8">

                </div>
                <div className='w-full md:w-1/2 p-4 md:p-8r'>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
                    <div className='flex w-full items-center justify-center'>
                        <div className='w-3/4'>
                            {
                                expire ?
                                    <>
                                        <p className="text-lg md:text-xl text-gray-600">Tu sesión ha caducado</p>
                                        <p className="text-lg md:text-xl text-gray-600">Inicia sesión Nuevamente</p>
                                    </>
                                    : user ? <p className="text-lg md:text-xl text-gray-600">No tienes permisos suficientes para acceder a está sección</p>
                                        : <p className="text-lg md:text-xl text-gray-600">No has iniciado sesión</p>
                            }
                            <p className="text-lg md:text-xl text-gray-600">Redirigiendo al {user ? 'Perfil' : 'Login'} en </p>
                        </div>
                        <p className='text-[65px] text-gray-900 w-full pl-2'>{countdown}</p>

                    </div>
                    <Link to={user ? '/reservas' : '/login'} className="px-6 py-3 bg-blue-500 text-white rounded-lg inline-block hover:bg-blue-600 transition duration-300 ease-in-out">Ir ahora</Link>

                </div>
            </div>
        )
    )
}

export default NotCredentials;