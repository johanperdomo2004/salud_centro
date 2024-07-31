import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarTipo, ListarTipo, BuscarTipo, ActualizarTipo, EliminarTipo, DesactivarTipo } from "../controllers/TipoElemento.controller.jdcc.js";

const route = Router();

route.use(validarToken);

route.post('/registrar', RegistrarTipo);
route.get('/listar', ListarTipo);
route.get('/buscar/:id', validarToken, BuscarTipo);
route.put('/actualizar/:id', ActualizarTipo);
route.delete('/eliminar/:id', validarToken, EliminarTipo);
route.put('/desactivar/:id', DesactivarTipo);

export default route;