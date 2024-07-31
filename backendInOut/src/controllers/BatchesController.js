import { pool } from "../database/conexion.js";

export const getBatchesById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT 
                        b.*,
                        wl.name AS location_nanme
                    FROM batches AS b
                    JOIN batch_location_infos AS bli ON b.batch_id = bli.batch_id
                    JOIN warehouse_locations AS wl ON bli.warehouseLocation_id = wl.warehouseLocation_id
                    WHERE b.quantity > 0 AND b.element_id = ?;`;
        const data = [id];
        const [result] = await pool.query(sql, data);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                error: false,
                message: "No se encontraron lotes",
                data: []
            });
        }

        return res.status(200).json({
            error: false,
            message: "Lotes listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}