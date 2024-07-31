import React, { useEffect, useState } from 'react';
import axiosClient from '../components/config/axiosClient';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from "@nextui-org/react";
import Swal from 'sweetalert2';
import imgLogin from '../assets/imgLogin.png';
import logo from '../../public/img/salud.png';
import { useAuth } from '../context/AuthProvider';
import { CiRead } from "react-icons/ci";

// Componente personalizado para el campo de contraseña con ícono de visualización
const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        required
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full mb-2 pr-10 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        placeholder="Password"
      />
      <div
        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        <CiRead className={`text-gray-500 ${showPassword ? 'opacity-100' : 'opacity-50'}`} />
      </div>
    </div>
  );
};

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(!!token);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('validate/validar', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('codigo', response.data.codigo);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('identification', response.data.identification);

        const respo = await login({
          email: email,
          password: password,
        });
        if (respo.role_id == 1 || respo.role_id == 2) navigate('/estadistica')
        if (respo.role_id == 3) navigate('/reservas')
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario inactivo. Por favor, contacta al administrador.',
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo no se encuentra registrado en la base de datos',
          });
        } else if (error.response.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Contraseña incorrecta, Acceso denegado',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error. Por favor, inténtalo nuevamente.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar al servidor. Por favor, inténtalo nuevamente.',
        });
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/contrasena/recuperar', {
        email: email,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Por favor, revisa tu correo electrónico para restablecer tu contraseña.',
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el correo de recuperación, Email Incorrecto',
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Expresiones regulares para verificar la complejidad de la contraseña
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
    const lengthRegex = /^.{8,}$/;

    // Verificar que la contraseña cumpla con todos los criterios
    if (!uppercaseRegex.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos una letra mayúscula.',
      });
      return;
    }

    if (!numberRegex.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos un número.',
      });
      return;
    }

    if (!specialCharRegex.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe contener al menos un carácter especial.',
      });
      return;
    }

    if (!lengthRegex.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres.',
      });
      return;
    }

    try {
      const response = await axiosClient.put('/contrasena/cambiar', {
        token,
        password: password,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido actualizada exitosamente.',
        });

        setShowResetPassword(false);
        setEmail('');
        setPassword('');
        navigate('/login'); // Redirige al usuario al login
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la contraseña.',
      });
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role_id == 1 || user.role_id == 2) navigate('/estadistica')
      if (user.role_id == 3) navigate('/reservas')
    }
  })

  return (
    <div className='w-full h-screen relative overflow-auto'>
      <div className='w-full h-[50%] bg-gray-500 flex' style={{ paddingTop: '1.5rem' }}>
        <div className='w-full md:w-auto'>
          <h1 className='text-white text-2xl font-bold lg:ml-12 w-full flex justify-center lg:block'><img src={logo} alt="" className=' h-[110px] w-[auto]' /></h1>
          <div className='ml-[60px] mt-[40px] h-[200px] w-[300px] hidden md:block'>
            <h1 className='text-3xl font-bold text-black'>Ingrese a In-Out</h1>
            <h2 className='mt-2 text-xl text-black font-semibold'>Gestión de inventarios</h2>
            <p className=' text-sm mt-2 text-white font-light text-justify'>
              InOut es un software que a través de múltiples funciones, aumenta la eficiencia de la gestión de préstamos.
              Logrando con esto automatizar procesos, optimizar recursos, y mejorar la experiencia del cliente.
            </p>
          </div>
        </div>
        <div className='hidden xl:block ml-[30px] mt-5'>
          <img src={imgLogin} alt="Descripción de la imagen" className='w-[300px] h-[250px]' />
        </div>
      </div>
      <div
        className='w-[350px] sm:w-[500px] left-[50%] h-auto bg-[#fff] rounded-[25px] absolute shadow-xl top-[50%]  mr-[120px] transform -translate-x-1/2 -translate-y-1/2 lg:ml-[25%]'
      /* style={{
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        marginRight: '120px'
      }} */
      >
        <div className='w-[80%] mt-7 ml-[10%] mr-[10%]'>
          <h3 className='text-lg font-bold'>Bienvenido a <span className='text-blue-800 text-4xl'>IN-OUT</span></h3>
          <h2 className='mt-1 mb-[60px] text-4xl font-semibold text-black'>Sign In</h2>
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <label className='text-[15px] font-semibold mb-3' htmlFor="">Ingrese su Email:</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-[45px] p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Email"
                />
                <Button color="primary" type='submit' className='bg-blue-800] mb-7 h-[50px] text-base font-medium'>
                  Enviar
                </Button>
                <Button onClick={() => setShowForgotPassword(false)} className='bg-[#f1f1f1] mb-7 h-[50px] text-base font-medium'>
                  Volver al Inicio de Sesión
                </Button>
              </div>
            </form>
          ) : showResetPassword ? (
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <label className='text-[15px] font-semibold mb-3'>Ingrese su nueva contraseña:</label>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                <label className='text-[15px] font-semibold mb-3'>Confirme su nueva contraseña:</label>
                <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />



                <Button color="primary" type='submit' className='bg-blue-800 mb-7 h-[50px] text-base font-medium'>
                  Restablecer Contraseña
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <label className='text-[15px] font-semibold mb-3' htmlFor="">Ingrese su Email:</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-[45px] p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Email"
                />
                <label className='text-[15px] font-semibold mb-3'>Ingrese su contraseña:</label>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                <div className='flex justify-end items-center mb-[20px] mr-[10px]'>
                  <Link to="#" onClick={() => setShowForgotPassword(true)} className='text-[14px] text-black-100 cursor-pointer'>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button color="primary" type='submit' className='bg-blue-800 mb-7 h-[50px] text-base font-medium'>
                  Ingresar
                </Button>

              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}

export default Login;
