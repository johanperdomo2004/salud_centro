import { pool } from "../database/conexion.js";

export const getPositions = async (req, res) => {
    try {
        const sql = `SELECT * FROM positions;`;
        const [result] = await pool.query(sql);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                error: false,
                message: "No se encontraron Cargos",
                data: []
            });
        }

        return res.status(200).json({
            error: false,
            message: "Cargos listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}