import {pool} from '../database/conexion.js';

export const RegistrarUbicacion = async (req, res) => {
    try {
        let {name, warehouse_id} = req.body;
        let sql = `insert into warehouse_locations (name, warehouse_id) values (?,?)`;
        let values = [name, warehouse_id];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Detalle_ubicacion registrada con éxito"});
        } else {
            return res.status(422).json({"message": "No se pudo registra el detalle de ubicación."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarUbicacion = async (req, res) => {
    try {
        let [result] = await pool.query(`
            SELECT 
                e.warehouseLocation_id AS "codigo",
                e.name,
                c.name AS warehouse_id,
                c.warehouse_id AS code_warehouse,
                e.status,
                DATE_FORMAT(e.created_at, '%d/%m/%Y') AS fecha_creacion
            FROM 
                warehouse_locations AS e
            LEFT JOIN 
                warehouses AS c 
            ON 
                e.warehouse_id = c.warehouse_id 
            ORDER BY 
                e.warehouseLocation_id ASC
        `);

        if(result.length > 0) {
            return res.status(200).json({data: result});
        } else {
            return res.status(200).json({message: 'No se encontraron detalles de ubicación', data: []});
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar ubicaciones', error: error.message });
    }
};

export const BuscarUbicacion = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select e.*, c.Nombre_bodega from detalle_ubicacion 
                   AS e 
                   JOIN bodega AS c ON e.fk_bodega = c.codigo_Bodega
                   AND Nombre_ubicacion like ?
                   ORDER BY e.codigo_Detalle ASC`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Encontrado", "Ubicacion": rows});
        } else {
            return res.status(400).json({"message": "Detalle de ubicacion no encontrada"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarUbicacion = async (req, res) => {
    try {
        let id = req.params.id;
        let { name, warehouse_id } = req.body;

        const [ubicacionResult] = await pool.query('SELECT * FROM warehouse_locations WHERE warehouseLocation_id = ?', [id]);

        if (ubicacionResult.length === 0) {
            return res.status(404).json({ "Message": "Detalle de ubicación no encontrado." });
        }

        let sql = `UPDATE warehouse_locations SET name = ?, warehouse_id = ? WHERE warehouseLocation_id = ?`;
        let [result] = await pool.query(sql, [name, warehouse_id, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "Message": "Detalle de ubicación actualizado con éxito." });
        } else {
            return res.status(400).json({ "Message": "Detalle de ubicación no actualizado." });
        }
    } catch (error) {
        return res.status(500).json({ "Message": "Error interno del servidor.", "Error": error.message });
    }
};






export const EliminarUbicacion = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from detalle_ubicacion where codigo_Detalle = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Detalle de ubicación eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Detalle de ubicación no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const Desactivarubicacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la ubicación
        const sqlGetEstado = `SELECT status FROM warehouse_locations WHERE warehouseLocation_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la ubicación
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Detalle de ubicación no encontrado." });
        }

        // Verificar si la c ategoría está siendo utilizado
        const sqlCheckUso = `SELECT COUNT(*) AS count FROM batch_location_infos WHERE warehouseLocation_id = ? AND quantity > 0`;
        const [usoResult] = await pool.query(sqlCheckUso, [id]);

        if (usoResult[0].count > 0) {
            return res.status(400).json({ message: "La ubicación esta siendo utlizada." });
        }

        const estadoActual = estadoResult[0].status;
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual == 1) {
            nuevoEstado = '0';
        } else if (estadoActual == 0) {
            nuevoEstado = '1';
        } else {
            // En caso de un estado no esperado, mantener el estado actual
            nuevoEstado = estadoActual;
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE warehouse_locations SET status = ? WHERE warehouseLocation_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Detalle de ubicación actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Detalle de ubicación no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};