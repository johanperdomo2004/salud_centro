import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarEmpaque, ListarEmpaque, BuscarEmpaque, ActualizarEmpaque, DesactivarEmpaque } from "../controllers/Empaque.controller.jdcc.js";

const route = Router();

route.use(validarToken);

route.post('/registrar', RegistrarEmpaque);
route.get('/listar', ListarEmpaque);
route.get('/buscar/:id', validarToken, BuscarEmpaque);
route.put('/actualizar/:id', ActualizarEmpaque);
route.put('/desactivar/:id', DesactivarEmpaque);

export default route;