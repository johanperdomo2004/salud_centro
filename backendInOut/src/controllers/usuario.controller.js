import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';


export const registrarUsuario = async (req, res) => {
    try {

        let { name, lastname, phone, email, identification, role_id, position_id, course_id } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        // Verificar si el correo ya existe
        let checkEmailSql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        let [emailRows] = await pool.query(checkEmailSql, [email]);

        if (emailRows[0].count > 0) {
            return res.status(400).json({ 'message': 'El correo ya está registrado' });
        }

        // Verificar si la identificación ya existe si se ha proporcionado
        if (identification) {
            let checkIdentificationSql = 'SELECT COUNT(*) as count FROM users WHERE identification = ?';
            let [identificationRows] = await pool.query(checkIdentificationSql, [identification]);
            if (identificationRows[0].count > 0) {
                return res.status(400).json({ 'message': 'La identificación ya está registrada' });
            }
        }

        // Verificar si el position_id existe
        let checkPositionIdSql = 'SELECT COUNT(*) as count FROM positions WHERE position_id = ?';
        let [positionRows] = await pool.query(checkPositionIdSql, [position_id]);
        if (positionRows[0].count === 0) {
            return res.status(400).json({ 'message': 'La posición no existe' });
        }

        // Validar que course_id solo se pueda ingresar si position_id es 1 (aprendiz)
        if (position_id !== 1 && course_id) {
            return res.status(400).json({ 'message': 'El Id de Ficha solo se puede ingresar para un aprendiz' });
        }


        // Encriptar la identificación para usarla como contraseña si se ha proporcionado
        let hashedPassword = null;
        if (identification) {
            const contraseniaForHash = identification.toString();
            const saltRounds = 10; // Cost factor for bcrypt
            hashedPassword = await bcrypt.hash(contraseniaForHash, saltRounds);
        }

        let sql, values;
        if (course_id) {
            sql = `INSERT INTO users (name, lastname, phone, email, identification, role_id, position_id, course_id, password)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            values = [name, lastname, phone, email, identification, role_id, position_id, course_id, hashedPassword];
        } else {
            sql = `INSERT INTO users (name, lastname, phone, email, identification, role_id, position_id, password)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            values = [name, lastname, phone, email, identification, role_id, position_id, hashedPassword];
        }

        let [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ 'message': 'Usuario Registrado con Éxito' });
        } else {
            return res.status(403).json({ 'message': 'Usuario No Registrado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': e.message });
    }
};

export const ListarUsuario = async (req, res) => {
    try {
        let [result] = await pool.query(`
                SELECT 
                    u.user_id AS 'codigo',
                    CONCAT(u.name,' ',u.lastname) AS nombre,
                    u.phone,
                    u.email AS correo,
                    u.identification,
                    u.course_id,
                    u.status,
                    r.role_id,
                    r.name AS role,
                    p.position_id,
                    p.name AS position
                FROM 
                    users u
                JOIN 
                    roles r ON u.role_id = r.role_id
                JOIN 
                    positions p ON u.position_id = p.position_id
            `);


        // Transformar el estado a un formato legible por humanos
        result = result.map(user => ({
            ...user,
            status: user.status === '1' ? 'Activo' : user.status === '0' ? 'Inactivo' : 'Desconocido'
        }));

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(403).json({ 'message': 'No existen Usuarios Registrados' });
        }
    } catch (error) {
        return res.status(500).json({ 'message': 'Error al listar usuarios', 'error': error.message });
    }
};

export const BuscarUsuario = async (req, res) => {
    try {
        // Validar el ID de usuario
        const identification = req.params.id;
        if (!identification) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }

        const sql = `
            SELECT 
                u.user_id,
                u.name AS user_name,
                u.lastname,
                u.phone,
                u.email,
                u.identification,
                u.course_id,
                u.status,
                r.name AS role_name,
                p.name AS position_name,
                u.password
            FROM 
                users u
            JOIN 
                roles r ON u.role_id = r.role_id
            JOIN 
                positions p ON u.position_id = p.position_id
            WHERE 
                u.user_id = ?
        `;

        // Ejecutar la consulta SQL con el parámetro de identificación
        const [rows] = await pool.query(sql, [identification]);

        // Verificar si se encontró algún usuario
        if (rows.length > 0) {
            // Transformar el estado a un formato legible por humanos
            const user = {
                ...rows[0],
                status: rows[0].status === '1' ? 'Activo' : rows[0].status === '0' ? 'Inactivo' : 'Desconocido'
            };

            // Devolver el usuario encontrado al cliente
            return res.status(200).json({ Datos: user });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const ActualizarUsuario = async (req, res) => {
    try {
        let user_id = req.params.id;
        let { name, lastname, phone, email, identification, role_id, position_id, course_id } = req.body;

        let sql, values;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        // Consulta SQL base para actualizar los campos comunes
        sql = `UPDATE users SET name = ?,
                                lastname = ?,
                                phone = ?,
                                email = ?,
                                identification = ?,
                                role_id = ?,
                                position_id = ?`;

        // Validar si el nuevo position_id es 1 (aprendiz) y course_id está presente
        if (position_id == '1' && course_id !== undefined) {
            sql += `, course_id = ?`;
            values = [name, lastname, phone, email, identification, role_id, position_id, course_id, user_id];
        } else if (position_id !== 1) {
            sql += `, course_id = ?`;
            values = [name, lastname, phone, email, identification, role_id, position_id, null, user_id];
        } else {
            values = [name, lastname, phone, email, identification, role_id, position_id, user_id];
        }

        if (position_id == '1' && !course_id) {
            return res.status(400).json({
                message: 'Como es aprendiz debe ingresar id ficha'
            })
        }
        // Validar si la identificación ya existe si se ha proporcionado (excepto si es la misma del usuario actual)
        if (identification) {
            let checkIdentificationSql = 'SELECT COUNT(*) as count FROM users WHERE identification = ? AND user_id <> ?';
            let [identificationRows] = await pool.query(checkIdentificationSql, [identification, user_id]);
            if (identificationRows[0].count > 0) {
                return res.status(400).json({ 'message': 'La identificación ya está registrada' });
            }
        }

        // Validar si el correo electrónico ya existe si se ha proporcionado (excepto si es el mismo del usuario actual)
        if (email) {
            let checkEmailSql = 'SELECT COUNT(*) as count FROM users WHERE email = ? AND user_id <> ?';
            let [emailRows] = await pool.query(checkEmailSql, [email, user_id]);
            if (emailRows[0].count > 0) {
                return res.status(400).json({ 'message': 'El correo electrónico ya está registrado' });
            }
        }

        // Agregar la condición WHERE user_id = ?
        sql += ` WHERE user_id = ?`;

        let [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ 'message': 'Usuario actualizado con éxito' });
        } else {
            return res.status(403).json({ 'message': 'Usuario no actualizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': e.message });
    }
};

export const DesactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual del usuario
        const sqlGetEstado = `SELECT status FROM users WHERE user_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró el usuario
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const estadoActual = estadoResult[0].status; // Asegúrate de que el nombre de la columna es 'status'
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === '0') {
            nuevoEstado = '1';
        } else if (estadoActual === '1') {
            nuevoEstado = '0';
        } else {
            // En caso de un estado no esperado, mantener el estado actual
            nuevoEstado = estadoActual;
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE users SET status = ? WHERE user_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Usuario actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ message: "Usuario no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Endpoint para actualizar el perfil del usuario logueado
export const ActualizarPerfil = async (req, res) => {
    try {

        const { id } = req.params; // Obtener el user_id del token decodificado

        // Obtener los datos del cuerpo de la solicitud
        const user = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        // Consulta SQL para actualizar el perfil del usuario
        const sql = `
            UPDATE users 
            SET ?
            WHERE user_id = ?
        `;

        const [rows] = await pool.query(sql, [user, id]);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ message: 'Perfil actualizado con éxito' });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

export const cambiarContrasena = async (req, res) => {
    try {
        const user_id = req.params.id;
        const { password, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Las nuevas contraseñas no coinciden" });
        }

        const obtenerContrasenaSql = 'SELECT password FROM users WHERE user_id = ?';
        const [rows] = await pool.query(obtenerContrasenaSql, [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const storedPassword = rows[0].password;
        const passwordsMatch = await bcrypt.compare(password, storedPassword);

        if (!passwordsMatch) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const actualizarContrasenaSql = 'UPDATE users SET password = ? WHERE user_id = ?';
        await pool.query(actualizarContrasenaSql, [hashedNewPassword, user_id]);

        return res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error interno al cambiar la contraseña", error: error.message });
    }
};
