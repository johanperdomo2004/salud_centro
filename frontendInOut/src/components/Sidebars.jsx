import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench, faWarehouse, faClipboard, faUser, faArrowsAltH  } from '@fortawesome/free-solid-svg-icons';
import Logo from "../../public/img/Logo.png";


const Sidebars = () => {
    const [isHover, setHover] = useState(false);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className={`hidden sm:flex sm:flex-col items-center h-full overflow-hidden text-gray-400 bg-gray-900 rounded-s transition-all ${isHover ? 'w-44 duration-700 ' : ' w-16 duration-500'}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}>
                <a className="flex items-center justify-center mt-3 h-12" href="#">
                    <img src={Logo} alt="Logo" className={`transition-all ${isHover ? 'w-10 h-10' : 'w-8 h-8'}`} />
                </a>
                <div className={`w-full ${isHover && 'px-2'}`}>
                    <div className={`flex flex-col items-center mt-3 border-t border-gray-700 ${isHover && 'w-full'}`}>
                        <Link to="/usuarios" className={`flex items-center ${isHover ? 'w-full px-3' : 'justify-center w-12'} h-12 mt-2 hover:bg-gray-700 hover:text-gray-300 rounded`} href="#">
                            <FontAwesomeIcon icon={faUser} className='w-6 h-6' />   
                            {isHover && <span className="ml-2 text-sm font-medium">Usuarios</span>}
                        </Link>
                        <Link to="/elementos" className={`flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                            <FontAwesomeIcon icon={faScrewdriverWrench} className="w-6 h-6" />
                            {isHover && <span className="ml-2 text-sm font-medium">Elementos</span>}
                        </Link>
                    </div>
                    <div className={`flex flex-col items-center mt-3 border-t border-gray-700 ${isHover && 'w-full'}`}>
                        <Link to="/movimientos" className={`flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                            <FontAwesomeIcon icon={faArrowsAltH} className='w-6 h-6' />
                            {isHover && <span className="ml-2 text-sm font-medium">Movimientos</span>}
                        </Link>
                        <Link to="/reportes" className={`flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                            <FontAwesomeIcon icon={faClipboard} className="w-6 h-6" />
                            {isHover && <span className="ml-2 text-sm font-medium">Reportes</span>}
                        </Link>
                        <Link to="/bodegas" className={`relative flex items-center ${isHover ? 'w-full px-3' : 'w-12 justify-center '} h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300`} href="#">
                            <FontAwesomeIcon icon={faWarehouse} className="w-6 h-6" />
                            {isHover && <span className="ml-2 text-sm font-medium">Unidades Productivas</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebars;
