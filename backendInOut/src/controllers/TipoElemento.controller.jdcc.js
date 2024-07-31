import {pool} from '../database/conexion.js';

export const RegistrarTipo = async (req, res) => {
    try {
        let {name} = req.body;
        let sql = `insert into element_types (name) values (?)`;
        let values = [name];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Tipo elemento registrado con éxito"});
        } else {
            return res.status(400).json({"message": "tipo elemento no registrado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarTipo = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT * FROM element_types`);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({"message": "No hay tipos de elemento registrados."});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const BuscarTipo = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `select * from element_types where elementType_id = ?`;

        let [result] = await pool.query(sql, id);

        if(result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({"message": "Tipo elemento no encontrado"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarTipo = async (req, res) => {
    try {
        let id = req.params.id;
        let {name} = req.body;
        let sql = `UPDATE element_types SET name = ? WHERE elementType_id = ?`;

        let [result] = await pool.query(sql, [name, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Tipo Elemento actualizado con éxito."});
        } else {
            return res.status(400).json({"Message": "Tipo Elemento no actualizado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const EliminarTipo = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from element_types where elementType_id = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Tipo Elemento eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Tipo Elemento no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarTipo = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual del tipo de elemento
        const sqlGetEstado = `SELECT status FROM element_types WHERE elementType_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró el tipo de elemento
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Tipo de elemento no encontrado." });
        }

        const estadoActual = estadoResult[0].status;
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === 'activo') {
            nuevoEstado = 'inactivo';
        } else if (estadoActual === 'inactivo') {
            nuevoEstado = 'activo';
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE element_types SET status = ? WHERE elementType_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Tipo de elemento actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Tipo de elemento no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
