import {pool} from '../database/conexion.js';

export const RegistrarMedida = async (req, res) => {
    try {
        let {name} = req.body;
        let sql = `insert into measurement_units (name) values (?)`;
        let values = [name];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Medida registrado con éxito"});
        } else {
            return res.status(422).json({"message": "Medida no registrado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarMedida = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT *, measurementUnit_id AS "codigo",  DATE_FORMAT(created_at, '%d/%m/%Y') AS fecha_creacion FROM measurement_units`);


        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({message: "No hay medidas registradas"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const Buscarmedida = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from measurement_units where  name like ?`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Medida encontrada con éxito", "medida": rows});
        } else {
            return res.status(400).json({"message": "Unidad de medida no encontrada"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarMedida = async (req, res) => {
    try {
        let id = req.params.id;
        let { name } = req.body;

        // Verificar si la unidad de medida con el ID proporcionado existe
        const [medidaResult] = await pool.query('SELECT * FROM measurement_units WHERE measurementUnit_id = ?', [id]);

        // Si no se encuentra la unidad de medida, devolver un error 404
        if (medidaResult.length === 0) {
            return res.status(404).json({ "Message": "Unidad de medida no encontrada." });
        }

        // Actualizar el nombre de la unidad de medida
        let sql = `UPDATE measurement_units SET name = ? WHERE measurementUnit_id = ?`;
        let [result] = await pool.query(sql, [name, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "Message": "Unidad de medida actualizada con éxito." });
        } else {
            return res.status(400).json({ "Message": "Unidad de medida no actualizada." });
        }
    } catch (error) {
        return res.status(500).json({ "Message": "Error interno del servidor.", "Error": error.message });
    }
};


export const EliminarMedida = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from unidad_medida where codigo_medida = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Unidad de medida eliminada con éxito."});
        } else {
            return res.status(400).json({"Message": "Unidad de medida no eliminada."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarMedida = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la unidad de medida
        const sqlGetEstado = `SELECT status FROM measurement_units WHERE measurementUnit_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la unidad de medida
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Unidad de medida no encontrada." });
        }

        const sqlCheckUso = `SELECT COUNT(*) AS count FROM elements WHERE measurementUnit_id = ?`;
        const [usoResult] = await pool.query(sqlCheckUso, [id]);

        if (usoResult[0].count > 0) {
            return res.status(400).json({ message: "La medida esta siendo utilizada por uno o más elementos." });
        }


        const estadoActual = estadoResult[0].status;
        let nuevoEstado = estadoActual == 1 ? '0' : '1';
        let estadoDescripcion = nuevoEstado == '1' ? 'activo' : 'inactivo';


        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE measurement_units SET status = ? WHERE measurementUnit_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Unidad de medida actualizada a estado ${estadoDescripcion} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Unidad de medida no actualizada." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};