import { getBatchesById } from "../controllers/BatchesController.js";
import { validarToken } from "../controllers/validator.controller.js";
import { Router } from "express";

const route = Router();

route.use(validarToken);

route.get('/list/:id', getBatchesById);

export default route;