import { Router } from "express";
import {registrarUsuario, ListarUsuario, BuscarUsuario, ActualizarUsuario, DesactivarUsuario, ActualizarPerfil, cambiarContrasena} from "../controllers/usuario.controller.js";
import { validar_usuario, Validar_Actualizar } from "../validators/validate.usuario.js"
import { validarToken } from "../controllers/validator.controller.js";

const route = Router();

route.use(validarToken);

route.post('/registrar', validar_usuario, registrarUsuario);
route.get('/listar', ListarUsuario);
route.get('/buscar/:id', BuscarUsuario);
route.put('/actualizar/:id', Validar_Actualizar, ActualizarUsuario);
route.put('/perfil/:id', Validar_Actualizar, ActualizarPerfil);
route.put('/desactivar/:id', DesactivarUsuario); 
route.put('/contrasena/:id', cambiarContrasena);

export default route;