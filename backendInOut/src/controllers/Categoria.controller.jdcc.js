import {pool} from '../database/conexion.js';

export const RegistrarCategoria = async (req, res) => {
    try {
        let {name} = req.body;
        let sql = `insert into categories (name) values (?)`;
        let values = [name];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Categoria elemento registrado con éxito"});
        } else {
            return res.status(422).json({"message": "No se pudo registrar la categoría."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarCategoria = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT *, 
            category_id AS "codigo", DATE_FORMAT(created_at, '%d/%m/%Y') AS fecha_creacion FROM categories`);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({message: "No hay categorías registradas."});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const BuscarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from categoria_elemento where Nombre_Categoria like ?`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Categría econtrada", "categoria": rows});
        } else {
            return res.status(400).json({"message": "Categoria elemento no encontrado"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        let { name } = req.body;

        const [categoriaResult] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [id]);

        if (categoriaResult.length === 0) {
            return res.status(404).json({ "Message": "Categoría no encontrada." });
        }

        let sql = `UPDATE categories SET name = ? WHERE category_id = ?`;
        let [result] = await pool.query(sql, [name, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "Message": "Categoría actualizada con éxito." });
        } else {
            return res.status(400).json({ "Message": "Categoría no actualizada." });
        }
    } catch (error) {
        return res.status(500).json({ "Message": "Error interno del servidor.", "Error": error.message });
    }
};


export const EliminarCategoria = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from categories where category_id = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Categoria Elemento eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Categoria Elemento no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la categoría
        const sqlGetEstado = `SELECT status FROM categories WHERE category_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la categoría
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Categoría Elemento no encontrada." });
        }

        // Verificar si la c ategoría está siendo utilizado
        const sqlCheckUso = `SELECT COUNT(*) AS count FROM elements WHERE category_id = ?`;
        const [usoResult] = await pool.query(sqlCheckUso, [id]);

        if (usoResult[0].count > 0) {
            return res.status(400).json({ message: "La categoría esta siendo utilizada por uno o más elementos." });
        }

        // Cambiar el estado del empaque
        const estadoActual = estadoResult[0].status;
        let nuevoEstado = estadoActual == 'activo' ? 'inactivo' : 'activo';
        let estadoDescripcion = nuevoEstado == 'activo' ? 'activo' : 'inactivo';

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE categories SET status = ? WHERE category_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Categoría Elemento actualizada a estado ${estadoDescripcion} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Categoría Elemento no actualizada." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};