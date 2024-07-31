import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarCategoria, ListarCategoria, BuscarCategoria, ActualizarCategoria, DesactivarCategoria } from "../controllers/Categoria.controller.jdcc.js";

const route = Router();

route.use(validarToken);

route.post('/registrar', RegistrarCategoria);
route.get('/listar', ListarCategoria);
route.get('/buscar/:id', validarToken, BuscarCategoria);
route.put('/actualizar/:id', ActualizarCategoria);
route.put('/desactivar/:id', DesactivarCategoria);

export default route;