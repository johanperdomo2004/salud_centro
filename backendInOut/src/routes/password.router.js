import { Router } from "express"
import { password } from "../controllers/password.controller.js"

const route = Router();

route.post("/recuperar", password.tokenPassword);
route.put("/cambiar", password.resetPassword);

export default route;