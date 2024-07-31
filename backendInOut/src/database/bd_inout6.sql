-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 15-07-2024 a las 17:20:50
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
-- Base de datos: `bd_inout`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `batches`
--

CREATE TABLE `batches` (
  `batch_id` int NOT NULL,
  `element_id` int NOT NULL,
  `batch_serial` varchar(45) DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `expiration` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `batches`
--

INSERT INTO `batches` (`batch_id`, `element_id`, `batch_serial`, `quantity`, `expiration`, `created_at`, `updated_at`, `status`) VALUES
(270, 17, '17-1720571928458', 2, '2024-10-31 05:00:00', '2024-07-10 00:38:48', '2024-07-10 00:38:48', '1'),
(271, 15, '15-1720571943413', 0, NULL, '2024-07-10 00:39:03', '2024-07-10 00:39:03', '1'),
(272, 15, '15-1720571943421', 0, NULL, '2024-07-10 00:39:03', '2024-07-10 00:39:03', '1'),
(273, 15, '15-1720577939543', 0, NULL, '2024-07-10 02:18:59', '2024-07-10 02:18:59', '1'),
(274, 15, '15-1720577939554', 0, NULL, '2024-07-10 02:18:59', '2024-07-10 02:18:59', '1'),
(275, 16, '16-1720577948784', 0, NULL, '2024-07-10 02:19:08', '2024-07-10 02:19:08', '1'),
(276, 16, '16-1720577948790', 0, NULL, '2024-07-10 02:19:08', '2024-07-10 02:19:08', '1'),
(277, 15, '15-1720580701710', 0, NULL, '2024-07-10 03:05:01', '2024-07-10 03:05:01', '1'),
(278, 15, '15-1720580701721', 0, NULL, '2024-07-10 03:05:01', '2024-07-10 03:05:01', '1'),
(279, 16, '16-1720580711218', 0, NULL, '2024-07-10 03:05:11', '2024-07-10 03:05:11', '1'),
(280, 16, '16-1720580711227', 0, NULL, '2024-07-10 03:05:11', '2024-07-10 03:05:11', '1'),
(281, 19, '19-1720616665535', 19, '2024-07-15 05:00:00', '2024-07-10 13:04:25', '2024-07-10 13:04:25', '1'),
(282, 18, '18-1720616834186', 5, '2024-07-18 05:00:00', '2024-07-10 13:07:14', '2024-07-10 13:07:14', '1'),
(283, 20, '20-1720617583138', 5, '2024-10-25 05:00:00', '2024-07-10 13:19:43', '2024-07-10 13:19:43', '1'),
(284, 15, '15-1720624215273', 0, NULL, '2024-07-10 15:10:15', '2024-07-10 15:10:15', '1'),
(285, 15, '15-1720624215285', 0, NULL, '2024-07-10 15:10:15', '2024-07-10 15:10:15', '1'),
(286, 21, '21-1720811001893', 7, '2024-07-31 05:00:00', '2024-07-12 19:03:21', '2024-07-12 19:03:21', '1'),
(287, 245, '245-1720832232176', 1, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(288, 245, '245-1720832232179', 1, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(289, 245, '245-1720832232181', 1, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(290, 245, '245-1720832232183', 1, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(291, 244, '244-1720923751116', 6, '2024-07-31 05:00:00', '2024-07-14 02:22:31', '2024-07-14 02:22:31', '1');

--
-- Disparadores `batches`
--
DELIMITER $$
CREATE TRIGGER `update_dateexpired_counters` AFTER UPDATE ON `batches` FOR EACH ROW BEGIN
    UPDATE counters 
    SET count = (
        SELECT COUNT(DISTINCT e.element_id)
        FROM batches b
        INNER JOIN elements e ON b.element_id = e.element_id
        INNER JOIN batch_location_infos bl ON b.batch_id = bl.batch_id
        WHERE b.expiration IS NOT NULL
        AND (b.expiration <= CURRENT_DATE()
            OR b.expiration BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY))
        AND bl.quantity >= 1
    )
    WHERE counter_name = 'date_expired';
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `batch_location_infos`
--

CREATE TABLE `batch_location_infos` (
  `batchLocationInfo_id` int NOT NULL,
  `batch_id` int NOT NULL,
  `warehouseLocation_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `batch_location_infos`
--

INSERT INTO `batch_location_infos` (`batchLocationInfo_id`, `batch_id`, `warehouseLocation_id`, `quantity`, `created_at`, `updated_at`, `status`) VALUES
(276, 270, 10, 2, '2024-07-10 00:38:48', '2024-07-10 00:38:48', '1'),
(277, 271, 10, 0, '2024-07-10 00:39:03', '2024-07-10 00:39:03', '1'),
(278, 272, 10, 0, '2024-07-10 00:39:03', '2024-07-10 00:39:03', '1'),
(279, 273, 10, 0, '2024-07-10 02:18:59', '2024-07-10 02:18:59', '1'),
(280, 274, 10, 0, '2024-07-10 02:18:59', '2024-07-10 02:18:59', '1'),
(281, 275, 10, 1, '2024-07-10 02:19:08', '2024-07-10 02:19:08', '1'),
(282, 276, 10, 0, '2024-07-10 02:19:08', '2024-07-10 02:19:08', '1'),
(283, 277, 10, 0, '2024-07-10 03:05:01', '2024-07-10 03:05:01', '1'),
(284, 278, 10, 0, '2024-07-10 03:05:01', '2024-07-10 03:05:01', '1'),
(285, 279, 10, 0, '2024-07-10 03:05:11', '2024-07-10 03:05:11', '1'),
(286, 280, 10, 0, '2024-07-10 03:05:11', '2024-07-10 03:05:11', '1'),
(287, 281, 10, 19, '2024-07-10 13:04:25', '2024-07-10 13:04:25', '1'),
(288, 282, 10, 5, '2024-07-10 13:07:14', '2024-07-10 13:07:14', '1'),
(289, 283, 10, 5, '2024-07-10 13:19:43', '2024-07-10 13:19:43', '1'),
(290, 284, 10, 0, '2024-07-10 15:10:15', '2024-07-10 15:10:15', '1'),
(291, 285, 10, 0, '2024-07-10 15:10:15', '2024-07-10 15:10:15', '1'),
(292, 286, 12, 7, '2024-07-12 19:03:21', '2024-07-12 19:03:21', '1'),
(293, 287, 11, 1, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(294, 288, 11, 1, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(295, 289, 11, 1, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(296, 290, 11, 1, '2024-07-13 00:57:12', '2024-07-13 00:57:12', '1'),
(297, 291, 12, 6, '2024-07-14 02:22:31', '2024-07-14 02:22:31', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('activo','inactivo') NOT NULL DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(11, 'Electronico', '2024-07-10 00:28:22', '2024-07-10 00:28:22', 'activo'),
(12, 'Construccion', '2024-07-10 00:28:30', '2024-07-10 00:28:30', 'activo'),
(13, 'Electrico', '2024-07-10 00:28:38', '2024-07-10 00:28:38', 'activo'),
(14, 'Tecnologico', '2024-07-10 00:28:45', '2024-07-10 00:28:45', 'activo'),
(15, 'Quimico', '2024-07-10 00:29:02', '2024-07-10 00:29:02', 'activo'),
(16, 'Agropecuario', '2024-07-10 00:29:10', '2024-07-10 00:29:10', 'activo'),
(17, 'Aseo', '2024-07-10 00:34:51', '2024-07-10 00:34:51', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `counters`
--

CREATE TABLE `counters` (
  `id` bigint UNSIGNED NOT NULL,
  `counter_name` varchar(50) NOT NULL,
  `count` int NOT NULL DEFAULT '0',
  `status` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `counters`
--

INSERT INTO `counters` (`id`, `counter_name`, `count`, `status`) VALUES
(1, 'low_stock', 12, 0),
(2, 'loans_due', 5, 0),
(3, 'date_expired', 2, 0),
(4, 'requesteds', 4, 0);

--
-- Disparadores `counters`
--
DELIMITER $$
CREATE TRIGGER `before_status_update` BEFORE UPDATE ON `counters` FOR EACH ROW BEGIN
  IF NEW.count <> OLD.count THEN
    SET NEW.status = 1;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elements`
--

CREATE TABLE `elements` (
  `element_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `stock` int DEFAULT '0',
  `elementType_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `measurementUnit_id` int DEFAULT NULL,
  `packageType_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `elements`
--

INSERT INTO `elements` (`element_id`, `name`, `stock`, `elementType_id`, `category_id`, `measurementUnit_id`, `packageType_id`, `created_at`, `updated_at`, `status`) VALUES
(15, 'Motosierra', 0, 2, 11, 8, 1, '2024-07-10 00:33:28', '2024-07-12 19:06:32', '0'),
(16, 'Topografo', 0, 2, 11, 8, 1, '2024-07-10 00:33:58', '2024-07-10 20:03:40', '0'),
(17, 'Cemento', 2, 1, 12, 1, 2, '2024-07-10 00:34:15', '2024-07-10 00:34:15', '1'),
(18, 'Jabon', 5, 1, 17, 8, 1, '2024-07-10 00:35:08', '2024-07-12 19:06:51', '1'),
(19, 'Pintura', 9, 1, 12, 13, 1, '2024-07-10 13:02:27', '2024-07-10 13:02:27', '1'),
(20, 'Puntillas', 5, 1, 12, 14, 3, '2024-07-10 13:18:20', '2024-07-10 13:18:20', '1'),
(21, 'Manzana', 7, 1, 17, 2, 2, '2024-07-12 18:47:10', '2024-07-12 18:47:10', '1'),
(22, 'Detergente en polvo', 0, 1, 17, 10, 4, '2024-07-12 22:31:18', '2024-07-12 22:31:18', '1'),
(23, 'Lampara', 0, 2, 15, 13, 2, '2024-07-12 22:31:18', '2024-07-12 22:31:18', '1'),
(243, 'Manzana1', 0, 1, 11, 1, 1, '2024-07-12 23:29:45', '2024-07-12 23:29:45', '1'),
(244, 'Manzana11', 6, 1, 12, 3, 2, '2024-07-12 23:29:58', '2024-07-12 23:29:58', '1'),
(245, 'Cravana', 4, 2, 14, 2, 3, '2024-07-12 23:30:15', '2024-07-12 23:30:15', '1'),
(246, 'Cravana1', 0, 2, 13, 2, 3, '2024-07-12 23:30:24', '2024-07-12 23:30:24', '1'),
(247, 'Cravana12', 0, 1, 13, 4, 2, '2024-07-12 23:30:35', '2024-07-12 23:30:35', '1');

--
-- Disparadores `elements`
--
DELIMITER $$
CREATE TRIGGER `before_element_update` BEFORE UPDATE ON `elements` FOR EACH ROW BEGIN
	IF NEW.status <> OLD.status THEN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_counters_on_lowstock` AFTER UPDATE ON `elements` FOR EACH ROW BEGIN
    DECLARE stock_value INT;
    DECLARE old_stock_value INT;

    SET stock_value = NEW.stock;
    SET old_stock_value = OLD.stock;

    IF stock_value < 10 AND old_stock_value >= 10 THEN
        UPDATE counters SET count = count + 1 WHERE counter_name = 'low_stock';
    ELSEIF stock_value >= 10 AND old_stock_value < 10 THEN
        UPDATE counters SET count = count - 1 WHERE counter_name = 'low_stock';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `element_types`
--

CREATE TABLE `element_types` (
  `elementType_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `element_types`
--

INSERT INTO `element_types` (`elementType_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Consumible', '2024-06-30 21:18:41', '2024-06-30 21:18:41', '1'),
(2, 'Devolutivo', '2024-06-30 21:18:41', '2024-06-30 21:18:41', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loan_statuses`
--

CREATE TABLE `loan_statuses` (
  `loanStatus_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `loan_statuses`
--

INSERT INTO `loan_statuses` (`loanStatus_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Solicitado', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(2, 'En revisión', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(3, 'Aceptado', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(4, 'Rechazado', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(5, 'En préstamo', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(6, 'Completado', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(7, 'Cancelado', '2024-06-30 21:17:05', '2024-06-30 21:17:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `measurement_units`
--

CREATE TABLE `measurement_units` (
  `measurementUnit_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `measurement_units`
--

INSERT INTO `measurement_units` (`measurementUnit_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Kilogramo', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(2, 'Gramo', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(3, 'Litro', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(4, 'Millilitro', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(5, 'Metro', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(6, 'Centimetro', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(7, 'Millimeter', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(8, 'Pieza', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(9, 'Caja', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(10, 'Paquete', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(12, 'Galón', '2024-07-10 12:58:31', '2024-07-10 12:58:31', '1'),
(13, 'Centimetro cubico', '2024-07-10 12:59:02', '2024-07-10 12:59:02', '1'),
(14, 'Bodega a', '2024-07-10 13:17:49', '2024-07-10 13:17:49', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movements`
--

CREATE TABLE `movements` (
  `movement_id` int NOT NULL,
  `movementType_id` int NOT NULL,
  `user_manager` int DEFAULT NULL,
  `user_application` int DEFAULT NULL,
  `user_receiving` int DEFAULT NULL,
  `user_returning` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estimated_return` timestamp NULL DEFAULT NULL,
  `actual_return` timestamp NULL DEFAULT NULL,
  `movementLoan_status` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `movements`
--

INSERT INTO `movements` (`movement_id`, `movementType_id`, `user_manager`, `user_application`, `user_receiving`, `user_returning`, `created_at`, `updated_at`, `estimated_return`, `actual_return`, `movementLoan_status`) VALUES
(216, 2, 1, 1, NULL, NULL, '2024-06-10 00:38:48', '2024-07-10 00:38:48', NULL, NULL, 1),
(217, 1, 1, 1, NULL, NULL, '2024-07-10 00:39:03', '2024-07-10 00:39:03', NULL, NULL, NULL),
(218, 2, 1, 1, NULL, NULL, '2024-06-10 00:42:30', '2024-07-10 00:42:30', NULL, NULL, NULL),
(219, 2, 1, 1, NULL, NULL, '2024-07-10 00:43:04', '2024-07-10 00:43:04', NULL, NULL, NULL),
(220, 4, 1, 1, NULL, NULL, '2024-07-10 01:03:59', '2024-07-10 03:08:47', '2024-07-14 05:00:00', NULL, 5),
(223, 1, 1, 1, NULL, NULL, '2024-07-10 02:18:59', '2024-07-10 02:18:59', NULL, NULL, NULL),
(224, 1, 1, 1, NULL, NULL, '2024-07-10 02:19:08', '2024-07-10 02:19:08', NULL, NULL, NULL),
(225, 4, 1, 2, NULL, NULL, '2024-07-10 02:19:35', '2024-07-10 03:08:43', '2024-07-10 05:00:00', NULL, 5),
(227, 4, 1, 2, NULL, NULL, '2024-07-10 02:24:33', '2024-07-10 03:08:31', '2024-07-25 05:00:00', NULL, 5),
(232, 1, 1, 1, NULL, NULL, '2024-07-10 03:05:01', '2024-07-10 03:05:01', NULL, NULL, NULL),
(233, 1, 1, 1, NULL, NULL, '2024-07-10 03:05:11', '2024-07-10 03:05:11', NULL, NULL, NULL),
(234, 4, 1, 2, NULL, NULL, '2024-07-10 03:05:37', '2024-07-10 03:05:42', '2024-07-27 05:00:00', NULL, 1),
(235, 1, 1, 1, NULL, NULL, '2024-07-10 13:04:25', '2024-07-10 13:04:25', NULL, NULL, NULL),
(236, 1, 1, 1, NULL, NULL, '2024-07-10 13:07:14', '2024-07-10 13:07:14', NULL, NULL, NULL),
(238, 4, 1, 2, NULL, NULL, '2024-06-10 13:15:50', '2024-07-10 13:15:59', '2024-07-10 05:00:00', NULL, 1),
(239, 1, 1, 1, NULL, NULL, '2024-07-10 13:19:43', '2024-07-10 13:19:43', NULL, NULL, NULL),
(240, 1, 1, 1, NULL, NULL, '2024-07-10 15:10:15', '2024-07-10 15:10:15', NULL, NULL, NULL),
(241, 4, NULL, 1, NULL, NULL, '2024-07-10 15:10:39', '2024-07-10 15:10:39', '2024-07-19 05:00:00', NULL, 7),
(243, 4, 1, 2, NULL, NULL, '2024-06-09 16:42:28', '2024-07-09 16:42:33', '2024-07-07 05:00:00', NULL, 5),
(245, 1, 4557, 4557, NULL, NULL, '2024-07-12 19:03:21', '2024-07-12 19:03:21', NULL, NULL, NULL),
(246, 2, 4557, 4557, NULL, NULL, '2024-07-12 19:08:02', '2024-07-12 19:08:02', NULL, NULL, NULL),
(247, 1, 4558, 4558, NULL, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12', NULL, NULL, NULL),
(248, 1, 4558, 4558, NULL, NULL, '2024-07-14 02:22:31', '2024-07-14 02:22:31', NULL, NULL, NULL),
(249, 4, 4558, 4558, NULL, NULL, '2024-07-14 02:23:28', '2024-07-14 02:23:28', '2024-07-14 19:47:43', NULL, 1);

--
-- Disparadores `movements`
--
DELIMITER $$
CREATE TRIGGER `movements_BEFORE_INSERT` BEFORE INSERT ON `movements` FOR EACH ROW BEGIN
	IF NEW.movementType_id = 4 AND NEW.movementLoan_status IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo movementLoan_status no puede ser nulo para préstamos';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `movements_BEFORE_UPDATE` BEFORE UPDATE ON `movements` FOR EACH ROW BEGIN
	IF NEW.movementType_id = 4 AND NEW.movementLoan_status IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo movementLoan_status no puede ser nulo para préstamos';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_loans_counters` AFTER UPDATE ON `movements` FOR EACH ROW BEGIN
    IF NEW.estimated_return < CURDATE() THEN  
    UPDATE counters SET count = count + 1 WHERE counter_name = 'loans_due';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_requesteds_counters` AFTER INSERT ON `movements` FOR EACH ROW BEGIN
    IF NEW.movementLoan_status = '1' THEN
        UPDATE counters SET count = count + 1 WHERE counter_name = 'requesteds';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movement_details`
--

CREATE TABLE `movement_details` (
  `movementDetail_id` int NOT NULL,
  `movement_id` int NOT NULL,
  `element_id` int NOT NULL,
  `batch_id` int DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `remarks` text,
  `user_receiving` int DEFAULT NULL,
  `user_returning` int DEFAULT NULL,
  `loanStatus_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `movement_details`
--

INSERT INTO `movement_details` (`movementDetail_id`, `movement_id`, `element_id`, `batch_id`, `quantity`, `remarks`, `user_receiving`, `user_returning`, `loanStatus_id`, `created_at`, `updated_at`) VALUES
(346, 216, 17, 270, 4, NULL, NULL, NULL, NULL, '2024-07-10 00:38:48', '2024-07-10 00:38:48'),
(347, 217, 15, 271, 1, NULL, NULL, NULL, NULL, '2024-07-10 00:39:03', '2024-07-10 00:39:03'),
(348, 217, 15, 272, 1, NULL, NULL, NULL, NULL, '2024-07-10 00:39:03', '2024-07-10 00:39:03'),
(349, 218, 15, 271, 1, 'Dado de baja', NULL, NULL, NULL, '2024-07-10 00:42:30', '2024-07-10 00:42:30'),
(350, 219, 17, 270, 2, 'Asignado al salón 334', NULL, NULL, NULL, '2024-07-10 00:43:04', '2024-07-10 00:43:04'),
(351, 220, 15, 272, 1, 'En revisión ', NULL, NULL, 2, '2024-07-10 01:03:59', '2024-07-10 03:08:47'),
(352, 223, 15, 273, 1, NULL, NULL, NULL, NULL, '2024-07-10 02:18:59', '2024-07-10 02:18:59'),
(353, 223, 15, 274, 1, NULL, NULL, NULL, NULL, '2024-07-10 02:18:59', '2024-07-10 02:18:59'),
(354, 224, 16, 275, 1, NULL, NULL, NULL, NULL, '2024-07-10 02:19:08', '2024-07-10 02:19:08'),
(355, 224, 16, 276, 1, NULL, NULL, NULL, NULL, '2024-07-10 02:19:08', '2024-07-10 02:19:08'),
(356, 225, 15, 273, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 02:19:35', '2024-07-10 03:08:43'),
(357, 225, 16, 275, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 02:19:35', '2024-07-10 03:08:43'),
(358, 227, 15, 274, 1, 'En revisión Asignado al salón 334', NULL, NULL, 2, '2024-07-10 02:24:33', '2024-07-10 03:08:31'),
(359, 227, 16, 276, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 02:24:33', '2024-07-10 03:08:31'),
(360, 232, 15, 277, 1, NULL, NULL, NULL, NULL, '2024-07-10 03:05:01', '2024-07-10 03:05:01'),
(361, 232, 15, 278, 1, NULL, NULL, NULL, NULL, '2024-07-10 03:05:01', '2024-07-10 03:05:01'),
(362, 233, 16, 279, 1, NULL, NULL, NULL, NULL, '2024-07-10 03:05:11', '2024-07-10 03:05:11'),
(363, 233, 16, 280, 1, NULL, NULL, NULL, NULL, '2024-07-10 03:05:11', '2024-07-10 03:05:11'),
(364, 234, 16, 279, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 03:05:37', '2024-07-10 03:05:42'),
(365, 234, 15, 277, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 03:05:37', '2024-07-10 03:05:42'),
(366, 235, 19, 281, 19, NULL, NULL, NULL, NULL, '2024-07-10 13:04:25', '2024-07-10 13:04:25'),
(367, 236, 18, 282, 5, NULL, NULL, NULL, NULL, '2024-07-10 13:07:14', '2024-07-10 13:07:14'),
(368, 238, 15, 278, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 13:15:50', '2024-07-10 13:15:59'),
(369, 238, 16, 280, 1, 'En revisión', NULL, NULL, 5, '2024-07-10 13:15:50', '2024-07-10 13:15:59'),
(370, 239, 20, 283, 5, NULL, NULL, NULL, NULL, '2024-07-10 13:19:43', '2024-07-10 13:19:43'),
(371, 240, 15, 284, 1, NULL, NULL, NULL, NULL, '2024-07-10 15:10:15', '2024-07-10 15:10:15'),
(372, 240, 15, 285, 1, NULL, NULL, NULL, NULL, '2024-07-10 15:10:15', '2024-07-10 15:10:15'),
(373, 241, 15, 284, 1, 'Pruaba bkdfjnsrkjfa', NULL, NULL, 1, '2024-07-10 15:10:39', '2024-07-10 15:10:39'),
(374, 243, 15, 285, 1, 'En revisión', NULL, NULL, 2, '2024-07-10 16:42:28', '2024-07-10 16:42:33'),
(375, 245, 21, 286, 9, NULL, NULL, NULL, NULL, '2024-07-12 19:03:21', '2024-07-12 19:03:21'),
(376, 246, 21, 286, 2, 'Nutricion', NULL, NULL, NULL, '2024-07-12 19:08:02', '2024-07-12 19:08:02'),
(377, 247, 245, 287, 1, NULL, NULL, NULL, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12'),
(378, 247, 245, 288, 1, NULL, NULL, NULL, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12'),
(379, 247, 245, 289, 1, NULL, NULL, NULL, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12'),
(380, 247, 245, 290, 1, NULL, NULL, NULL, NULL, '2024-07-13 00:57:12', '2024-07-13 00:57:12'),
(381, 248, 244, 291, 15, NULL, NULL, NULL, NULL, '2024-07-14 02:22:31', '2024-07-14 02:22:31'),
(382, 249, 244, 291, 9, NULL, NULL, NULL, NULL, '2024-07-14 02:23:28', '2024-07-14 02:23:28');

--
-- Disparadores `movement_details`
--
DELIMITER $$
CREATE TRIGGER `movement_details_BEFORE_INSERT` BEFORE INSERT ON `movement_details` FOR EACH ROW BEGIN
	DECLARE v_movementType_id INT;

    -- Obtener el movementType_id correspondiente al movement_id proporcionado
    SELECT movementType_id INTO v_movementType_id
    FROM movements
    WHERE movement_id = NEW.movement_id;

    -- Verificar si el movementType_id es 3 y si loanStatus_id es NULL
    IF v_movementType_id = 3 AND NEW.loanStatus_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El campo loanStatus_id no puede ser nulo para préstamos';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `movement_details_BEFORE_UPDATE` BEFORE UPDATE ON `movement_details` FOR EACH ROW BEGIN
	DECLARE v_movementType_id INT;

    -- Obtener el movementType_id correspondiente al movement_id proporcionado
    SELECT movementType_id INTO v_movementType_id
    FROM movements
    WHERE movement_id = NEW.movement_id;

    -- Verificar si el movementType_id es 3 y si loanStatus_id es NULL
    IF v_movementType_id = 3 AND NEW.loanStatus_id IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El campo loanStatus_id no puede ser nulo para préstamos';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movement_types`
--

CREATE TABLE `movement_types` (
  `movementType_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `movement_types`
--

INSERT INTO `movement_types` (`movementType_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'ingreso', '2024-06-30 21:13:47', '2024-06-30 21:13:47', '1'),
(2, 'salida', '2024-06-30 21:13:47', '2024-06-30 21:13:47', '1'),
(3, 'tranfer', '2024-06-30 21:13:47', '2024-06-30 21:13:47', '1'),
(4, 'prestamo', '2024-06-30 21:13:47', '2024-06-30 21:13:47', '1'),
(5, 'return', '2024-06-30 21:13:47', '2024-06-30 21:13:47', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `package_types`
--

CREATE TABLE `package_types` (
  `packageType_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `package_types`
--

INSERT INTO `package_types` (`packageType_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'None', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(2, 'Bolsa', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(3, 'Tula', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(4, 'Caja', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `positions`
--

CREATE TABLE `positions` (
  `position_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `positions`
--

INSERT INTO `positions` (`position_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'aprendiz', '2024-06-29 02:58:43', '2024-06-29 02:58:43', '1'),
(2, 'instructor', '2024-06-29 02:58:43', '2024-06-29 02:58:43', '1'),
(3, 'operario', '2024-06-29 02:58:43', '2024-06-29 02:58:43', '1'),
(4, 'coordinador', '2024-06-29 02:58:43', '2024-06-29 02:58:43', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'administrador', '2024-06-29 02:48:44', '2024-06-29 02:53:03', '1'),
(2, 'encargado', '2024-06-29 02:49:29', '2024-06-29 02:49:29', '1'),
(3, 'general', '2024-06-29 20:18:50', '2024-06-29 20:18:50', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `phone` varchar(45) DEFAULT 'Not phone',
  `email` varchar(45) NOT NULL,
  `password` varchar(80) NOT NULL,
  `identification` varchar(45) NOT NULL,
  `role_id` int NOT NULL,
  `position_id` int NOT NULL,
  `course_id` int DEFAULT NULL,
  `creation_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `name`, `lastname`, `phone`, `email`, `password`, `identification`, `role_id`, `position_id`, `course_id`, `creation_at`, `update_at`, `status`) VALUES
(1, 'cristian', 'giron', 'Not phone', 'cf.giron04@gmail.com', '$2b$12$TvXklvgNmCBxjfvXdMTl.OeY677W7OCWGON0FF/XAij5ZGAaLHXie', '1033815529', 1, 2, NULL, '2024-06-29 20:14:50', '2024-06-29 20:14:50', '1'),
(2, 'Juan', 'Perez', '123456789', 'juan@example.com', '$2a$10$6aI8J5oU49s4C/QBDn/O3u9cqSasLJzNKTzkVd8gB8eR/cTegwQG6', '123ABC', 1, 1, 2644590, '2024-07-11 21:34:02', '2024-07-10 21:34:02', '1'),
(3, 'María', 'González', '987654321', 'maria@example.com', '$2a$10$0sYB9P.gXHE7s7q1m/wAfeJ8nJ8AgIRXeEL66e3KNiGbsz0fRKO2G', '456DEF', 2, 2, NULL, '2024-06-30 21:34:02', '2024-06-30 21:34:02', '1'),
(4, 'Pedro', 'López', '555555555', 'pedro@example.com', '$2a$10$0zqMzTmFNPSYR7vFFQCHW.wXrSdUOknhDQaS8uZfZhizQnDkX2IXy', '789GHI', 1, 3, NULL, '2024-06-30 21:34:02', '2024-06-30 21:34:02', '1'),
(12, 'johan', 'perdomo', '132145', 'johanperdomo109@gmail.com', '$2b$10$xgQZdVipR2o5cbLirnD8u.GlOecZHXQFuwOCa6/oZY3J0E8jqSL4m', '131355452', 1, 1, 4522, '2024-07-04 16:03:19', '2024-07-04 16:03:19', '1'),
(52, 'Feliz', 'Jimenex', '44355', 'iohjhug@gmail.com', '$2b$10$of7ZEum7TyHNehzubSMqQ.WzkQngP1gAwUI/36ADK4SOt6Jcy73wy', '555', 1, 1, 864747, '2024-07-04 15:53:24', '2024-07-04 15:53:24', '1'),
(465, 'Johan', 'Stiven', '132145', 'johanperdomo@gmail.com', '$2b$10$sMuOwLLdNpr3r8fWuO/cBu7TmVTMnIZd73TcVDdgTS2o2Q4OCzGoS', '4554', 2, 2, NULL, '2024-07-04 16:05:10', '2024-07-04 16:05:10', '1'),
(3333, 'Brayan', 'Gomez', '5645', 'ijjj@gmail.com', '$2b$10$DE8d2GIgEwz/oYZp9Nbd5ucnIRoc6L3h67Lmx960RLgtAMxBjbMmW', '5665', 2, 2, NULL, '2024-07-04 15:57:13', '2024-07-04 15:57:13', '0'),
(4554, 'simon', 'Brand', '45544', 'johano109@gmail.com', '$2b$10$gP8saM9V8TsneJkbuEy9o.VrKOyONXEEOua4wN9uhLsmJpei7Zgtm', '455888', 2, 1, 5345, '2024-07-04 16:05:58', '2024-07-04 16:05:58', '1'),
(4557, 'John', 'Hamut', '3216549871', 'sen3@gmail.com', '101010', '123458', 1, 4, NULL, '2024-07-12 19:02:35', '2024-07-12 19:02:35', '1'),
(4558, 'Yber', 'Coronell', '3216549878', 'g@gmail.com', '101010', '123456', 1, 4, NULL, '2024-07-12 23:51:34', '2024-07-12 23:51:34', '1'),
(4559, 'Yber', 'Coronel', '3216547174', 'coronelyber3@gmail.com', '$2b$10$rQZwet.Rw8N3gA/2Crt5Xea137JddIqDUE599O6.r10Brgb4HILEi', '123123', 1, 4, NULL, '2024-07-15 12:27:02', '2024-07-15 12:27:02', '1');

--
-- Disparadores `users`
--
DELIMITER $$
CREATE TRIGGER `users_BEFORE_INSERT` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
	IF NEW.position_id = 1 AND NEW.course_id IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo course_id no puede ser nulo para aprendices';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `users_BEFORE_UPDATE` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
	IF NEW.position_id = 1 AND NEW.course_id IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo course_id no puede ser nulo para aprendices';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warehouses`
--

CREATE TABLE `warehouses` (
  `warehouse_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `warehouses`
--

INSERT INTO `warehouses` (`warehouse_id`, `name`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Warehouse A', '2024-06-30 21:24:35', '2024-06-30 21:24:35', '1'),
(2, 'Warehouse B', '2024-06-30 21:24:35', '2024-06-30 21:24:35', '1'),
(3, 'Warehouse C', '2024-06-30 21:24:35', '2024-06-30 21:24:35', '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `warehouse_locations`
--

CREATE TABLE `warehouse_locations` (
  `warehouseLocation_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `warehouse_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `warehouse_locations`
--

INSERT INTO `warehouse_locations` (`warehouseLocation_id`, `name`, `warehouse_id`, `created_at`, `updated_at`, `status`) VALUES
(10, 'Estante A', 1, '2024-07-09 00:19:01', '2024-07-09 00:19:01', '1'),
(11, 'Estante q', 3, '2024-07-12 18:52:19', '2024-07-12 18:52:19', '1'),
(12, 'Estante 5', 2, '2024-07-12 18:52:37', '2024-07-12 18:52:37', '1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`batch_id`),
  ADD UNIQUE KEY `batch_serial_UNIQUE` (`batch_serial`),
  ADD KEY `fk_batch_element_idx` (`element_id`);

--
-- Indices de la tabla `batch_location_infos`
--
ALTER TABLE `batch_location_infos`
  ADD PRIMARY KEY (`batchLocationInfo_id`),
  ADD KEY `fk_batch_warehouseLocation_idx` (`warehouseLocation_id`),
  ADD KEY `fk_batch_location_idx` (`batch_id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `counters`
--
ALTER TABLE `counters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `counter_name` (`counter_name`);

--
-- Indices de la tabla `elements`
--
ALTER TABLE `elements`
  ADD PRIMARY KEY (`element_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD KEY `fk_element_type_idx` (`elementType_id`),
  ADD KEY `fk_element_category_idx` (`category_id`),
  ADD KEY `fk_element_unit_idx` (`measurementUnit_id`),
  ADD KEY `fk_element_package_idx` (`packageType_id`);

--
-- Indices de la tabla `element_types`
--
ALTER TABLE `element_types`
  ADD PRIMARY KEY (`elementType_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `loan_statuses`
--
ALTER TABLE `loan_statuses`
  ADD PRIMARY KEY (`loanStatus_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `measurement_units`
--
ALTER TABLE `measurement_units`
  ADD PRIMARY KEY (`measurementUnit_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `movements`
--
ALTER TABLE `movements`
  ADD PRIMARY KEY (`movement_id`),
  ADD KEY `fk_movement_loanstatus_idx` (`movementLoan_status`),
  ADD KEY `fk_mevement_type_idx` (`movementType_id`),
  ADD KEY `fk_movement_usermanager` (`user_manager`),
  ADD KEY `fk_movement_userapplication_idx` (`user_application`),
  ADD KEY `fk_movement_userreceiving_idx` (`user_receiving`),
  ADD KEY `fk_movement_userreturning_idx` (`user_returning`);

--
-- Indices de la tabla `movement_details`
--
ALTER TABLE `movement_details`
  ADD PRIMARY KEY (`movementDetail_id`),
  ADD KEY `fk_movement_detail_idx` (`movement_id`),
  ADD KEY `fk_movement_element_idx` (`element_id`),
  ADD KEY `fk_movementdetail_loanstatus_idx` (`loanStatus_id`),
  ADD KEY `fk_mvementdetail_userreturning_idx` (`user_returning`),
  ADD KEY `fk_movementdetail_userreceiving` (`user_receiving`),
  ADD KEY `fk_movementdetail_batch_idx` (`batch_id`);

--
-- Indices de la tabla `movement_types`
--
ALTER TABLE `movement_types`
  ADD PRIMARY KEY (`movementType_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `package_types`
--
ALTER TABLE `package_types`
  ADD PRIMARY KEY (`packageType_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`position_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`) INVISIBLE,
  ADD UNIQUE KEY `identification_UNIQUE` (`identification`),
  ADD KEY `role_id_idx` (`role_id`) INVISIBLE,
  ADD KEY `fk_position_user_idx` (`position_id`);

--
-- Indices de la tabla `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`warehouse_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `warehouse_locations`
--
ALTER TABLE `warehouse_locations`
  ADD PRIMARY KEY (`warehouseLocation_id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD KEY `fk_warehouse_location_idx` (`warehouse_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `batches`
--
ALTER TABLE `batches`
  MODIFY `batch_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=292;

--
-- AUTO_INCREMENT de la tabla `batch_location_infos`
--
ALTER TABLE `batch_location_infos`
  MODIFY `batchLocationInfo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=298;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `counters`
--
ALTER TABLE `counters`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `elements`
--
ALTER TABLE `elements`
  MODIFY `element_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=248;

--
-- AUTO_INCREMENT de la tabla `element_types`
--
ALTER TABLE `element_types`
  MODIFY `elementType_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `loan_statuses`
--
ALTER TABLE `loan_statuses`
  MODIFY `loanStatus_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `measurement_units`
--
ALTER TABLE `measurement_units`
  MODIFY `measurementUnit_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `movements`
--
ALTER TABLE `movements`
  MODIFY `movement_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=250;

--
-- AUTO_INCREMENT de la tabla `movement_details`
--
ALTER TABLE `movement_details`
  MODIFY `movementDetail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=383;

--
-- AUTO_INCREMENT de la tabla `movement_types`
--
ALTER TABLE `movement_types`
  MODIFY `movementType_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `package_types`
--
ALTER TABLE `package_types`
  MODIFY `packageType_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `positions`
--
ALTER TABLE `positions`
  MODIFY `position_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4560;

--
-- AUTO_INCREMENT de la tabla `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `warehouse_locations`
--
ALTER TABLE `warehouse_locations`
  MODIFY `warehouseLocation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `fk_batch_element` FOREIGN KEY (`element_id`) REFERENCES `elements` (`element_id`);

--
-- Filtros para la tabla `batch_location_infos`
--
ALTER TABLE `batch_location_infos`
  ADD CONSTRAINT `fk_batch_location` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`),
  ADD CONSTRAINT `fk_batch_warehouseLocation` FOREIGN KEY (`warehouseLocation_id`) REFERENCES `warehouse_locations` (`warehouseLocation_id`);

--
-- Filtros para la tabla `elements`
--
ALTER TABLE `elements`
  ADD CONSTRAINT `fk_element_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_element_package` FOREIGN KEY (`packageType_id`) REFERENCES `package_types` (`packageType_id`),
  ADD CONSTRAINT `fk_element_type` FOREIGN KEY (`elementType_id`) REFERENCES `element_types` (`elementType_id`),
  ADD CONSTRAINT `fk_element_unit` FOREIGN KEY (`measurementUnit_id`) REFERENCES `measurement_units` (`measurementUnit_id`);

--
-- Filtros para la tabla `movements`
--
ALTER TABLE `movements`
  ADD CONSTRAINT `fk_movement_loanstatus` FOREIGN KEY (`movementLoan_status`) REFERENCES `loan_statuses` (`loanStatus_id`),
  ADD CONSTRAINT `fk_movement_type` FOREIGN KEY (`movementType_id`) REFERENCES `movement_types` (`movementType_id`),
  ADD CONSTRAINT `fk_movement_userapplication` FOREIGN KEY (`user_application`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_movement_usermanager` FOREIGN KEY (`user_manager`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_movement_userreceiving` FOREIGN KEY (`user_receiving`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_movement_userreturning` FOREIGN KEY (`user_returning`) REFERENCES `users` (`user_id`);

--
-- Filtros para la tabla `movement_details`
--
ALTER TABLE `movement_details`
  ADD CONSTRAINT `fk_movementdetail_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`),
  ADD CONSTRAINT `fk_movementdetail_element` FOREIGN KEY (`element_id`) REFERENCES `elements` (`element_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_movementdetail_loanstatus` FOREIGN KEY (`loanStatus_id`) REFERENCES `loan_statuses` (`loanStatus_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_movementdetail_movement` FOREIGN KEY (`movement_id`) REFERENCES `movements` (`movement_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_movementdetail_userreceiving` FOREIGN KEY (`user_receiving`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mvementdetail_userreturning` FOREIGN KEY (`user_returning`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_position_user` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_role_user` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `warehouse_locations`
--
ALTER TABLE `warehouse_locations`
  ADD CONSTRAINT `fk_warehouse_location` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
