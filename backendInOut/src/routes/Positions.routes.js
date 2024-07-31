import { getPositions } from "../controllers/PositionsController.js";
import { validarToken } from "../controllers/validator.controller.js";
import { Router } from "express";

const route = Router();

route.use(validarToken);

route.get('/list', getPositions);

export default route;