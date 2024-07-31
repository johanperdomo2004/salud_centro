import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarMedida, ListarMedida, Buscarmedida, ActualizarMedida, DesactivarMedida } from "../controllers/UnidadMedida.controller.jdcc.js";

const route = Router();

route.use(validarToken);

route.post('/registrar', RegistrarMedida);
route.get('/listar', ListarMedida);
route.get('/buscar/:id', validarToken, Buscarmedida);
route.put('/actualizar/:id', ActualizarMedida);
route.put('/desactivar/:id', DesactivarMedida);

export default route;