import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

export const testDatabaseConnection = async (req, res, next) => {
    try {
        // Intenta obtener una conexión desde el pool
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos.');

        // Libera la conexión
        connection.release();

        //Enviar respuesta
        next();

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: true,
                message: 'No se conectó a la base de datos. Verifica que el servidor de base de datos esté funcionando y que las credenciales sean correctas.'
            })
        } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            return res.status(502).json({
                error: true,
                message: 'Error de red: No se pudo conectar a la base de datos. Verifica tu conexión a internet.'
            })
        } else {
            return res.status(500).json({
                error: true,
                message: `Error al conectar con la base de datos: ${error.message}`
            })
        }
    }
}