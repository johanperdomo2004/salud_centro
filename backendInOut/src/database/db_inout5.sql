-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 21-05-2024 a las 12:58:39
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_inout`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega`
--

CREATE TABLE `bodega` (
  `codigo_Bodega` int NOT NULL,
  `ubicacion` varchar(50) NOT NULL,
  `Nombre_bodega` varchar(50) NOT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `bodega`
--

INSERT INTO `bodega` (`codigo_Bodega`, `ubicacion`, `Nombre_bodega`, `Estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Calle 1, Ciudad X', 'Bodega Principal', 'Activo', '2024-04-05 08:25:00', '2024-04-05 08:25:00'),
(2, 'Avenida 2, Ciudad Y', 'Almacén Secundario', 'Activo', '2024-04-05 08:25:00', '2024-04-05 08:25:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_elemento`
--

CREATE TABLE `categoria_elemento` (
  `codigo_Categoria` int NOT NULL,
  `Nombre_Categoria` varchar(50) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `categoria_elemento`
--

INSERT INTO `categoria_elemento` (`codigo_Categoria`, `Nombre_Categoria`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Lalala', 'Activo', '2024-04-05 08:25:36', '2024-04-05 08:25:36'),
(2, 'Mobiliario', 'Activo', '2024-04-05 08:25:36', '2024-04-05 08:25:36'),
(3, 'Electrónica', 'Activo', '2024-04-05 08:25:36', '2024-04-05 08:25:36'),
(4, 'Accesorios', 'Activo', '2024-04-05 08:25:36', '2024-04-05 08:25:36'),
(5, 'Material de Oficina', 'Activo', '2024-04-05 08:25:36', '2024-04-05 08:25:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_movimiento`
--

CREATE TABLE `detalle_movimiento` (
  `codigo_detalle` int NOT NULL,
  `fk_movimiento` int DEFAULT NULL,
  `fk_elemento` int DEFAULT NULL,
  `estado` enum('Confirmada','En espera','Cancelada','En Prestamo','Finalizada') DEFAULT 'En espera',
  `fecha_vencimiento` date DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `Usuario_recibe` int DEFAULT NULL,
  `Usuario_entrega` int DEFAULT NULL,
  `Observaciones` text,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `detalle_movimiento`
--

INSERT INTO `detalle_movimiento` (`codigo_detalle`, `fk_movimiento`, `fk_elemento`, `estado`, `fecha_vencimiento`, `cantidad`, `Usuario_recibe`, `Usuario_entrega`, `Observaciones`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 1, NULL, '2024-03-15', 10, 2, 1, 'Entrega', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(2, 2, 2, NULL, '2024-03-16', 5, 3, 2, '', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(3, 3, 3, 'Cancelada', NULL, 0, NULL, NULL, 'Cancelado por falta de stock', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(4, 4, 1, NULL, '2024-03-17', 3, 4, 5, 'Mas elementos', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(5, 5, 2, NULL, '2024-03-18', 8, 5, 1, 'Se despacharon correctamente los elementos', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(6, 7, 1, NULL, '2024-03-15', 5, 1, 2, 'Ninguna', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(7, 7, 2, NULL, '2024-03-15', 5, 1, 2, 'Ninguna', '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(8, 8, 2, NULL, NULL, 1, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(9, 9, 4, NULL, NULL, 0, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(10, 10, 4, NULL, NULL, 4, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(11, 11, 4, NULL, NULL, 3, 1, 6, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(12, 12, 3, NULL, NULL, 1, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(13, 13, 2, NULL, NULL, 3, 1, 4, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(14, 14, 2, NULL, NULL, 3, 1, 4, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(15, 17, 3, NULL, NULL, 8, 1, 4, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(16, 18, 5, NULL, NULL, 78, 1, 6, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(17, 19, 5, NULL, NULL, 7, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(18, 20, 4, NULL, NULL, 18, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(19, 21, 3, NULL, NULL, 1, 1, 5, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(20, 22, 3, NULL, NULL, 2, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(21, 23, 3, NULL, NULL, 0, 1, 4, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(22, 24, 2, NULL, NULL, 1, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(23, 25, 4, NULL, NULL, 1, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(24, 26, 2, NULL, NULL, 2, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(25, 27, 4, NULL, NULL, 2, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(26, 28, 2, NULL, NULL, 2, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(27, 29, 5, NULL, NULL, 2, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(28, 30, 1, NULL, NULL, 2, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(29, 31, 4, NULL, NULL, 2, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(30, 32, 1, NULL, NULL, 5, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(31, 33, 1, NULL, NULL, 10, 1, 1, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(32, 34, 1, NULL, NULL, 5, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(33, 35, 1, NULL, NULL, 5, 1, 2, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(34, 36, 1, NULL, NULL, 5, 1, 4, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(35, 37, 1, NULL, NULL, 2, 1, 3, NULL, '2024-04-05 08:26:14', '2024-04-05 08:26:14'),
(36, 55, 2, NULL, NULL, 4, NULL, 2, NULL, '2024-04-27 16:40:52', '2024-04-27 16:40:52'),
(37, 56, 2, NULL, NULL, 8, NULL, 1, NULL, '2024-04-27 16:41:07', '2024-04-27 16:41:07'),
(38, 57, 2, NULL, NULL, 6, NULL, 3, NULL, '2024-04-27 16:42:56', '2024-04-27 16:42:56'),
(39, 58, 3, NULL, NULL, 3, NULL, 1, NULL, '2024-04-27 16:45:51', '2024-04-27 16:45:51'),
(40, 59, 2, NULL, NULL, 2, NULL, 2, NULL, '2024-04-30 10:06:57', '2024-04-30 10:06:57'),
(41, 60, 2, NULL, NULL, 34, NULL, 1, NULL, '2024-04-30 10:08:38', '2024-04-30 10:08:38'),
(42, 61, 1, NULL, NULL, 3, NULL, 1, NULL, '2024-04-30 10:11:33', '2024-04-30 10:11:33'),
(43, 62, 2, NULL, NULL, 34, NULL, 2, NULL, '2024-04-30 10:13:53', '2024-04-30 10:13:53'),
(44, 63, 1, NULL, NULL, 44, NULL, 2, NULL, '2024-04-30 10:15:56', '2024-04-30 10:15:56'),
(45, 64, 1, NULL, NULL, 2, NULL, 1, NULL, '2024-04-30 10:16:06', '2024-04-30 10:16:06'),
(46, 65, 2, NULL, NULL, 3, NULL, 2, NULL, '2024-04-30 10:18:52', '2024-04-30 10:18:52'),
(47, 66, 1, NULL, NULL, 4, 1, 1, NULL, '2024-04-30 10:19:29', '2024-04-30 10:19:29'),
(48, 67, 2, NULL, NULL, 2, NULL, 2, NULL, '2024-04-30 10:24:21', '2024-04-30 10:24:21'),
(49, 68, 2, NULL, NULL, 2, NULL, 1, NULL, '2024-04-30 10:52:00', '2024-04-30 10:52:00'),
(50, 69, 2, NULL, NULL, 123, NULL, 2, NULL, '2024-04-30 10:52:46', '2024-04-30 10:52:46'),
(51, 70, 1, NULL, NULL, 123, NULL, 1, NULL, '2024-04-30 10:53:07', '2024-04-30 10:53:07'),
(52, 71, 2, NULL, NULL, 11, NULL, 1, NULL, '2024-04-30 10:53:35', '2024-04-30 10:53:35'),
(53, 72, 2, NULL, NULL, 2, 6, 1, NULL, '2024-04-30 11:02:43', '2024-04-30 11:02:43'),
(54, 73, 1, NULL, NULL, 23, 6, 4, NULL, '2024-04-30 11:03:06', '2024-04-30 11:03:06'),
(55, 74, 2, NULL, NULL, 1, 6, 2, NULL, '2024-04-30 11:10:29', '2024-04-30 11:10:29'),
(56, 80, 2, NULL, NULL, 1, 6, 2, NULL, '2024-04-30 11:16:11', '2024-04-30 11:16:11'),
(57, 81, 3, NULL, NULL, 2, 6, 2, NULL, '2024-04-30 11:16:29', '2024-04-30 11:16:29'),
(58, 82, 2, NULL, NULL, 2, 6, 2, NULL, '2024-04-30 11:16:47', '2024-04-30 11:16:47'),
(59, 83, 1, NULL, NULL, 2, 6, 1, NULL, '2024-04-30 11:16:58', '2024-04-30 11:16:58'),
(60, 84, 2, NULL, NULL, 2, 6, 2, NULL, '2024-04-30 11:18:20', '2024-04-30 11:18:20'),
(61, 85, 2, NULL, NULL, 4, 2, 6, NULL, '2024-04-30 11:26:40', '2024-04-30 11:26:40'),
(62, 86, 1, NULL, NULL, 3, 6, 1, NULL, '2024-05-20 20:54:42', '2024-05-20 20:54:42'),
(63, 87, 1, NULL, NULL, 200, 2, 6, NULL, '2024-05-20 20:55:05', '2024-05-20 20:55:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ubicacion`
--

CREATE TABLE `detalle_ubicacion` (
  `codigo_Detalle` int NOT NULL,
  `Nombre_ubicacion` varchar(50) NOT NULL,
  `fk_bodega` int DEFAULT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `detalle_ubicacion`
--

INSERT INTO `detalle_ubicacion` (`codigo_Detalle`, `Nombre_ubicacion`, `fk_bodega`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Estantería A', 1, 'Activo', '2024-04-05 08:26:43', '2024-04-05 08:26:43'),
(2, 'Almacén B', 2, 'Activo', '2024-04-05 08:26:43', '2024-04-05 08:26:43'),
(3, 'Oficina Principal', 1, 'Activo', '2024-04-05 08:26:43', '2024-04-05 08:26:43'),
(4, 'Almacén C', 2, 'Activo', '2024-04-05 08:26:43', '2024-04-05 08:26:43'),
(5, 'Estantería B', 1, 'Activo', '2024-04-05 08:26:43', '2024-04-05 08:26:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elemento`
--

CREATE TABLE `elemento` (
  `Codigo_elemento` int NOT NULL,
  `Nombre_elemento` varchar(50) NOT NULL,
  `stock` int DEFAULT NULL,
  `fk_tipoElemento` int DEFAULT NULL,
  `fk_unidadMedida` int DEFAULT NULL,
  `fk_categoria` int DEFAULT NULL,
  `fk_tipoEmpaque` int DEFAULT NULL,
  `fk_detalleUbicacion` int DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `elemento`
--

INSERT INTO `elemento` (`Codigo_elemento`, `Nombre_elemento`, `stock`, `fk_tipoElemento`, `fk_unidadMedida`, `fk_categoria`, `fk_tipoEmpaque`, `fk_detalleUbicacion`, `Estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Computadora', 40, 1, 1, 1, 1, 1, 'Inactivo', '2024-04-05 08:27:24', '2024-04-05 08:27:24'),
(2, 'Impresora', 224, 2, 2, 2, 2, 2, 'Inactivo', '2024-04-05 08:27:24', '2024-04-05 08:27:24'),
(3, 'Teléfono', 47, 1, 1, 1, 1, 3, 'Inactivo', '2024-04-05 08:27:24', '2024-04-05 08:27:24'),
(4, 'Escritorio', 40, 2, 2, 2, 2, 4, 'Inactivo', '2024-04-05 08:27:24', '2024-04-05 08:27:24'),
(5, 'Silla', 112, 1, 1, 1, 1, 5, 'Inactivo', '2024-04-05 08:27:24', '2024-04-05 08:27:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--

CREATE TABLE `movimiento` (
  `Codigo_movimiento` int NOT NULL,
  `fecha_movimiento` datetime DEFAULT CURRENT_TIMESTAMP,
  `Usuario_solicitud` int DEFAULT NULL,
  `fk_movimiento` int DEFAULT NULL,
  `Estado` enum('Confirmada','En espera','Cancelada','En Prestamo','Finalizada') DEFAULT 'En espera',
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `movimiento`
--

INSERT INTO `movimiento` (`Codigo_movimiento`, `fecha_movimiento`, `Usuario_solicitud`, `fk_movimiento`, `Estado`, `fecha_actualizacion`) VALUES
(1, '2024-03-10 00:00:00', 1, 1, NULL, '2024-04-05 08:27:58'),
(2, '2024-03-11 00:00:00', 2, 2, NULL, '2024-04-05 08:27:58'),
(3, '2024-03-12 00:00:00', 3, 3, 'Cancelada', '2024-04-05 08:27:58'),
(4, '2024-03-13 00:00:00', 4, 1, NULL, '2024-04-05 08:27:58'),
(5, '2024-03-14 00:00:00', 5, 2, NULL, '2024-04-05 08:27:58'),
(7, '2024-04-09 00:00:00', 1, 1, NULL, '2024-04-05 08:27:58'),
(8, NULL, 1, 1, NULL, '2024-04-05 08:27:58'),
(9, NULL, 1, 1, NULL, '2024-04-05 08:27:58'),
(10, NULL, 1, 1, NULL, '2024-04-05 08:27:58'),
(11, NULL, 1, 1, NULL, '2024-04-05 08:27:58'),
(12, '2024-04-02 11:09:35', 1, 1, NULL, '2024-04-05 08:27:58'),
(13, '2024-04-02 11:10:46', 1, 1, NULL, '2024-04-05 08:27:58'),
(14, '2024-04-02 11:10:52', 1, 1, NULL, '2024-04-05 08:27:58'),
(17, '2024-04-02 11:11:40', 1, 1, NULL, '2024-04-05 08:27:58'),
(18, '2024-04-02 11:11:54', 1, 1, NULL, '2024-04-05 08:27:58'),
(19, '2024-04-02 11:12:13', 1, 1, NULL, '2024-04-05 08:27:58'),
(20, '2024-04-02 11:12:20', 1, 1, NULL, '2024-04-05 08:27:58'),
(21, '2024-04-02 11:12:29', 1, 1, NULL, '2024-04-05 08:27:58'),
(22, '2024-04-02 11:13:12', 1, 1, NULL, '2024-04-05 08:27:58'),
(23, '2024-04-02 11:13:19', 1, 1, NULL, '2024-04-05 08:27:58'),
(24, '2024-04-02 11:14:02', 1, 1, NULL, '2024-04-05 08:27:58'),
(25, '2024-04-02 11:14:10', 1, 1, NULL, '2024-04-05 08:27:58'),
(26, '2024-04-02 11:25:03', 1, 1, NULL, '2024-04-05 08:27:58'),
(27, '2024-04-02 11:28:00', 1, 1, NULL, '2024-04-05 08:27:58'),
(28, '2024-04-02 11:28:18', 1, 2, NULL, '2024-04-05 08:27:58'),
(29, '2024-04-02 11:28:37', 1, 2, NULL, '2024-04-05 08:27:58'),
(30, '2024-04-02 11:30:26', 1, 1, NULL, '2024-04-05 08:27:58'),
(31, '2024-04-02 11:30:34', 1, 2, NULL, '2024-04-05 08:27:58'),
(32, '2024-04-05 07:13:15', 1, 1, NULL, '2024-04-05 08:27:58'),
(33, '2024-04-05 07:13:29', 1, 2, NULL, '2024-04-05 08:27:58'),
(34, '2024-04-05 07:14:50', 1, 1, NULL, '2024-04-05 08:27:58'),
(35, '2024-04-05 07:15:04', 1, 1, NULL, '2024-04-05 08:27:58'),
(36, '2024-04-05 07:15:41', 1, 1, NULL, '2024-04-05 08:27:58'),
(37, '2024-04-05 07:15:53', 1, 2, NULL, '2024-04-05 08:27:58'),
(42, '2024-04-27 11:42:20', 1, 3, 'En espera', '2024-04-27 11:42:20'),
(43, '2024-04-27 12:28:59', 3, 3, 'Confirmada', '2024-04-27 12:28:59'),
(44, '2024-04-27 13:49:54', 6, 3, 'Confirmada', '2024-04-27 13:49:54'),
(45, '2024-04-27 13:49:54', 1, 3, 'En espera', '2024-04-27 13:49:54'),
(46, '2024-04-27 13:49:54', 5, 3, 'En espera', '2024-04-27 13:49:54'),
(47, '2024-04-27 13:49:54', 2, 3, 'En espera', '2024-04-27 13:49:54'),
(48, '2024-04-27 16:23:16', 1, 3, 'Confirmada', '2024-04-27 16:23:16'),
(49, '2024-04-27 16:23:16', 6, 3, 'En espera', '2024-04-27 16:23:16'),
(50, '2024-04-27 16:23:16', 5, 3, 'Confirmada', '2024-04-27 16:23:16'),
(51, '2024-04-27 16:23:16', 5, 3, 'En espera', '2024-04-27 16:23:16'),
(52, '2024-04-27 16:23:16', 4, 3, 'Confirmada', '2024-04-27 16:23:16'),
(55, '2024-04-27 16:40:52', 1, 1, NULL, '2024-04-27 16:40:52'),
(56, '2024-04-27 16:41:07', 1, 2, NULL, '2024-04-27 16:41:07'),
(57, '2024-04-27 16:42:56', 1, 2, NULL, '2024-04-27 16:42:56'),
(58, '2024-04-27 16:45:51', 1, 1, NULL, '2024-04-27 16:45:51'),
(59, '2024-04-30 10:06:57', 1, 1, NULL, '2024-04-30 10:06:57'),
(60, '2024-04-30 10:08:38', 1, 1, NULL, '2024-04-30 10:08:38'),
(61, '2024-04-30 10:11:33', 1, 1, NULL, '2024-04-30 10:11:33'),
(62, '2024-04-30 10:13:53', 1, 1, NULL, '2024-04-30 10:13:53'),
(63, '2024-04-30 10:15:56', 1, 1, NULL, '2024-04-30 10:15:56'),
(64, '2024-04-30 10:16:06', 1, 1, NULL, '2024-04-30 10:16:06'),
(65, '2024-04-30 10:18:52', 1, 1, NULL, '2024-04-30 10:18:52'),
(66, '2024-04-30 10:19:29', 1, 1, NULL, '2024-04-30 10:19:29'),
(67, '2024-04-30 10:24:21', 1, 1, NULL, '2024-04-30 10:24:21'),
(68, '2024-04-30 10:52:00', 1, 1, NULL, '2024-04-30 10:52:00'),
(69, '2024-04-30 10:52:46', 1, 1, NULL, '2024-04-30 10:52:46'),
(70, '2024-04-30 10:53:07', 1, 1, NULL, '2024-04-30 10:53:07'),
(71, '2024-04-30 10:53:35', 1, 1, NULL, '2024-04-30 10:53:35'),
(72, '2024-04-30 11:02:43', 1, 1, NULL, '2024-04-30 11:02:43'),
(73, '2024-04-30 11:03:06', 1, 1, NULL, '2024-04-30 11:03:06'),
(74, '2024-04-30 11:10:29', 1, 1, NULL, '2024-04-30 11:10:29'),
(80, '2024-04-30 11:16:11', 1, 1, NULL, '2024-04-30 11:16:11'),
(81, '2024-04-30 11:16:29', 1, 1, NULL, '2024-04-30 11:16:29'),
(82, '2024-04-30 11:16:47', 1, 2, NULL, '2024-04-30 11:16:47'),
(83, '2024-04-30 11:16:58', 1, 2, NULL, '2024-04-30 11:16:58'),
(84, '2024-04-30 11:18:20', 1, 2, NULL, '2024-04-30 11:18:20'),
(85, '2024-04-30 11:26:40', 1, 2, NULL, '2024-04-30 11:26:40'),
(86, '2024-05-20 20:54:42', 1, 1, NULL, '2024-05-20 20:54:42'),
(87, '2024-05-20 20:55:05', 1, 2, NULL, '2024-05-20 20:55:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_elemento`
--

CREATE TABLE `tipo_elemento` (
  `codigo_Tipo` int NOT NULL,
  `nombre_tipoElemento` varchar(50) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_Actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `tipo_elemento`
--

INSERT INTO `tipo_elemento` (`codigo_Tipo`, `nombre_tipoElemento`, `estado`, `fecha_creacion`, `fecha_Actualizacion`) VALUES
(1, 'Devolutivo', 'activo', '2024-04-05 08:29:05', '2024-04-05 08:29:05'),
(2, 'Consumible', 'activo', '2024-04-05 08:29:05', '2024-04-05 08:29:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_empaque`
--

CREATE TABLE `tipo_empaque` (
  `codigo_Empaque` int NOT NULL,
  `Nombre_Empaque` varchar(50) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `tipo_empaque`
--

INSERT INTO `tipo_empaque` (`codigo_Empaque`, `Nombre_Empaque`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Hola', 'Inactivo', '2024-04-05 08:30:03', '2024-04-05 08:30:03'),
(2, 'eifgasifgsd', 'Activo', '2024-04-05 08:30:03', '2024-04-05 08:30:03'),
(3, 'Paquete', 'Activo', '2024-04-05 08:30:03', '2024-04-05 08:30:03'),
(4, 'Contenedor', 'Activo', '2024-04-05 08:30:03', '2024-04-05 08:30:03'),
(5, 'Lalalal', 'Activo', '2024-04-05 08:30:03', '2024-04-05 08:30:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_movimiento`
--

CREATE TABLE `tipo_movimiento` (
  `codigo_tipo` int NOT NULL,
  `Nombre_movimiento` varchar(50) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_Actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `tipo_movimiento`
--

INSERT INTO `tipo_movimiento` (`codigo_tipo`, `Nombre_movimiento`, `estado`, `fecha_creacion`, `fecha_Actualizacion`) VALUES
(1, 'Ingreso', 'activo', '2024-04-05 08:31:16', '2024-04-05 08:31:16'),
(2, 'Egreso', 'activo', '2024-04-05 08:31:16', '2024-04-05 08:31:16'),
(3, 'Prestamo', 'activo', '2024-04-05 08:31:16', '2024-04-05 08:31:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_medida`
--

CREATE TABLE `unidad_medida` (
  `codigo_medida` int NOT NULL,
  `Nombre_Medida` varchar(50) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `unidad_medida`
--

INSERT INTO `unidad_medida` (`codigo_medida`, `Nombre_Medida`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Gramo', 'Activo', '2024-04-05 08:31:43', '2024-04-05 08:31:43'),
(2, 'Kilogramo', 'Activo', '2024-04-05 08:31:43', '2024-04-05 08:31:43'),
(3, 'Metro Cubico', 'Activo', '2024-04-05 08:31:43', '2024-04-05 08:31:43'),
(4, 'Centimetro Cubico', 'Activo', '2024-04-05 08:31:43', '2024-04-05 08:31:43'),
(5, 'Litro', 'Activo', '2024-04-05 08:31:43', '2024-04-05 08:31:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL,
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `apellido_usuario` varchar(50) DEFAULT NULL,
  `email_usuario` varchar(100) DEFAULT NULL,
  `rol` enum('administrador','Encargado','Usuario') DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `contraseña_usuario` varchar(255) DEFAULT NULL,
  `Id_ficha` int DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Activo',
  `identificacion` bigint NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_Actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `apellido_usuario`, `email_usuario`, `rol`, `numero`, `contraseña_usuario`, `Id_ficha`, `Estado`, `identificacion`, `fecha_creacion`, `fecha_Actualizacion`) VALUES
(1, 'Juan', 'Perez', 'juan@example.com', 'administrador', '123456789', 'hashed_password_1', 1, 'Activo', 0, '2024-04-05 07:23:21', '2024-04-05 07:23:21'),
(2, 'Maria', 'Gomez', 'maria@example.com', 'Encargado', '987654321', 'hashed_password_2', 2, 'Activo', 0, '2024-04-05 07:23:21', '2024-04-05 07:23:21'),
(3, 'Pedro', 'Rodriguez', 'pedro@example.com', 'Usuario', '456789123', 'hashed_password_3', 3, 'Inactivo', 0, '2024-04-05 07:23:21', '2024-04-05 07:23:21'),
(4, 'Ana', 'Lopez', 'ana@example.com', 'Usuario', '789123456', 'hashed_password_4', 4, 'Activo', 0, '2024-04-05 07:23:21', '2024-04-05 07:23:21'),
(5, 'Laura', 'Martinez', 'laura@example.com', 'Usuario', '321654987', 'hashed_password_5', 5, 'Activo', 0, '2024-04-05 07:23:21', '2024-04-05 07:23:21'),
(6, 'Cristian', 'Giron', 'cf.giron04@gmail.com', 'administrador', '3123028342', '123admin', 2644590, 'Activo', 0, '2024-04-05 07:23:21', '2024-04-05 07:23:21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bodega`
--
ALTER TABLE `bodega`
  ADD PRIMARY KEY (`codigo_Bodega`);

--
-- Indices de la tabla `categoria_elemento`
--
ALTER TABLE `categoria_elemento`
  ADD PRIMARY KEY (`codigo_Categoria`);

--
-- Indices de la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  ADD PRIMARY KEY (`codigo_detalle`),
  ADD KEY `fk_elemento_detalle` (`fk_elemento`),
  ADD KEY `fk_usuario_entrega_detalle` (`Usuario_entrega`);

--
-- Indices de la tabla `detalle_ubicacion`
--
ALTER TABLE `detalle_ubicacion`
  ADD PRIMARY KEY (`codigo_Detalle`),
  ADD KEY `fk_bodega_detalleUbicacion` (`fk_bodega`);

--
-- Indices de la tabla `elemento`
--
ALTER TABLE `elemento`
  ADD PRIMARY KEY (`Codigo_elemento`),
  ADD KEY `fk_tipoElemento_elemento` (`fk_tipoElemento`),
  ADD KEY `fk_unidadMedida_elemento` (`fk_unidadMedida`),
  ADD KEY `fk_categoria_elemento` (`fk_categoria`),
  ADD KEY `fk_tipoEmpaque_elemento` (`fk_tipoEmpaque`),
  ADD KEY `fk_detalleUbicacion_elemento` (`fk_detalleUbicacion`);

--
-- Indices de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD PRIMARY KEY (`Codigo_movimiento`),
  ADD KEY `fk_usuario_movimiento` (`Usuario_solicitud`),
  ADD KEY `fk_tipo_movimiento` (`fk_movimiento`);

--
-- Indices de la tabla `tipo_elemento`
--
ALTER TABLE `tipo_elemento`
  ADD PRIMARY KEY (`codigo_Tipo`);

--
-- Indices de la tabla `tipo_empaque`
--
ALTER TABLE `tipo_empaque`
  ADD PRIMARY KEY (`codigo_Empaque`);

--
-- Indices de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  ADD PRIMARY KEY (`codigo_tipo`);

--
-- Indices de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  ADD PRIMARY KEY (`codigo_medida`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bodega`
--
ALTER TABLE `bodega`
  MODIFY `codigo_Bodega` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categoria_elemento`
--
ALTER TABLE `categoria_elemento`
  MODIFY `codigo_Categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  MODIFY `codigo_detalle` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `detalle_ubicacion`
--
ALTER TABLE `detalle_ubicacion`
  MODIFY `codigo_Detalle` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `elemento`
--
ALTER TABLE `elemento`
  MODIFY `Codigo_elemento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  MODIFY `Codigo_movimiento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `tipo_elemento`
--
ALTER TABLE `tipo_elemento`
  MODIFY `codigo_Tipo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_empaque`
--
ALTER TABLE `tipo_empaque`
  MODIFY `codigo_Empaque` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  MODIFY `codigo_tipo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  MODIFY `codigo_medida` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  ADD CONSTRAINT `fk_elemento_detalle` FOREIGN KEY (`fk_elemento`) REFERENCES `elemento` (`Codigo_elemento`),
  ADD CONSTRAINT `fk_usuario_entrega_detalle` FOREIGN KEY (`Usuario_entrega`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `detalle_ubicacion`
--
ALTER TABLE `detalle_ubicacion`
  ADD CONSTRAINT `fk_bodega_detalleUbicacion` FOREIGN KEY (`fk_bodega`) REFERENCES `bodega` (`codigo_Bodega`);

--
-- Filtros para la tabla `elemento`
--
ALTER TABLE `elemento`
  ADD CONSTRAINT `fk_categoria_elemento` FOREIGN KEY (`fk_categoria`) REFERENCES `categoria_elemento` (`codigo_Categoria`),
  ADD CONSTRAINT `fk_detalleUbicacion_elemento` FOREIGN KEY (`fk_detalleUbicacion`) REFERENCES `detalle_ubicacion` (`codigo_Detalle`),
  ADD CONSTRAINT `fk_tipoElemento_elemento` FOREIGN KEY (`fk_tipoElemento`) REFERENCES `tipo_elemento` (`codigo_Tipo`),
  ADD CONSTRAINT `fk_tipoEmpaque_elemento` FOREIGN KEY (`fk_tipoEmpaque`) REFERENCES `tipo_empaque` (`codigo_Empaque`),
  ADD CONSTRAINT `fk_unidadMedida_elemento` FOREIGN KEY (`fk_unidadMedida`) REFERENCES `unidad_medida` (`codigo_medida`);

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `fk_tipo_movimiento` FOREIGN KEY (`fk_movimiento`) REFERENCES `tipo_movimiento` (`codigo_tipo`),
  ADD CONSTRAINT `fk_usuario_movimiento` FOREIGN KEY (`Usuario_solicitud`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
