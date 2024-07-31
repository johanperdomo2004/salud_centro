import {pool} from '../database/conexion.js';

export const RegistrarEmpaque = async (req, res) => {
    try {
        let {name} = req.body;
        let sql = `insert into package_types (name) values (?)`;
        let values = [name];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Empaque registrado con éxito"});
        } else {
            return res.status(422).json({"message": "No se pudo registrar el empaque."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarEmpaque = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT *, packageType_id AS "codigo", DATE_FORMAT(created_at, '%d/%m/%Y') AS fecha_creacion FROM package_types`);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({message: 'No hay empaques registrados'});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const BuscarEmpaque = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from package_types where name like ?`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Empaque econtrado", "Empaque": rows});
        } else {
            return res.status(400).json({"message": "Tipo Empaque no encontrado"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarEmpaque = async (req, res) => {
    try {
        let id = req.params.id;
        let { name } = req.body;

        // Verificar si el tipo de empaque con el ID proporcionado existe
        const [empaqueResult] = await pool.query('SELECT * FROM package_types WHERE packageType_id = ?', [id]);

        // Si no se encuentra el tipo de empaque, devolver un error 404
        if (empaqueResult.length === 0) {
            return res.status(404).json({ "Message": "Tipo de empaque no encontrado." });
        }

        // Actualizar el nombre del tipo de empaque
        let sql = `UPDATE package_types SET name = ? WHERE packageType_id = ?`;
        let [result] = await pool.query(sql, [name, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "Message": "Tipo de empaque actualizado con éxito." });
        } else {
            return res.status(400).json({ "Message": "Tipo de empaque no actualizado." });
        }
    } catch (error) {
        return res.status(500).json({ "Message": "Error interno del servidor.", "Error": error.message });
    }
};


export const EliminarEmpaque = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from package_types where packageType_id = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Tipo Empaque eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Tipo Empaque no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarEmpaque = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el empaque existe
        const sqlGetEstado = `SELECT status FROM package_types WHERE packageType_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Tipo de Empaque no encontrado." });
        }

        // Verificar si el empaque está siendo utilizado
        const sqlCheckUso = `SELECT COUNT(*) AS count FROM elements WHERE packageType_id = ?`;
        const [usoResult] = await pool.query(sqlCheckUso, [id]);

        if (usoResult[0].count > 0) {
            return res.status(400).json({ message: "El empaque esta siendo utilizado por uno o más elementos." });
        }

        // Cambiar el estado del empaque
        const estadoActual = estadoResult[0].status;
        let nuevoEstado = estadoActual == 1 ? '0' : '1';
        let estadoDescripcion = nuevoEstado == '1' ? 'activo' : 'inactivo';

        const sqlUpdateEstado = `UPDATE package_types SET status = ? WHERE packageType_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Empaque actualizado a estado ${estadoDescripcion} con éxito.` });
        } else {
            return res.status(404).json({ message: "Empaque no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

