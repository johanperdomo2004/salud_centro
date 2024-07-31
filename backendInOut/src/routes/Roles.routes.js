import { getRoles } from "../controllers/Roles.controller.js";
import { validarToken } from "../controllers/validator.controller.js";
import { Router } from "express";

const route = Router();

route.use(validarToken);

route.get('/list', getRoles);

export default route;