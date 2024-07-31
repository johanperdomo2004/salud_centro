import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarUbicacion, ListarUbicacion, BuscarUbicacion, ActualizarUbicacion, Desactivarubicacion } from "../controllers/Ubicacion.controller.jdcc.js";

const route = Router();

route.use(validarToken);

route.post('/registrar', RegistrarUbicacion);
route.get('/listar', ListarUbicacion);
route.get('/buscar/:id', validarToken, BuscarUbicacion);
route.put('/actualizar/:id', ActualizarUbicacion);
route.put('/desactivar/:id', Desactivarubicacion);

export default route;