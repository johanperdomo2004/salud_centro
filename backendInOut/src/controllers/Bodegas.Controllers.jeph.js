import { pool } from '../database/conexion.js';

export const RegistrarBodega = async (req, res) => {
    try {
        const { name } = req.body;

        // Agregamos un registro para ver los datos recibidos
        const sql = `INSERT INTO warehouses ( name )
                     VALUES ( ?)`;
        const values = [name];

        const [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ "message": "Se registró con éxito la Bodega" });
        } else {
            return res.status(403).json({ "message": "Bodega no registrada" });
        }
    } catch (e) {
        // Agregamos un registro para ver el error
        return res.status(500).json({ "message": `Error en el servidor: ${e.message}` });
    }
};

export const listarBodegas = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT *, warehouse_id AS `codigo`, DATE_FORMAT(created_at, '%d/%m/%Y') FROM warehouses");

        if (result.length > 0) {
            return res.status(200).json({data: result});
        } else {
            return res.status(200).json({ message: 'No se encontraron bodegas', data: [] });
        }

    } catch (e) {
        return res.status(500).json({ 'message': 'error' + e });
    }
};

export const BuscarBodega = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from bodegas where Nombre_bodega like ?`;
        let [rows] = await pool.query(sql, id2);

        if (rows.length > 0) {
            return res.status(200).json({ "message": "Bodega encontrado con éxito", "Elemento": rows });

        } else {
            return res.status(404).json({ "message": "Bodega no encontrado" });
        }
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
};

export const ActualizarBodega = async (req, res) => {
    try {
        let id = req.params.id;
        let { name } = req.body;
        let sql = `
            UPDATE warehouses
              SET  name = ?
            WHERE warehouse_id = ?
        `;
        let [rows] = await pool.query(sql, [name, id]);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ "message": "Bodega actualizada con éxito" });
        } else {
            return res.status(404).json({ "message": "Bodega no encontrada" });
        }
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
}

export const DesactivarBodega = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la bodega
        const sqlGetEstado = `SELECT status FROM warehouses WHERE warehouse_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la bodega
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Bodega no encontrada." });
        }

        const estadoActual = estadoResult[0].status;
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === '1') {
            nuevoEstado = '0';
        } else if (estadoActual === '0') {
            nuevoEstado = '1';
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE warehouses SET status = ? WHERE warehouse_id = ?`;
        await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        // Consulta SQL para obtener las bodegas activas restantes
        const sqlSelectActivos = `SELECT * FROM warehouses`;
        const [result] = await pool.query(sqlSelectActivos);

        // Convertir los estados a 'activo' o 'inactivo' antes de enviar la respuesta
        const bodegas = result.map(bodega => ({
            ...bodega,
            status: bodega.status === '1' ? 'activo' : 'inactivo'
        }));

        return res.status(200).json(bodegas);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
