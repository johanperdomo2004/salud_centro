import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarBodega, listarBodegas, BuscarBodega, ActualizarBodega, DesactivarBodega } from "../controllers/Bodegas.Controllers.jeph.js";

const route = Router();

route.use(validarToken);

route.post('/registrar',  RegistrarBodega);
route.get('/listar', listarBodegas);
route.get('/buscar/:id', validarToken, BuscarBodega)
route.put('/actualizar/:id', ActualizarBodega);
route.put('/desactivar/:id', DesactivarBodega);

export default route;