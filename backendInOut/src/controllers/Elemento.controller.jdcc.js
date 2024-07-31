import { pool } from '../database/conexion.js';
import { format } from 'date-fns';

export const RegistrarElemento = async (req, res) => {
    try {
        let { name, elementType_id, category_id, measurementUnit_id, packageType_id } = req.body;

        let sql = `INSERT INTO elements 
               ( name, elementType_id, category_id, measurementUnit_id, packageType_id) 
               VALUES (?, ?, ?, ?, ?)`;
        let values = [name, elementType_id, category_id, measurementUnit_id, packageType_id];

        let [result] = await pool.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Elemento registrado con éxito" });
        } else {
            return res.status(422).json({ message: "No se pudo registrar el elemento debido a datos incorrectos" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const AñadirStock = async (req, res) => {
    try {
        let id = req.params.id;
        let { cantidad } = req.body;

        // Obtener el stock actual del elemento
        let [elemento] = await pool.query('SELECT stock FROM elemento WHERE codigo_elemento = ?', [id]);
        let stockActual = elemento[0].stock;

        // Sumar la cantidad de stock que deseas añadir
        let nuevoStock = stockActual + cantidad;

        // Actualizar el stock en la base de datos
        let [result] = await pool.query('UPDATE elemento SET stock = ? WHERE codigo_elemento = ?', [nuevoStock, id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ "message": "Stock añadido correctamente" });
        } else {
            return res.status(400).json({ "message": "Error al añadir stock" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const ListarElemetos = async (req, res) => {
    try {
        let [result] = await pool.query(
            `SELECT 
                e.element_id AS "codigo",
                e.name,
                e.stock,
                c.name AS category_id,
                c.category_id AS code_Category,
                n.name AS elementType_id,
                n.elementType_id AS code_elementType,
                me.name AS measurementUnit_id,
                me.measurementUnit_id AS code_Unit,
                em.name AS packageType_id,
                em.packageType_id AS code_Package,
                e.status,
                DATE_FORMAT(e.created_at, '%d/%m/%Y') AS fecha_creación
            FROM 
                elements AS e 
            JOIN 
                categories AS c ON e.category_id = c.category_id 
            JOIN 
                element_types AS n ON e.elementType_id = n.elementType_id
            JOIN 
                measurement_units AS me ON e.measurementUnit_id = me.measurementUnit_id
            JOIN 
                package_types AS em ON e.packageType_id = em.packageType_id
                `
        );

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(204).json({ message: 'No se encontaron elementos registrados.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al listar elementos', error: error.message });
    }
};

export const BuscarElemento = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `SELECT e.*, c.nombre_categoria, n.nombre_tipoElemento, me.Nombre_Medida, em.Nombre_empaque, u.Nombre_ubicacion
                FROM elemento AS e 
                JOIN categoria_elemento AS c ON e.fk_categoria = c.codigo_categoria 
                JOIN tipo_elemento AS n ON e.fk_tipoElemento = n.codigo_Tipo
                JOIN unidad_medida AS me ON e.fk_unidadMedida = me.codigo_medida
                JOIN tipo_empaque AS em ON e.fk_tipoEmpaque = em.Codigo_empaque
                JOIN detalle_ubicacion AS u ON e.fk_detalleUbicacion = u.codigo_Detalle
                AND e.Nombre_elemento like ?
                ORDER BY e.codigo_elemento ASC `;
        let [rows] = await pool.query(sql, [id2]);

        if (rows.length > 0) {

            return res.status(200).json({ "message": "Elemento encontrado con éxito", "Elemento": rows });

        } else {
            return res.status(404).json({ "message": "Elemento no encontrado" });
        }
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
}

export const ActualizarElemento = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, elementType_id, category_id, measurementUnit_id, packageType_id } = req.body;

        // Obtener el valor actual del elemento
        const [elementoResult] = await pool.query('SELECT * FROM elements WHERE element_id = ?', [id]);
        if (elementoResult.length === 0) {
            return res.status(404).json({ "Message": "Elemento no encontrado." });
        }
        const currentElement = elementoResult[0];

        // Consulta SQL para actualizar el elemento
        const sql = `
            UPDATE elements 
            SET
                name = ?, 
                elementType_id = ?, 
                category_id = ?, 
                measurementUnit_id = ?,
                packageType_id = ?
            WHERE 
                element_id = ?`;

        const [result] = await pool.query(sql, [
            name || currentElement.name, // Usar el valor actual si no se proporciona uno nuevo
            elementType_id || currentElement.elementType_id, // Usar el valor actual si no se proporciona uno nuevo
            category_id || currentElement.category_id, // Usar el valor actual si no se proporciona uno nuevo
            measurementUnit_id || currentElement.measurementUnit_id, // Usar el valor actual si no se proporciona uno nuevo
            packageType_id || currentElement.packageType_id, // Usar el valor actual si no se proporciona uno nuevo
            id
        ]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "Message": "Elemento actualizado con éxito." });
        } else {
            return res.status(400).json({ "Message": "Elemento no actualizado. Verifique los datos proporcionados." });
        }
    } catch (error) {
        return res.status(500).json({ "Message": "Error interno del servidor.", "Error": error.message });
    }
};





export const EliminarElemento = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `delete from elements where element_id = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "message": "Elemento eliminado" });
        } else {
            return res.status(404).json({ "message": "Elemento no eliminado" });
        }
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

export const DesactivarElementos = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual del elemento
        const sqlGetEstado = `SELECT status, stock FROM elements WHERE element_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró el elemento
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Elemento no encontrado." });
        }

        const { status: estadoActual, stock } = estadoResult[0];

        // Verificar si el stock es mayor a 0
        if (stock > 0) {
            return res.status(400).json({ message: "El stock del elemento es mayor a 0, no se puede desactivar." });
        }

        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual == 1) {
            nuevoEstado = "0";
        } else if (estadoActual == 0) {
            nuevoEstado = "1";
        } else {
            // En caso de un estado no esperado, mantener el estado actual
            nuevoEstado = estadoActual;
        }

        // Actualizar el estado en la base de datos solo si el stock es 0
        if (stock === 0) {
            const sqlUpdateEstado = `UPDATE elements SET status = ? WHERE element_id = ?`;
            const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: `Elemento actualizado a estado ${nuevoEstado == 1 ? 'activo' : 'inactivo'} con éxito.` });
            } else {
                return res.status(404).json({ message: "Elemento no actualizado." });
            }
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

