//Importación de dependencias

//Importación desde otros Scripts
import { pool } from "../database/conexion.js";

//Lista Todos los Movimientos
export const ListarTodosMovimientos = async (req, res) => {
    try {
        //Consulta trayendo la información completa de los movimientos
        const sql = `SELECT 
                        m.Codigo_movimiento AS "Codigo",
                        m.fecha_movimiento AS "Fecha",
                        u.nombre_usuario AS "Usuario",
                        u.apellido_usuario AS "Apellido",
                        u.email_usuario AS "Correo",
                        tm.Nombre_movimiento AS "Tipo",
                        m.Estado AS "Estado"
                    FROM movimiento AS m 
                    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
                    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
                    ORDER BY Codigo ASC`;

        //Ejecutar la consulta
        const [result] = await pool.query(sql);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length > 0) {
            return res.status(200).json({ message: "Movimientos listados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos" });
        }
    } catch (error) {
        //Enviar error por servidor
        return res.status(500).json({ message: error });
    }
}

export const BuscarMovimiento = async (req, res) => {
    try {
        let { id } = req.params;

        const newId = id + '%'

        let sql = `SELECT 
                        m.Codigo_movimiento AS "Codigo",
                        m.fecha_movimiento AS "Fecha",
                        u.nombre_usuario AS "Usuario",
                        u.apellido_usuario AS "Apellido",
                        u.email_usuario AS "Correo",
                        u.identificacion AS "Identificacion",
                        tm.Nombre_movimiento AS "Tipo",
                        m.Estado AS "Estado"
                    FROM movimiento AS m 
                    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
                    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
                    WHERE (
                        m.Codigo_movimiento LIKE ? || 
                        u.nombre_usuario LIKE ? || 
                        u.apellido_usuario LIKE ? || 
                        u.identificacion LIKE ?)
                    ORDER BY Fecha DESC;`;
        let [rows] = await pool.query(sql, [newId, newId, newId, newId]);

        if (rows.length > 0) {
            return res.status(200).json({ "message": "Movimiento encontrado con éxito", Movimiento: rows });
        } else {
            return res.status(404).json({ "message": "Movimiento no encontrado", Movimiento: [] });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export const ListarDetallesMovimiento = async (req, res) => {
    try {
        let { id } = req.params;
        //Consulta trayendo la información completa de los movimientos
        const sql = `SELECT 
                        dm.codigo_detalle AS "Codigo",
                        e.Nombre_elemento AS "Elemento",
                        dm.estado AS "Estado",
                        dm.fecha_vencimiento AS "Fecha",
                        dm.cantidad AS "Cantidad",
                        CONCAT(ur.nombre_usuario,' ',ur.apellido_usuario) AS "Recibe",
                        CONCAT(ue.nombre_usuario,' ',ue.apellido_usuario) AS "Entrega",
                        dm.Observaciones AS "Observaciones"
                    FROM detalle_movimiento AS dm
                    JOIN elemento AS e ON dm.fk_elemento = e.Codigo_elemento
                    JOIN usuario AS ur ON dm.Usuario_recibe = ur.id_usuario
                    JOIN usuario AS ue ON dm.Usuario_entrega = ue.id_usuario
                    WHERE dm.fk_movimiento = ?
                    ORDER BY Codigo ASC;
                    `;
        //Ejecutar la consulta
        const [result] = await pool.query(sql, [id]);
        //Revisar que llego información y ejecutar manejo de errores
        if (result.length > 0) {
            return res.status(200).json({ message: "Movimientos listados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos" });
        }
    } catch (error) {

    }
}

//Registrar nuevos movimientos
export const RegistrarMovimientoPrestamo = async (req, res) => {
    try {
        //Traer datos enviados por el body
        let { usuario_solicitud, fk_movimiento, Estado, detalles } = req.body;

        //Iniciar un transaccion en Sql
        await pool.query("START TRANSACTION");

        //Crear un Nuevo Movimiento de tipo Prestamo
        const sqlMovimientoPrestamo = `INSERT INTO movimiento (usuario_solicitud, fk_movimiento, Estado) 
                                        VALUES (?,?,?)`;
        const valuesMovimientoPrestamo = [usuario_solicitud, fk_movimiento, Estado]
        let [rowsMovimientoPrestamo] = await pool.query(sqlMovimientoPrestamo, valuesMovimientoPrestamo);

        //Obtener ID del movimiento recién creado
        const movimientoID = rowsMovimientoPrestamo.insertId;
        const detallesInfo = [];

        for (const detalle of detalles) {
            //Traer informacion de los detalles
            const { fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones } = detalle;
            //Insertar de a un detalle
            const detalleSql = `INSERT INTO detalle_movimiento (fk_movimiento, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones) 
                                    VALUES (?,?,?,?,?,?,?,?)`;
            const detalleValues = [movimientoID, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones];
            let [detalleRows] = await pool.query(detalleSql, detalleValues);

            detallesInfo.push(detalleRows);
        };

        await pool.query("COMMIT");
        return res.status(200).json({ message: "Registro Exitoso", movimiento: rowsMovimientoPrestamo, detalles: detallesInfo });
    } catch (error) {
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({ message: error });
    }
}

export const RegistrarMovimientoIngreso = async (req, res) => {
    try {
        let { usuario_solicitud, fk_movimiento, Estado, detalles } = req.body;
        //Iniciar un transaccion en Sql
        await pool.query("START TRANSACTION");
        //Crear un Nuevo Movimiento de tipo Prestamo
        const sqlMovimientoIngreso = `INSERT INTO movimiento (usuario_solicitud, fk_movimiento, Estado) 
                                    VALUES (?,?,?)`;
        const valuesMovimientoIngreso = [usuario_solicitud, fk_movimiento, Estado]
        let [rowsMovimientoIngreso] = await pool.query(sqlMovimientoIngreso, valuesMovimientoIngreso);

        //Obtener ID del movimiento recién creado
        const movimientoID = rowsMovimientoIngreso.insertId;
        const detallesInfo = [];

        for (const detalle of detalles) {
            //Traer información de los detalles
            const { fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones } = detalle;

            //Insertar de a un detalle
            const detalleSql = `INSERT INTO detalle_movimiento (fk_movimiento, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones) 
                                VALUES (?,?,?,?,?,?,?,?)`;
            const detalleValues = [movimientoID, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones];
            let [detalleRows] = await pool.query(detalleSql, detalleValues);

            detallesInfo.push(detalleRows);

            const elementoSql = `SELECT stock FROM elemento WHERE Codigo_Elemento = ?;`;
            const elementoValues = [fk_elemento];
            const [elementoRows] = await pool.query(elementoSql, elementoValues);


            if (elementoRows.length > 0) {
                if (fk_movimiento == 1) {
                    const stockNuevo = parseInt(elementoRows[0].stock) + parseInt(cantidad);

                    const stockSql = `UPDATE elemento SET stock =? WHERE Codigo_Elemento =?`;
                    const stockValues = [stockNuevo, fk_elemento];
                    const [responseStock] = await pool.query(stockSql, stockValues);

                } else if (fk_movimiento == 2) {
                    const stockNuevo = parseInt(elementoRows[0].stock) - parseInt(cantidad);

                    const stockSql = `UPDATE elemento SET stock =? WHERE Codigo_Elemento =?`;
                    const stockValues = [stockNuevo, fk_elemento];
                    const [responseStock] = await pool.query(stockSql, stockValues);

                }
            }
        };

        await pool.query("COMMIT");
        return res.status(200).json({ message: "Registro Exitoso", movimiento: rowsMovimientoIngreso, detalles: detalles });
    } catch (error) {
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({ message: error });
    }
};

export const RegistrarDetalleMovimiento = async (req, res) => {
    try {
        const { Movimiento, Elemento, Fecha, Cantidad, Recibe, Entrega } = req.body;
        let fecha;

        if (Fecha === '') fecha = null
        else Fecha = Fecha

        const detalleSql = `INSERT INTO detalle_movimiento (fk_movimiento, fk_elemento, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega) 
        VALUES ( ?, ?, ?, ?, ?, ?)`;
        const detalleValues = [Movimiento, Elemento, fecha, Cantidad, Recibe, Entrega];
        let [detalleRows] = await pool.query(detalleSql, detalleValues);

        if (detalleRows.affectedRows > 0) {
            return res.status(200).json({ message: "Detalle Registrado" });
        }
    } catch (error) {
        console.log(error);
    }
}

export const ActualizarDetalleMovimiento = async (req, res) => {
    try {
        let { cantidad } = req.body;
        let { id } = req.params;

        // Iniciar una transacción en SQL
        await pool.query("START TRANSACTION");

        // Obtener el detalle original para conocer la cantidad y el elemento antes de la actualización
        const sqlDetalleOriginal = `SELECT codigo_detalle, cantidad, fk_elemento, fk_movimiento FROM detalle_movimiento WHERE codigo_detalle = ?;`;
        const [rowsDetalleOriginal] = await pool.query(sqlDetalleOriginal, [id]);
        if (rowsDetalleOriginal.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Detalle no encontrado" });
        }

        const detalleOriginal = rowsDetalleOriginal[0];
        const cantidadOriginal = detalleOriginal.cantidad;
        const fk_elemento = detalleOriginal.fk_elemento;
        const fk_movimiento = detalleOriginal.fk_movimiento;

        const sqlMovementParent = `SELECT fk_movimiento FROM movimiento WHERE Codigo_movimiento = ?;`;
        const [rowsMovementParent] = await pool.query(sqlMovementParent, [fk_movimiento]);
        if (rowsMovementParent.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ message: "Detalle Padre no encontrado" });
        }

        const movementParent = rowsMovementParent[0]
        const movementType = movementParent.fk_movimiento

        // Actualizar la cantidad del detalle
        const sqlActualizarDetalle = `UPDATE detalle_movimiento 
                                      SET cantidad = ? 
                                      WHERE codigo_detalle = ?`;
        const valuesActualizarDetalle = [cantidad, id];
        await pool.query(sqlActualizarDetalle, valuesActualizarDetalle);

        // Ajustar el stock del elemento
        const diferenciaCantidad = parseInt(cantidad) - parseInt(cantidadOriginal);

        const sqlElemento = `SELECT stock FROM elemento WHERE Codigo_Elemento = ?`;
        const [rowsElemento] = await pool.query(sqlElemento, [fk_elemento]);

        if (rowsElemento.length > 0) {
            const stockActual = parseInt(rowsElemento[0].stock);
            const stockNuevo = movementType == 1
                ? stockActual + diferenciaCantidad
                : stockActual - diferenciaCantidad;

            const sqlActualizarStock = `UPDATE elemento SET stock = ? WHERE Codigo_Elemento = ?`;
            await pool.query(sqlActualizarStock, [stockNuevo, fk_elemento]);
        }

        await pool.query("COMMIT");
        return res.status(200).json({ message: "Detalle actualizado exitosamente" });
    } catch (error) {
        await pool.query("ROLLBACK");
        return res.status(500).json({ message: error.message });
    }
}

//Funciones del Script
//Listar todos los movimientos
export const getMovements = async (req, res) => {
    try {
        //Consulta trayendo la información completa de los movimientos
        const movementsSql = `SELECT 
                                m.movement_id AS 'codigo',
                                m.created_at AS 'fecha',
                                CONCAT( u.name, ' ', u.lastname) AS "nombre",
                                
                                u.email AS 'correo',
                                u.identification AS 'identificacion',
                                mt.name AS 'tipo'
                            FROM movements AS m
                            JOIN movement_types AS mt 
                                ON m.movementType_id = mt.movementType_id
                            JOIN users AS u
                                ON m.user_application = u.user_id
                            WHERE (m.movementType_id = '1' || m.movementType_id = '2')
                            ORDER BY codigo DESC;`;

        //Ejecutar la consulta
        const [result] = await pool.query(movementsSql);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                message: "No se encontraron movimientos",
                data: []
            });
        }

        return res.status(200).json({
            message: "Movimientos listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getMovementsByUserId = async (req, res) => {
    try {
        const { id } = req.params
        //Consulta trayendo la información completa de los movimientos
        const movementsSql = `SELECT 
                                m.movement_id AS 'codigo',
                                m.created_at AS 'fecha',
                                CONCAT(ua.name, ' ', ua.lastname) AS "nombre",
                                ua.email AS 'correo',
                                ua.identification AS 'identificacion',
                                CONCAT(um.name, ' ', um.lastname) AS "usuario_manager",
                                um.email AS 'correo_manager',
                                um.identification AS 'identificacion_manager',
                                CONCAT(urv.name, ' ', urv.lastname) AS "usuario_receiving",
                                urv.email AS 'correo_receiving',
                                urv.identification AS 'identificacion_receiving',
                                CONCAT(urt.name, ' ', urt.lastname) AS "usuario_returning",
                                urt.email AS 'correo_returning',
                                urt.identification AS 'identificacion_returning',
                                mt.name AS 'tipo',
                                l.name AS status
                            FROM movements AS m
                            LEFT JOIN movement_types AS mt 
                                ON m.movementType_id = mt.movementType_id
                            LEFT JOIN users AS ua
                                ON m.user_application = ua.user_id
                            LEFT JOIN users AS um
                                ON m.user_manager = um.user_id
                            LEFT JOIN users AS urv
                                ON m.user_receiving = urv.user_id
                            LEFT JOIN users AS urt
                                ON m.user_returning = urt.user_id
                            LEFT JOIN loan_statuses AS l
                                ON m.movementLoan_status = l.loanStatus_id
                            WHERE ua.user_id = ?
                            ORDER BY codigo DESC;`;
        const data = [id]
        //Ejecutar la consulta
        const [result] = await pool.query(movementsSql, data);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                message: "No se encontraron movimientos",
                data: []
            });
        }

        return res.status(200).json({
            message: "MOvimientos listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getLoans = async (req, res) => {
    try {
        //Consulta trayendo la información completa de los movimientos
        const movementsSql = `SELECT 
                                m.movement_id AS 'codigo',
                                m.created_at AS 'fecha',
                                CONCAT(ua.name, ' ', ua.lastname) AS "nombre",
                                ua.email AS 'correo',
                                ua.identification AS 'identificacion',
                                CONCAT(um.name, ' ', um.lastname) AS "usuario_manager",
                                um.email AS 'correo_manager',
                                um.identification AS 'identificacion_manager',
                                CONCAT(urv.name, ' ', urv.lastname) AS "usuario_receiving",
                                urv.email AS 'correo_receiving',
                                urv.identification AS 'identificacion_receiving',
                                CONCAT(urt.name, ' ', urt.lastname) AS "usuario_returning",
                                urt.email AS 'correo_returning',
                                urt.identification AS 'identificacion_returning',
                                mt.name AS 'tipo',
                                l.name AS status
                            FROM movements AS m
                            LEFT JOIN movement_types AS mt 
                                ON m.movementType_id = mt.movementType_id
                            LEFT JOIN users AS ua
                                ON m.user_application = ua.user_id
                            LEFT JOIN users AS um
                                ON m.user_manager = um.user_id
                            LEFT JOIN users AS urv
                                ON m.user_receiving = urv.user_id
                            LEFT JOIN users AS urt
                                ON m.user_returning = urt.user_id
                            LEFT JOIN loan_statuses AS l
                                ON m.movementLoan_status = l.loanStatus_id
                            WHERE m.movementType_id = 4
                            ORDER BY codigo DESC;`;

        //Ejecutar la consulta
        const [result] = await pool.query(movementsSql);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                message: "No se encontraron prestamos",
                data: []
            });
        }

        return res.status(200).json({
            message: "Prestamos listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getLoanByMovmentId = async (req, res) => {
    try {

        const { id } = req.params
        //Consulta trayendo la información completa de los movimientos
        const movementsSql = `SELECT 
    m.movement_id AS 'codigo',
    m.created_at AS 'fecha',
    CONCAT(ua.name, ' ', ua.lastname) AS "nombre",
    ua.email AS 'correo',
    ua.identification AS 'identificacion',
    CONCAT(um.name, ' ', um.lastname) AS "usuario_manager",
    um.email AS 'correo_manager',
    um.identification AS 'identificacion_manager',
    CONCAT(urv.name, ' ', urv.lastname) AS "usuario_receiving",
    urv.email AS 'correo_receiving',
    urv.identification AS 'identificacion_receiving',
    CONCAT(urt.name, ' ', urt.lastname) AS "usuario_returning",
    urt.email AS 'correo_returning',
    urt.identification AS 'identificacion_returning',
    mt.name AS 'tipo',
    l.name AS status
FROM movements AS m
LEFT JOIN movement_types AS mt 
    ON m.movementType_id = mt.movementType_id
LEFT JOIN users AS ua
    ON m.user_application = ua.user_id
LEFT JOIN users AS um
    ON m.user_manager = um.user_id
LEFT JOIN users AS urv
    ON m.user_receiving = urv.user_id
LEFT JOIN users AS urt
    ON m.user_returning = urt.user_id
LEFT JOIN loan_statuses AS l
    ON m.movementLoan_status = l.loanStatus_id
WHERE m.movementType_id = 4 AND m.movement_id = ?
ORDER BY codigo DESC;`;

        const data = [id];
        //Ejecutar la consulta
        const [result] = await pool.query(movementsSql, data);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                message: "No se encontraron prestamos",
                data: []
            });
        }

        return res.status(200).json({
            message: "Prestamos listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getMovementsByFilter = async (req, res) => {
    try {

        const { filter } = req.params;

        const filterSql = '%' + filter + '%';

        //Consulta trayendo la información completa de los movimientos
        const movementsSql = `SELECT 
                                m.movement_id AS 'codigo',
                                m.created_at AS 'fecha',
                                u.name AS 'nombre',
                                u.lastname AS 'apellido',
                                u.email AS 'correo',
                                u.identification AS 'identificacion',
                                mt.name AS 'tipo'
                            FROM movements AS m
                            JOIN movement_types AS mt 
                                ON m.movementType_id = mt.movementType_id
                            JOIN users AS u
                                ON m.user_application = u.user_id
                            WHERE (m.movementType_id = '1' || m.movementType_id = '2')
                                AND (
                                    m.movement_id LIKE ? ||
                                    u.name LIKE ? ||
                                    u.lastname LIKE ? ||
                                    u.identification LIKE ? );`;

        const dataSql = [filterSql, filterSql, filterSql, filterSql];

        //Ejecutar la consulta
        const [result] = await pool.query(movementsSql, dataSql);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                message: "No se encontraron movimientos que cumplan con los criterios de busqueda",
                data: []
            });
        }

        return res.status(200).json({
            message: "Movimientos listados",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const getMovementDetailsById = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `SELECT * FROM movement_details WHERE movement_id = ?;`;
        const data = [id];
        const [result] = await pool.query(sql, data);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                message: "No se encontraron detalles",
                data: []
            });
        }

        return res.status(200).json({
            message: "Detalles listados",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
}

export const registerIncomingMovement = async (req, res) => {
    try {
        //Información desde el cuerpo de la petición
        const { user_application, details } = req.body
        const user = req.user;

        const isAdmin = user.role_id === 1 || user.role_id === 2;

        if (!isAdmin) {
            return res.status(403).json({
                message: 'Permiso denegado: Solo los usuarios administrativos pueden realizar este tipo de registro'
            });
        }

        if (!details) {
            return res.status(400).json({
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }

        //Iniciar un transacción en Sql
        await pool.query("START TRANSACTION");

        //Crear un nuevo movimiento de ingreso
        const sqlIncomingMovement = `INSERT INTO movements (movementType_id, user_manager, user_application)
                                        VALUES (1, ?, ?);`;
        const dataIncomingMovement = [user.user_id, (user_application ? user_application : user.user_id)];

        const [result] = await pool.query(sqlIncomingMovement, dataIncomingMovement);

        //Obtener ID del movimiento recién creado
        const movementID = result.insertId;

        let detallesInfo = [];

        for (const detail of details) {
            const { element_id, quantity, remarks, expiration, warehouseLocation_id } = detail;

            if (!element_id || !quantity || !warehouseLocation_id) {
                await pool.query("ROLLBACK");
                return res.status(400).json({
                    error: true,
                    message: 'Todos los campos son requeridos'
                });
            }

            const sqlElementType = `SELECT elementType_id FROM elements WHERE element_id = ?;`;
            const dataElementType = [element_id];
            const [resultElementType] = await pool.query(sqlElementType, dataElementType);

            if (resultElementType.length === 0) {
                await pool.query("ROLLBACK");
                return res.status(404).json({
                    error: true,
                    message: 'El elemento no se encuentra'
                });
            }

            const elementType = resultElementType[0].elementType_id;


            if (elementType === 1 && !expiration) {
                await pool.query("ROLLBACK");
                return res.status(400).json({
                    error: true,
                    message: 'Para elementos consumibles debe colocar una fecha de vencimiento'
                });
            }

            const repetitions = elementType === 1 ? 1 : quantity;
            const expirationTrue = !expiration ? null : expiration;
            const remarksTrue = !remarks ? null : remarks;

            for (let i = 0; i < repetitions; i++) {
                const serialBatch = element_id + '-' + Date.now();

                const sqlInsertBatch = `INSERT INTO batches( element_id, batch_serial, expiration, quantity)
                                        VALUES (?, ?, ?, ?);`;
                const dataInsertBatch = [element_id, serialBatch, (elementType === 1 ? expirationTrue : null), (elementType === 1 ? quantity : 1)];
                const [resultInsertBatch] = await pool.query(sqlInsertBatch, dataInsertBatch);
                const batchId = resultInsertBatch.insertId;

                /* if(!inserBatchInfo){
                    await pool.query("ROLLBACK");
                    return res.status(400).json({
                        error: true,
                        message: 'Para elementos consumibles debe colocar una fecha de vencimiento'
                    });
                } */

                const sqlBatchLocation = `INSERT INTO batch_location_infos (batch_id, warehouseLocation_id, quantity)
                                          VALUES (?, ?, ?);`;
                const dataBatchLocation = [batchId, warehouseLocation_id, (elementType === 1 ? quantity : 1)];
                const [resultBatchLocation] = await pool.query(sqlBatchLocation, dataBatchLocation);

                const sqlInsertMovementDetail = `INSERT INTO movement_details(movement_id, element_id, batch_id, quantity, remarks)
                                                 VALUES (?, ?, ?, ?, ?);`;
                const dataInsertMovementDetail = [movementID, element_id, batchId, (elementType === 1 ? quantity : 1), remarksTrue];

                const [resultInsertMovementDetail] = await pool.query(sqlInsertMovementDetail, dataInsertMovementDetail);

                detallesInfo.push(resultInsertMovementDetail);

                const sqlStockElement = `SELECT stock FROM elements WHERE element_id = ?;`;
                const dataStockElement = [element_id];
                const [resultStockElement] = await pool.query(sqlStockElement, dataStockElement);

                const lastStock = resultStockElement[0].stock;
                const newStock = lastStock + (elementType === 1 ? quantity : 1)

                const sqlAddStockElement = `UPDATE elements SET stock = ? WHERE element_id = ?;`;
                const dataAddStockElement = [newStock, element_id];

                const [resultAddStockElement] = await pool.query(sqlAddStockElement, dataAddStockElement);
            }
        }

        await pool.query("COMMIT");

        return res.status(200).json({
            message: "Registro de Ingreso Exitoso",
            data: result,
            detalles: detallesInfo
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({
            message: error
        });
    }
}

export const registerOutgoingMovement = async (req, res) => {
    try {
        const { user_application, details } = req.body
        const user = req.user;

        const isAdmin = user.role_id === 1 || user.role_id === 2;

        if (!isAdmin) {
            return res.status(403).json({
                message: 'Permiso denegado: Solo los usuarios administrativos pueden realizar este tipo de registro'
            });
        }

        if (!details) {
            return res.status(400).json({
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }

        //Iniciar un transacción en Sql
        await pool.query("START TRANSACTION");

        //Crear un nuevo movimiento de salida
        const sqlOutgoingMovement = `INSERT INTO movements (movementType_id, user_manager, user_application)
                                        VALUES (2, ?, ?);`;
        const dataOutgoingMovement = [user.user_id, (user_application ? user_application : user.user_id)];

        const [result] = await pool.query(sqlOutgoingMovement, dataOutgoingMovement);

        //Obtener ID del movimiento recién creado
        const movementID = result.insertId;

        let detallesInfo = [];

        for (const detail of details) {
            const { element_id, quantity: detailquantity, remarks, warehouseLocation_id } = detail;

            if (!element_id || !detailquantity || !warehouseLocation_id) {
                await pool.query("ROLLBACK");
                return res.status(400).json({
                    error: true,
                    message: 'Todos los campos son requeridos'
                });
            }

            const remarksTrue = !remarks ? null : remarks;

            //Validar que el Stock sea suficiente
            const sqlStockElement = `SELECT stock, name FROM elements WHERE element_id = ?;`;
            const dataStockElement = [element_id];
            const [resultStockElement] = await pool.query(sqlStockElement, dataStockElement);

            const element = resultStockElement[0];

            if (element.stock < detailquantity) {
                await pool.query('ROLLBACK')
                return res.status(409).json({
                    error: true,
                    message: `No hay suficientes ${element.name}s en stock`
                })
            }

            //Validar cuantos lotes existen en la ubicación solicitada y de cual se puede sacar o sacar de varios
            const sqlBatchStock = `SELECT b.batch_id, b.quantity
                                    FROM batches AS b
                                    JOIN batch_location_infos AS bli ON b.batch_id = bli.batch_id
                                    WHERE b.element_id = ?
                                        AND b.quantity > 0
                                        AND b.status = '1'
                                        AND bli.quantity > 0
                                        AND bli.warehouseLocation_id = ?
                                    ORDER BY b.created_at ASC;`;
            const dataBatchStock = [element_id, warehouseLocation_id];
            const [resultBatchStock] = await pool.query(sqlBatchStock, dataBatchStock);

            let stockInLocation = 0;

            for (const st of resultBatchStock) {
                const { quantity: stQuantity } = st;
                stockInLocation += stQuantity;
            }

            if (stockInLocation < detailquantity) {
                await pool.query('ROLLBACK')
                return res.status(409).json({
                    error: true,
                    message: `No hay suficientes ${element.name}s en stock en la ubicacion especificada`
                })
            }

            let remainingQuantity = detailquantity;
            let quantityused2 = 0;

            for (const batch of resultBatchStock) {
                const { batch_id, quantity: bachtQuantity } = batch

                if (remainingQuantity <= 0) {
                    break;
                }

                let quantityToUse = Math.min(remainingQuantity, bachtQuantity);

                const sqlBatchLocations = `SELECT * FROM batch_location_infos WHERE batch_id = ? AND warehouseLocation_id = ?;`;
                const dataBatchLocations = [batch_id, warehouseLocation_id];
                const [resultBatchLocations] = await pool.query(sqlBatchLocations, dataBatchLocations);


                let quantityUsed = 0;

                //Necesito empezar a sustraer cantidades del resultBatchLocations
                for (const location of resultBatchLocations) {
                    const { batchLocationInfo_id, quantity: locationQuantity } = location;

                    if (quantityToUse <= 0) {
                        break;
                    }

                    // Determinar cuánto tomar de esta ubicación específica
                    const quantityFromLocation = Math.min(quantityToUse, locationQuantity);

                    // Actualizar la cantidad en la ubicación específica
                    const updatedQuantity = locationQuantity - quantityFromLocation;
                    const sqlUpdateLocation = `UPDATE batch_location_infos SET quantity = ? WHERE batchLocationInfo_id = ?;`;
                    const dataUpdateLocation = [updatedQuantity, batchLocationInfo_id];
                    await pool.query(sqlUpdateLocation, dataUpdateLocation);

                    // Restar la cantidad usada del total restante
                    quantityToUse -= quantityFromLocation;
                    remainingQuantity -= quantityFromLocation;
                    quantityUsed += quantityFromLocation;
                    quantityused2 += quantityFromLocation;
                }

                // Actualizar el stock del lote en la tabla `batches`
                const updatedBatchQuantity = bachtQuantity - quantityUsed;
                const sqlUpdateBatchQuantity = `UPDATE batches SET quantity = ? WHERE batch_id = ?;`;
                const dataUpdateBatchQuantity = [updatedBatchQuantity, batch_id];
                await pool.query(sqlUpdateBatchQuantity, dataUpdateBatchQuantity);

                // Registrar como nuevo detalle movimiento
                const sqlInsertMovementDetail = `INSERT INTO movement_details(movement_id, element_id, batch_id, quantity, remarks)
                                                 VALUES (?, ?, ?, ?, ?);`;
                const dataInsertMovementDetail = [movementID, element_id, batch_id, quantityUsed, remarksTrue];

                const [resultInsertMovementDetail] = await pool.query(sqlInsertMovementDetail, dataInsertMovementDetail);

                detallesInfo.push(resultInsertMovementDetail);

                //Actualizar Stock elemento

                const lastStock = element.stock;
                const newStock = lastStock - quantityused2;

                const sqlAddStockElement = `UPDATE elements SET stock = ? WHERE element_id = ?;`;
                const dataAddStockElement = [newStock, element_id];

                const [resultAddStockElement] = await pool.query(sqlAddStockElement, dataAddStockElement);

            }
        }

        await pool.query("COMMIT");

        return res.status(200).json({
            message: "Registro de salida Exitoso",
            data: result,
            detalles: detallesInfo
        });
    } catch (error) {
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({
            message: error.message
        });
    }
}

export const registerLoganMovement = async (req, res) => {
    try {
        const { estimated_return, details, user_application } = req.body
        const user = req.user;

        if (!details || !estimated_return) {
            return res.status(400).json({
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }

        //Iniciar un transacción en Sql
        await pool.query("START TRANSACTION");

        //Crear un nuevo movimiento de salida
        const sqlLoanMovement = `INSERT INTO movements (movementType_id, user_application, movementLoan_status, estimated_return)
                                        VALUES (?, ?, ?, ?);`;
        const dataLoanMovement = [4, (user_application ? user_application : user.user_id), 1, estimated_return];

        const [result] = await pool.query(sqlLoanMovement, dataLoanMovement);

        //Obtener ID del movimiento recién creado
        const movementID = result.insertId;

        let detallesInfo = [];

        for (const detail of details) {
            const { element_id, quantity, remarks } = detail;

            if (!element_id || !quantity) {
                await pool.query("ROLLBACK");
                return res.status(400).json({
                    error: true,
                    message: 'Todos los campos son requeridos'
                });
            }

            const remarksTrue = !remarks ? null : remarks;

            //Validar que la cantidad a reservar este disponible

            //Traer el Stock
            const sqlStockElement = `SELECT stock, name FROM elements WHERE element_id = ?;`;
            const dataStockElement = [element_id];
            const [resultStockElement] = await pool.query(sqlStockElement, dataStockElement);

            const element = resultStockElement[0];

            if (element.stock < quantity) {
                await pool.query('ROLLBACK')
                return res.status(409).json({
                    error: true,
                    message: `No hay suficientes ${element.name}s disponibles, hay ${element.stock} disponibles en stock`
                })
            }

            //Validar cuantos lotes existen y de cual se puede sacar o sacar de varios
            const sqlBatchStock = `SELECT batch_id, quantity
                                    FROM batches
                                    WHERE element_id = ? 
                                        AND quantity > 0
                                        AND status = '1'
                                    ORDER BY created_at ASC;`;

            const [resultBatchStock] = await pool.query(sqlBatchStock, dataStockElement);

            let remainingQuantity = quantity;
            let quantityused2 = 0;

            for (const batch of resultBatchStock) {
                const { batch_id, quantity: bachtQuantity } = batch

                if (remainingQuantity <= 0) {
                    break;
                }

                let quantityToUse = Math.min(remainingQuantity, bachtQuantity);

                const sqlBatchLocations = `SELECT * FROM batch_location_infos WHERE batch_id = ? AND quantity > 0;`;
                const dataBatchLocations = [batch_id];
                const [resultBatchLocations] = await pool.query(sqlBatchLocations, dataBatchLocations);

                let quantityUsed = 0;

                //Necesito empezar a sustraer cantidades del resultBatchLocations
                for (const location of resultBatchLocations) {
                    const { batchLocationInfo_id, quantity: locationQuantity } = location;

                    if (quantityToUse <= 0) {
                        break;
                    }

                    // Determinar cuánto tomar de esta ubicación específica
                    const quantityFromLocation = Math.min(quantityToUse, locationQuantity);

                    // Actualizar la cantidad en la ubicación específica
                    const updatedQuantity = locationQuantity - quantityFromLocation;
                    const sqlUpdateLocation = `UPDATE batch_location_infos SET quantity = ? WHERE batchLocationInfo_id = ?;`;
                    const dataUpdateLocation = [updatedQuantity, batchLocationInfo_id];
                    await pool.query(sqlUpdateLocation, dataUpdateLocation);

                    // Restar la cantidad usada del total restante
                    quantityToUse -= quantityFromLocation;
                    remainingQuantity -= quantityFromLocation;
                    quantityUsed += quantityFromLocation;
                    quantityused2 += quantityFromLocation;
                }

                // Actualizar el stock del lote en la tabla `batches`
                const updatedBatchQuantity = bachtQuantity - quantityUsed;
                const sqlUpdateBatchQuantity = `UPDATE batches SET quantity = ? WHERE batch_id = ?;`;
                const dataUpdateBatchQuantity = [updatedBatchQuantity, batch_id];
                await pool.query(sqlUpdateBatchQuantity, dataUpdateBatchQuantity);

                // Registrar como nuevo detalle movimiento
                const sqlInsertMovementDetail = `INSERT INTO movement_details(
                                                    movement_id, element_id, batch_id, quantity, remarks, loanStatus_id)
                                                 VALUES (?, ?, ?, ?, ?, ?);`;
                const dataInsertMovementDetail = [movementID, element_id, batch_id, quantityUsed, remarksTrue, 1];

                const [resultInsertMovementDetail] = await pool.query(sqlInsertMovementDetail, dataInsertMovementDetail);

                detallesInfo.push(resultInsertMovementDetail);

                //Actualizar Stock elemento

                const lastStock = element.stock;
                const newStock = lastStock - quantityused2;

                const sqlAddStockElement = `UPDATE elements SET stock = ? WHERE element_id = ?;`;
                const dataAddStockElement = [newStock, element_id];

                const [resultAddStockElement] = await pool.query(sqlAddStockElement, dataAddStockElement);

            }
        }

        //Confirmar la transacción
        await pool.query("COMMIT");
        return res.status(200).json({
            message: "Registro de Préstamo Exitoso",
            data: result,
            detalles: detallesInfo
        });
    } catch (error) {
        //Devolver todos los cambios
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({
            message: error
        });
    }
}

export const registerLoganMovementInWarehouse = async (req, res) => {
    try {
        const { estimated_return, details, user_application } = req.body
        const user = req.user;

        if (user.user_id == 3) {
            return res.status(401).json({
                error: true,
                message: 'No tiene permisos suficientes'
            })
        }

        if (!details || !estimated_return) {
            return res.status(400).json({
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }

        //Iniciar un transacción en Sql
        await pool.query("START TRANSACTION");

        //Crear un nuevo movimiento de salida
        const sqlLoanMovement = `INSERT INTO movements (movementType_id, user_manager, user_application, movementLoan_status, estimated_return, user_receiving)
                                        VALUES (?, ?, ?, ?, ?, ?);`;
        const dataLoanMovement = [4, user.user_id, (user_application ? user_application : user.user_id), 5, estimated_return, user_application];

        const [result] = await pool.query(sqlLoanMovement, dataLoanMovement);

        //Obtener ID del movimiento recién creado
        const movementID = result.insertId;

        let detallesInfo = [];

        for (const detail of details) {
            const { element_id, quantity, remarks } = detail;

            if (!element_id || !quantity) {
                await pool.query("ROLLBACK");
                return res.status(400).json({
                    error: true,
                    message: 'Todos los campos son requeridos'
                });
            }

            const remarksTrue = !remarks ? null : remarks;

            //Validar que la cantidad a reservar este disponible

            //Traer el Stock
            const sqlStockElement = `SELECT stock, name FROM elements WHERE element_id = ?;`;
            const dataStockElement = [element_id];
            const [resultStockElement] = await pool.query(sqlStockElement, dataStockElement);

            const element = resultStockElement[0];

            if (element.stock < quantity) {
                await pool.query('ROLLBACK')
                return res.status(409).json({
                    error: true,
                    message: `No hay suficientes ${element.name}s disponibles, hay ${element.stock} disponibles en stock`
                })
            }

            //Validar cuantos lotes existen y de cual se puede sacar o sacar de varios
            const sqlBatchStock = `SELECT batch_id, quantity
                                    FROM batches
                                    WHERE element_id = ? 
                                        AND quantity > 0
                                        AND status = '1'
                                    ORDER BY created_at ASC;`;

            const [resultBatchStock] = await pool.query(sqlBatchStock, dataStockElement);

            let remainingQuantity = quantity;
            let quantityused2 = 0;

            for (const batch of resultBatchStock) {
                const { batch_id, quantity: bachtQuantity } = batch

                if (remainingQuantity <= 0) {
                    break;
                }

                let quantityToUse = Math.min(remainingQuantity, bachtQuantity);

                const sqlBatchLocations = `SELECT * FROM batch_location_infos WHERE batch_id = ? AND quantity > 0;`;
                const dataBatchLocations = [batch_id];
                const [resultBatchLocations] = await pool.query(sqlBatchLocations, dataBatchLocations);

                let quantityUsed = 0;

                //Necesito empezar a sustraer cantidades del resultBatchLocations
                for (const location of resultBatchLocations) {
                    const { batchLocationInfo_id, quantity: locationQuantity } = location;

                    if (quantityToUse <= 0) {
                        break;
                    }

                    // Determinar cuánto tomar de esta ubicación específica
                    const quantityFromLocation = Math.min(quantityToUse, locationQuantity);

                    // Actualizar la cantidad en la ubicación específica
                    const updatedQuantity = locationQuantity - quantityFromLocation;
                    const sqlUpdateLocation = `UPDATE batch_location_infos SET quantity = ? WHERE batchLocationInfo_id = ?;`;
                    const dataUpdateLocation = [updatedQuantity, batchLocationInfo_id];
                    await pool.query(sqlUpdateLocation, dataUpdateLocation);

                    // Restar la cantidad usada del total restante
                    quantityToUse -= quantityFromLocation;
                    remainingQuantity -= quantityFromLocation;
                    quantityUsed += quantityFromLocation;
                    quantityused2 += quantityFromLocation;
                }

                // Actualizar el stock del lote en la tabla `batches`
                const updatedBatchQuantity = bachtQuantity - quantityUsed;
                const sqlUpdateBatchQuantity = `UPDATE batches SET quantity = ? WHERE batch_id = ?;`;
                const dataUpdateBatchQuantity = [updatedBatchQuantity, batch_id];
                await pool.query(sqlUpdateBatchQuantity, dataUpdateBatchQuantity);

                // Registrar como nuevo detalle movimiento
                const sqlInsertMovementDetail = `INSERT INTO movement_details(
                                                    movement_id, element_id, batch_id, quantity, remarks, loanStatus_id, user_receiving)
                                                 VALUES (?, ?, ?, ?, ?, ?, ?);`;
                const dataInsertMovementDetail = [movementID, element_id, batch_id, quantityUsed, remarksTrue, 5, user_application];

                const [resultInsertMovementDetail] = await pool.query(sqlInsertMovementDetail, dataInsertMovementDetail);

                detallesInfo.push(resultInsertMovementDetail);

                //Actualizar Stock elemento

                const lastStock = element.stock;
                const newStock = lastStock - quantityused2;

                const sqlAddStockElement = `UPDATE elements SET stock = ? WHERE element_id = ?;`;
                const dataAddStockElement = [newStock, element_id];

                const [resultAddStockElement] = await pool.query(sqlAddStockElement, dataAddStockElement);

            }
        }

        //Confirmar la transacción
        await pool.query("COMMIT");

        return res.status(200).json({
            message: "Registro de Préstamo Exitoso",
            data: result,
            detalles: detallesInfo
        });
    } catch (error) {
        //Devolver todos los cambios
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({
            message: error
        });
    }
}

export const updateLoganStatus = async (req, res) => {
    try {
        const { details, user_returning } = req.body;
        const { id } = req.params;
        const user = req.user;

        const sqlMovement = `SELECT * FROM movements WHERE movement_id = ?;`
        const dataMovement = [id];
        const [resultMovement] = await pool.query(sqlMovement, dataMovement);

        if (resultMovement.length <= 0) {
            return res.status(400).json({
                error: true,
                message: 'El movimiento no existe'
            })
        }

        const statusMovement = resultMovement[0].movementLoan_status;

        await pool.query('START TRANSACTION')

        if (statusMovement == 1) {

            if (user.role_id == 1 || user.role_id == 2) {
                //Revisar detalles por si se quiere cancelar en la ventana reservas


                //Actualizar a en revision

                /* const sqlUpdateReview = `SELECT * FROM movement_details WHERE movement_id = ?;`;
                const dataUpdateReview = [id];
                const [resultUpdateReview] = await pool.query(sqlUpdateReview, dataUpdateReview); */
                //Actualizar el estado de préstamo de los detalles del movimiento a en revisión
                const sqlUpdateMovementDetails = `UPDATE movement_details 
                                                        SET loanStatus_id = ?, updated_at = CURRENT_TIMESTAMP 
                                                    WHERE movement_id = ? AND loanStatus_id = ?;`;
                const dataUpdateMovementDetails = [2, id, 1];
                const [resultUpdateMovementDetails] = await pool.query(sqlUpdateMovementDetails, dataUpdateMovementDetails);

                //Actualizar el estado de préstamo de movimiento general a en revición
                const sqlUpdateMovementStatus = `UPDATE movements 
                                                        SET movementLoan_status = ?, user_manager = ?, updated_at = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
                const dataUpdateMovementStatus = [2, user.user_id, id, 1];
                const [resultUpdateMovementStatus] = await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
            }

            if (user.role_id == 3) {
                //puede cancelar
                //Actualizar el estado de préstamo de los detalles del movimiento a cancelado
                const sqlUpdateMovementDetails = `UPDATE movement_details 
                                                        SET loanStatus_id = ?, updated_at = CURRENT_TIMESTAMP 
                                                    WHERE movement_id = ? AND loanStatus_id = ?;`;
                const dataUpdateMovementDetails = [7, id, 1];
                const [resultUpdateMovementDetails] = await pool.query(sqlUpdateMovementDetails, dataUpdateMovementDetails);

                //Devolver al Stock los elementos que se reservaron y salieron del stock
                //Traer todos los detalles del movimiento
                const sqlMovementDetails = `SELECT * FROM movement_details WHERE movement_id = ?;`;
                const dataMovementDetails = [id];
                const [resultMovementDetails] = await pool.query(sqlMovementDetails, dataMovementDetails);

                for (const movementDetail of resultMovementDetails) {

                    const { element_id, quantity, batch_id } = movementDetail;

                    //Por cada detalle del movimiento devolver el stock reservado a su ubicacion
                    const sqlReturnStockBatchLocation = `UPDATE batch_location_infos SET quantity = ?
                                                            WHERE batch_id = ?;`
                    const dataReturnStockBatchLocation = [quantity, batch_id];
                    const [resultRetutnStockBatchLocation] = await pool.query(sqlReturnStockBatchLocation, dataReturnStockBatchLocation);

                    //Por cada detalle de movimiento devolver el stock reservado al lote
                    const sqlReturnStockBatch = `UPDATE batches SET quantity = ?
                                                            WHERE batch_id = ?;`
                    const dataReturnStockBatch = [quantity, batch_id];
                    const [resultRetutnStockBatch] = await pool.query(sqlReturnStockBatch, dataReturnStockBatch);

                    //Por cada detalle de movimiento devolver el stock reservado al elemento
                    //Primero traemos el stock completo del elemento
                    const sqlStock = `SELECT stock FROM elements WHERE element_id = ?;`;
                    const dataStock = [element_id];
                    const [resultStock] = await pool.query(sqlStock, dataStock);

                    const stock = resultStock[0].stock;

                    const newStock = stock + quantity;

                    const sqlReturnStockElement = `UPDATE elements SET stock = ?
                                                            WHERE element_id = ?;`
                    const dataReturnStockElement = [newStock, element_id];
                    const [resultRetutnStockElement] = await pool.query(sqlReturnStockElement, dataReturnStockElement);
                }

                //Actualizar el estado de préstamo de movimiento general a cancelado
                const sqlUpdateMovementStatus = `UPDATE movements 
                                                        SET movementLoan_status = ?, user_application = ?, updated_at = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
                const dataUpdateMovementStatus = [7, user.user_id, id, 1];
                const [resultUpdateMovementStatus] = await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
            }
        }

        if (statusMovement == 2) {
            //Actualizar a aceptado o rechazar, también se puede cancelar
            if (user.role_id == 1 || user.role_id == 2) {
                if (!details || details.length === 0) {
                    await pool.query('ROLLBACK');
                    return res.status(400).json({
                        error: true,
                        message: "Hacen faltan datos"
                    })
                }

                let accepted = 0;
                let comment = '';

                for (const detail of details) {
                    const { loanStatus_id, movementDetail_id, remarks } = detail;

                    if (!loanStatus_id || !movementDetail_id) {
                        await pool.query('ROLLBACK');
                        return res.status(400).json({
                            error: true,
                            message: 'Los datos no se han enviado correctamente, intentelo d enuevo por favor'
                        })
                    }

                    if (loanStatus_id != 3 && loanStatus_id != 4 && loanStatus_id != 7) {
                        await pool.query('ROLLBACK');
                        return res.status(400).json({
                            error: true,
                            message: 'Acepte o rechaze el pedido por favor, el codigo enviado no correpsonde'
                        })
                    }

                    if (loanStatus_id == 3) {
                        accepted++;
                        comment = 'Aceptado';
                    }

                    if (loanStatus_id == 4) {
                        const sqlMovementDetail = `SELECT * FROM movement_details WHERE movementDetail_id = ?;`;
                        const dataMovementDetail = [movementDetail_id];
                        const [result] = await pool.query(sqlMovementDetail, dataMovementDetail);

                        const movementDetail = result[0];

                        // devolver el stock reservado a su ubicacion
                        const sqlReturnStockBatchLocation = `UPDATE batch_location_infos SET quantity = ?
                                                                WHERE batch_id = ?;`
                        const dataReturnStockBatchLocation = [movementDetail.quantity, movementDetail.batch_id];
                        const [resultRetutnStockBatchLocation] = await pool.query(sqlReturnStockBatchLocation, dataReturnStockBatchLocation);

                        //Por cada detalle de movimiento devolver el stock reservado al lote
                        const sqlReturnStockBatch = `UPDATE batches SET quantity = ?
                    WHERE batch_id = ?;`
                        const dataReturnStockBatch = [movementDetail.quantity, movementDetail.batch_id];
                        const [resultRetutnStockBatch] = await pool.query(sqlReturnStockBatch, dataReturnStockBatch);

                        //Por cada detalle de movimiento devolver el stock reservado al elemento
                        //Primero traemos el stock completo del elemento
                        const sqlStock = `SELECT stock FROM elements WHERE element_id = ?;`;
                        const dataStock = [movementDetail.element_id];
                        const [resultStock] = await pool.query(sqlStock, dataStock);

                        const stock = resultStock[0].stock;

                        const newStock = stock + movementDetail.quantity;

                        const sqlReturnStockElement = `UPDATE elements SET stock = ?
                                                            WHERE element_id = ?;`
                        const dataReturnStockElement = [newStock, movementDetail.element_id];
                        const [resultRetutnStockElement] = await pool.query(sqlReturnStockElement, dataReturnStockElement);

                        comment = 'Rechazado';
                    }

                    //Actualizar el estado del detalle
                    const sqlUpdateStatus = `UPDATE movement_details SET loanStatus_id = ?, remarks = ? WHERE movementDetail_id = ?;`;
                    const dataUpdateStatus = [loanStatus_id, (remarks ? remarks : comment), movementDetail_id];
                    const [resultUpdateStatus] = await pool.query(sqlUpdateStatus, dataUpdateStatus);
                }

                const status = accepted > 0 ? 3 : 4;

                //Actualizar el estado de préstamo de movimiento general a cancelado
                const sqlUpdateMovementStatus = `UPDATE movements 
                                                        SET movementLoan_status = ?, user_manager = ?, updated_at = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
                const dataUpdateMovementStatus = [status, user.user_id, id, 2];
                const [resultUpdateMovementStatus] = await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
            }

            if (user.role_id == 3) {
                //puede cancelar
                //Actualizar el estado de préstamo de los detalles del movimiento a cancelado
                const sqlUpdateMovementDetails = `UPDATE movement_details 
                                                        SET loanStatus_id = ?, remarks= ?, updated_at = CURRENT_TIMESTAMP 
                                                    WHERE movement_id = ? AND loanStatus_id = ?;`;
                const dataUpdateMovementDetails = [7, "Cancelado", id, 2];
                const [resultUpdateMovementDetails] = await pool.query(sqlUpdateMovementDetails, dataUpdateMovementDetails);

                //Devolver al Stock los elementos que se reservaron y salieron del stock
                //Traer todos los detalles del movimiento
                const sqlMovementDetails = `SELECT * FROM movement_details WHERE movement_id = ?;`;
                const dataMovementDetails = [id];
                const [resultMovementDetails] = await pool.query(sqlMovementDetails, dataMovementDetails);

                for (const movementDetail of resultMovementDetails) {

                    const { element_id, quantity, batch_id } = movementDetail;

                    //Por cada detalle del movimiento devolver el stock reservado a su ubicacion
                    const sqlReturnStockBatchLocation = `UPDATE batch_location_infos SET quantity = ?
                                                            WHERE batch_id = ?;`
                    const dataReturnStockBatchLocation = [quantity, batch_id];
                    const [resultRetutnStockBatchLocation] = await pool.query(sqlReturnStockBatchLocation, dataReturnStockBatchLocation);

                    //Por cada detalle de movimiento devolver el stock reservado al lote
                    const sqlReturnStockBatch = `UPDATE batches SET quantity = ?
                                                            WHERE batch_id = ?;`
                    const dataReturnStockBatch = [quantity, batch_id];
                    const [resultRetutnStockBatch] = await pool.query(sqlReturnStockBatch, dataReturnStockBatch);

                    //Por cada detalle de movimiento devolver el stock reservado al elemento
                    //Primero traemos el stock completo del elemento
                    const sqlStock = `SELECT stock FROM elements WHERE element_id = ?;`;
                    const dataStock = [element_id];
                    const [resultStock] = await pool.query(sqlStock, dataStock);

                    const stock = resultStock[0].stock;

                    const newStock = stock + quantity;

                    const sqlReturnStockElement = `UPDATE elements SET stock = ?
                                                            WHERE element_id = ?;`
                    const dataReturnStockElement = [newStock, element_id];
                    const [resultRetutnStockElement] = await pool.query(sqlReturnStockElement, dataReturnStockElement);
                }

                //Actualizar el estado de préstamo de movimiento general a cancelado
                const sqlUpdateMovementStatus = `UPDATE movements 
                                                        SET movementLoan_status = ?, user_application = ?, updated_at = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
                const dataUpdateMovementStatus = [7, user.user_id, id, 2];
                const [resultUpdateMovementStatus] = await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
            }
        }

        if (statusMovement == 3) {

            //Actualizar a On loan
            if (user.role_id == 1 || user.role_id == 2) {
                if (!user_returning) {
                    await pool.query('ROLLBACK');
                    return res.status(400).json({
                        error: true,
                        message: "Hacen faltan datos"
                    })
                }
                for (const detail of details) {
                    const { movementDetail_id, remarks } = detail;
                    //Actualizar los detalles
                    const sqlDetails = `UPDATE 
                                            movement_details 
                                        SET 
                                            loanStatus_id = ?,
                                            remarks = ?,
                                            user_receiving = ?
                                        WHERE 
                                            movement_id = ? 
                                            AND loanStatus_id =?
                                            AND movementDetail_id = ?;`;
                    const dataDetails = [5, (remarks ? remarks : ''), user_returning, id, 3, movementDetail_id];
                    const [resultDetails] = await pool.query(sqlDetails, dataDetails);
                }

                //Actualizar estado del movimiento
                const sqlUpdateMovementStatus = `UPDATE movements 
                                                        SET movementLoan_status = ?, user_manager = ?, user_receiving = ?, updated_at = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
                const dataUpdateMovementStatus = [5, user.user_id, user_returning, id, 3];
                const [resultUpdateMovementStatus] = await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
            }

            //Cancelar
            if (user.role_id == 3) {
                //puede cancelar
                //Actualizar el estado de préstamo de los detalles del movimiento a cancelado
                const sqlUpdateMovementDetails = `UPDATE movement_details 
                                                        SET loanStatus_id = ?, remarks= ?, updated_at = CURRENT_TIMESTAMP 
                                                    WHERE movement_id = ? AND loanStatus_id = ?;`;
                const dataUpdateMovementDetails = [7, "Cancelado", id, 3];
                const [resultUpdateMovementDetails] = await pool.query(sqlUpdateMovementDetails, dataUpdateMovementDetails);

                //Devolver al Stock los elementos que se reservaron y salieron del stock
                //Traer todos los detalles del movimiento
                const sqlMovementDetails = `SELECT * FROM movement_details WHERE movement_id = ?;`;
                const dataMovementDetails = [id];
                const [resultMovementDetails] = await pool.query(sqlMovementDetails, dataMovementDetails);

                for (const movementDetail of resultMovementDetails) {

                    const { element_id, quantity, batch_id } = movementDetail;

                    //Por cada detalle del movimiento devolver el stock reservado a su ubicacion
                    const sqlReturnStockBatchLocation = `UPDATE batch_location_infos SET quantity = ?
                                                            WHERE batch_id = ?;`
                    const dataReturnStockBatchLocation = [quantity, batch_id];
                    const [resultRetutnStockBatchLocation] = await pool.query(sqlReturnStockBatchLocation, dataReturnStockBatchLocation);

                    //Por cada detalle de movimiento devolver el stock reservado al lote
                    const sqlReturnStockBatch = `UPDATE batches SET quantity = ?
                                                            WHERE batch_id = ?;`
                    const dataReturnStockBatch = [quantity, batch_id];
                    const [resultRetutnStockBatch] = await pool.query(sqlReturnStockBatch, dataReturnStockBatch);

                    //Por cada detalle de movimiento devolver el stock reservado al elemento
                    //Primero traemos el stock completo del elemento
                    const sqlStock = `SELECT stock FROM elements WHERE element_id = ?;`;
                    const dataStock = [element_id];
                    const [resultStock] = await pool.query(sqlStock, dataStock);

                    const stock = resultStock[0].stock;

                    const newStock = stock + quantity;

                    const sqlReturnStockElement = `UPDATE elements SET stock = ?
                                                            WHERE element_id = ?;`
                    const dataReturnStockElement = [newStock, element_id];
                    const [resultRetutnStockElement] = await pool.query(sqlReturnStockElement, dataReturnStockElement);
                }

                //Actualizar el estado de préstamo de movimiento general a cancelado
                const sqlUpdateMovementStatus = `UPDATE movements 
                                                        SET movementLoan_status = ?, user_application = ?, updated_at = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
                const dataUpdateMovementStatus = [7, user.user_id, id, 3];
                const [resultUpdateMovementStatus] = await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
            }
        }

        if (statusMovement == 4) {
            //No se hace nada, el movimiento ya fue rechazado, entonces si quiere debe realizar otro movimiento de solicitud
            await pool.query('ROLLBACK');
            return res.status(400).json({
                error: true,
                message: "Este movimiento ya fue rechazado, realice un nuevo movimiento por favor"
            })
        }

        if (statusMovement == 5) {

            if (user.role_id != 1 && user.role_id != 2) {
                await pool.query('ROLLBACK');
                return res.status(401).json({
                    error: true,
                    message: 'No puede realizar está acción'
                })
            }

            if (!details || details.length === 0 || !user_returning) {
                await pool.query('ROLLBACK');
                return res.status(400).json({
                    error: true,
                    message: "Hacen faltan datos"
                })
            }

            let noCompleted = 0;
            let comment = '';

            //Este solo servirá para ir revisando cada vez que se entrega algo
            for (const detail of details) {

                const allowedStatus = [4, 5, 6, 7]

                const { loanStatus_id, movementDetail_id, remarks } = detail;

                if (!loanStatus_id || !movementDetail_id) {
                    await pool.query('ROLLBACK');
                    return res.status(400).json({
                        error: true,
                        message: 'Los datos no se han enviado correctamente, intentelo de nuevo por favor'
                    })
                }

                if (!allowedStatus.includes(loanStatus_id)) {
                    await pool.query('ROLLBACK');
                    return res.status(400).json({
                        error: true,
                        message: 'Solo puede aceptar Préstamos devueltos intentelo nuevamente por favor, intentelo nuevamente por favor'
                    })
                }

                if (loanStatus_id == 5) {
                    noCompleted++;
                }

                if (loanStatus_id == 6) {
                    const sqlMovementDetail = `SELECT * FROM movement_details WHERE movementDetail_id = ?;`;
                    const dataMovementDetail = [movementDetail_id];
                    const [result] = await pool.query(sqlMovementDetail, dataMovementDetail);

                    const movementDetail = result[0];

                    if (movementDetail.loanStatus_id == 5) {
                        const updateDetail = `UPDATE movement_details 
                                                SET 
                                                    loanStatus_id = ?, 
                                                    remarks = ?, 
                                                    user_returning = ? 
                                                WHERE movementDetail_id = ?;`;
                        const dataUpdateDetail = [6, remarks, user_returning, movementDetail_id];
                        await pool.query(updateDetail, dataUpdateDetail);

                        // devolver el stock reservado a su ubicacion
                        const sqlReturnStockBatchLocation = `UPDATE batch_location_infos SET quantity = ?
                                                                WHERE batch_id = ?;`
                        const dataReturnStockBatchLocation = [movementDetail.quantity, movementDetail.batch_id];
                        await pool.query(sqlReturnStockBatchLocation, dataReturnStockBatchLocation);

                        //Por cada detalle de movimiento devolver el stock reservado al lote
                        const sqlReturnStockBatch = `UPDATE batches SET quantity = ?
                                                        WHERE batch_id = ?;`
                        const dataReturnStockBatch = [movementDetail.quantity, movementDetail.batch_id];
                        await pool.query(sqlReturnStockBatch, dataReturnStockBatch);

                        //Por cada detalle de movimiento devolver el stock reservado al elemento
                        //Primero traemos el stock completo del elemento
                        const sqlStock = `SELECT stock FROM elements WHERE element_id = ?;`;
                        const dataStock = [movementDetail.element_id];
                        const [resultStock] = await pool.query(sqlStock, dataStock);

                        const stock = resultStock[0].stock;

                        const newStock = stock + movementDetail.quantity;

                        const sqlReturnStockElement = `UPDATE elements SET stock = ?
                                                        WHERE element_id = ?;`
                        const dataReturnStockElement = [newStock, movementDetail.element_id];
                        await pool.query(sqlReturnStockElement, dataReturnStockElement);

                        comment = 'Completado y devuelto';
                    }
                }
            }

            if (noCompleted > 0) {
                await pool.query('COMMIT')
                return res.status(201).json({
                    error: false,
                    message: 'Aún faltan elementos por entregar el estado general continuará En préstamo'
                })
            }

            //Actualizar el estado de préstamo de movimiento general a cancelado
            const sqlUpdateMovementStatus = `UPDATE movements 
                                                    SET 
                                                        movementLoan_status = ?, 
                                                        user_manager = ?, 
                                                        updated_at = CURRENT_TIMESTAMP,
                                                        user_returning = ?,
                                                        actual_return = CURRENT_TIMESTAMP
                                                    WHERE movement_id = ? AND movementLoan_status  = ?;`;
            const dataUpdateMovementStatus = [6, user.user_id, user_returning, id, 5];
            await pool.query(sqlUpdateMovementStatus, dataUpdateMovementStatus);
        }

        if (statusMovement == 6) {
            //Realizar las entregas
            //No se hace nada, el movimiento ya fue cancelado, entonces si quiere debe realizar otro movimiento de solicitud
            await pool.query('ROLLBACK');
            return res.status(400).json({
                error: true,
                message: "Este movimiento ya fue completado, realice un nuevo movimiento por favor"
            })
        }

        if (statusMovement == 7) {
            //No se hace nada, el movimiento ya fue cancelado, entonces si quiere debe realizar otro movimiento de solicitud
            await pool.query('ROLLBACK');
            return res.status(400).json({
                error: true,
                message: "Este movimiento ya fue cancelado, realice un nuevo movimiento por favor"
            })
        }

        await pool.query('COMMIT')

        return res.status(200).json({
            message: 'Cambio exitoso'
        })
    } catch (error) {
        await pool.query('ROLLBACK');
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
}