import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarElemento, AñadirStock, ListarElemetos, BuscarElemento, ActualizarElemento, EliminarElemento, DesactivarElementos } from "../controllers/Elemento.controller.jdcc.js";

const route = Router();

route.use(validarToken);

route.put('/aniadir/:id', validarToken, AñadirStock);
route.get('/listar', ListarElemetos);
route.post('/registrar', RegistrarElemento);
route.get('/buscar/:id', validarToken, BuscarElemento);
route.put('/actualizar/:id', ActualizarElemento);
route.delete('/eliminar/:id', validarToken, EliminarElemento);
route.put('/desactivar/:id', DesactivarElementos);

export default route;