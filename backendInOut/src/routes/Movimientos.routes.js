//Importación de dependencias
import { Router } from "express";

//Importación de middlewares
import { validarToken } from "../controllers/validator.controller.js";
import { testDatabaseConnection } from "../database/conexion.js";


//importación de funciones
import {
    BuscarMovimiento,
    ListarTodosMovimientos,
    RegistrarMovimientoPrestamo,
    ListarDetallesMovimiento,
    RegistrarMovimientoIngreso,
    RegistrarDetalleMovimiento,
    ActualizarDetalleMovimiento,
    registerIncomingMovement,
    registerOutgoingMovement,
    registerLoganMovement,
    updateLoganStatus,
    getMovements,
    getMovementsByFilter,
    getMovementDetailsById,
    getLoans,
    getLoanByMovmentId,
    registerLoganMovementInWarehouse,
    getMovementsByUserId
} from "../controllers/MovimientosController.js";

//Instancia
const route = Router();

//Middleware para todas las rutas
route.use(testDatabaseConnection);

//rutas públicas

//Middleware para rutas protegidas
route.use(validarToken);

//rutas protegidas
//rutas para solo el admin

//rutas para el encargado y el admin
route.get('/list', getMovements);
route.get('/list/:filter', getMovementsByFilter);
route.get('/movement-details/list/:id', getMovementDetailsById);
route.get('/loans/list', getLoans);
route.get('/loans/list/:id', getLoanByMovmentId);
route.get('/list/user/:id', getMovementsByUserId);


//rutas para todos los usuarios
route.post('/register-incoming', registerIncomingMovement);
route.post('/register-outgoing', registerOutgoingMovement);
route.post('/register-loan', registerLoganMovement);
route.post('/register-loan-in-warehouse', registerLoganMovementInWarehouse);
route.put('/update-logan-status/:id', updateLoganStatus);

route.get('/listar', ListarTodosMovimientos);
route.get('/buscar/:id', BuscarMovimiento);
route.get('/:id/detalles', ListarDetallesMovimiento);
route.post('/registrar', RegistrarMovimientoPrestamo);

route.post('/aniadirStock', RegistrarMovimientoIngreso);

route.post('/:id/aniadirDetalle', RegistrarDetalleMovimiento);

route.put('/actualizarDetalle/:id', ActualizarDetalleMovimiento);

export default route;