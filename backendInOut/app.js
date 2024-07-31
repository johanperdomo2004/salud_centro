//Importaciones de dependencias para configuraciones
import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'

//Importaciones de rutas
import routeBodega from "./src/routes/Bodegas.Router.jeph.js";
import movimientosRoute from './src/routes/Movimientos.routes.js'
import RouteTipoElemento from "./src/routes/TipoElemento.Router.jdcc.js";
import RouteCategoeria from "./src/routes/Categoria.Router.jdcc.js";
import RouteEmpaque from "./src/routes/Empaque.Router.jdcc.js";
import RouteMedida from "./src/routes/UnidadMedida.Router.jdcc.js";
import RouteUbicacion from "./src/routes/Ubicacion.Router.jdcc.js"
import RouteElemento from "./src/routes/Elemento.Router.jdcc.js";
import RouteUsuario from "./src/routes/usuario.router.js";
import RouteValidar from "./src/routes/validator.router.js";
import reportesRoute from "./src/routes/Reportes.routes.yacb.js";
import RouteContraseña from "./src/routes/password.router.js";
import RouteRoles from "./src/routes/Roles.routes.js";
import PositionsRoute from "./src/routes/Positions.routes.js";
import batchesRoute from "./src/routes/Batches.routes.js"
import counterRoute from "./src/routes/Counter.router.yacb.js"

//Configuración
const app = express(); // Crear la instancia de aplicación express
app.use(cookieParser()); // Usa cookie-parser para analizar las cookies
app.use(cors({
    origin: true, //Permitir cualquier origen
    credentials: true //Permitir el uso de cookies
}));
app.use(bodyParser.json()); //Configuración para analizar cuerpos con solicitudes en formato JSON
app.use(bodyParser.urlencoded({ extended: true })); // Usa body-parser para analizar cuerpos codificados en URL
dotenv.config(); //Importar variables de entorno

//Constantes
const PORT = process.env.SERVER_PORT || 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Rutas
app.get('/', (req, res) => {
    res.send('pagina Inicial')
}); //Ruta inicial
app.get('/documents', (req, res) => {
    const documentsPath = path.join(__dirname, 'src', 'pages', 'documents.html');
    res.sendFile(documentsPath);
}); // Ruta para la documentación de la API

app.use('/bodega', routeBodega);
app.use('/tipo', RouteTipoElemento);
app.use('/categoria', RouteCategoeria);
app.use('/empaque', RouteEmpaque);
app.use('/medida', RouteMedida);
app.use('/ubicacion', RouteUbicacion);
app.use('/elemento', RouteElemento);
app.use('/movimientos', movimientosRoute);
app.use('/usuario', RouteUsuario);
app.use('/validate', RouteValidar);
app.use('/reporte', reportesRoute);
app.use('/contrasena', RouteContraseña);
app.use('/roles', RouteRoles);
app.use('/positions', PositionsRoute);
app.use('/batches', batchesRoute);
app.use('/counter', counterRoute );


//Iniciar el servidor
const startServer = async () => {
    app.listen(PORT, async () => {
        console.log(`El servidor se esta ejecutando en el puerto ${PORT}`); //
    })
}

startServer();