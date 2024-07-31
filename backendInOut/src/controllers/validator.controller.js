import { pool } from '../database/conexion.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const validarUsuario = async (req, res) => {
  try {
    //Solicitar los datos de la peticion en el body
    const { email, password } = req.body;

    //consulta para buscar el usuario mediante el correo
    const sql = `SELECT * FROM users 
               WHERE email = ?;`;
    const data = [email]
    const [rows] = await pool.query(sql, data);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "El usuario no se encuentra registrado en la base de datos",
      });
    }

    const user = rows[0];

    // Verificar si el estado del usuario es "Activo"
    if (user.status != 1) {
      return res.status(401).json({
        message: "Usuario desactivado, Contacte al administrador"
      })
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(403).json({
        error: true,
        message: "Contraseña incorrecta. Acceso denegado"
      })
    }

    //Consulta para buscar el rol del usuario mediante role_id
    const sqlFindRole = `SELECT * FROM roles 
    WHERE role_id = ?;`;
    const dataFindRole = [user.role_id]
    const [rowsDataFindRole] = await pool.query(sqlFindRole, dataFindRole);

    //Consulta para buscar el rol del usuario mediante position_id
    const sqlFindPosition = `SELECT * FROM positions 
    WHERE position_id = ?;`;
    const dataFindPosition = [user.position_id]
    const [rowsDataFindPosition] = await pool.query(sqlFindPosition, dataFindPosition);

    // Generar token
    const token = jwt.sign({
      id: user.user_id,
      user_id: user.user_id,
      role_id: user.role_id,
      role: rowsDataFindRole[0],
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      position_id: user.position_id,
      position: rowsDataFindPosition[0],
      email: user.email,
      identification: user.identification,
      course_id: user.course_id,
      estado: user.status
    }, process.env.SECRET_KEY, {
      expiresIn: process.env.TIME,
    });

    //Configurando el token en las cookies
    res.cookie('InOutToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
      path: '/'
    });

    return res.status(200).json({
      message: "Usuario autenticado",
      token,
      userName: user.name,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      identification: user.identification,
      role: user.role_id,
      position_id: user.position_id,
      course_id: user.course_id,
      user_id: user.user_id,
      estado: user.status
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
      error: "Error en la autenticación del usuario"
    });
  }
};

export const validarToken = async (req, res, next) => {
  const token_Cliente = req.cookies.token;
  if (!token_Cliente) {
    return res.status(401).json({
      error: true,
      message: 'No se proporcionó ningún token. Acceso denegado.'
    });
  }
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token_Cliente, process.env.SECRET_KEY);
    req.user = decoded;  // Agregar los datos del usuario al objeto 
    next(); // Continuar con la siguiente función en el middleware
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'El token ha expirado. Por favor, inicia sesión nuevamente.'
      });
    } else {
      return res.status(401).json({
        error: true,
        message: 'Token no válido. Acceso denegado.',
        ramark: e.message
      });
    };
  }
};