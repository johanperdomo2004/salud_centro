-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 25-07-2024 a las 21:43:46
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
-- Base de datos: `bd_inout3`
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
(1, 1, '1-1721433120874', 0, '2024-07-20 05:00:00', '2024-07-19 23:52:00', '2024-07-19 23:52:00', '1'),
(2, 2, '2-1721433209788', 1, NULL, '2024-07-19 23:53:29', '2024-07-19 23:53:29', '1'),
(3, 2, '2-1721433209799', 1, NULL, '2024-07-19 23:53:29', '2024-07-19 23:53:29', '1'),
(4, 1, '1-1721663817796', 0, '2024-07-31 05:00:00', '2024-07-22 15:56:57', '2024-07-22 15:56:57', '1'),
(5, 1, '1-1721663817806', 0, '2024-08-22 05:00:00', '2024-07-22 15:56:57', '2024-07-22 15:56:57', '1'),
(6, 2, '2-1721663956562', 1, NULL, '2024-07-22 15:59:16', '2024-07-22 15:59:16', '1'),
(7, 2, '2-1721663956571', 1, NULL, '2024-07-22 15:59:16', '2024-07-22 15:59:16', '1'),
(8, 2, '2-1721664900011', 1, NULL, '2024-07-22 16:15:00', '2024-07-22 16:15:00', '1'),
(9, 2, '2-1721664900021', 1, NULL, '2024-07-22 16:15:00', '2024-07-22 16:15:00', '1'),
(10, 1, '1-1721664900028', 0, '2024-07-31 05:00:00', '2024-07-22 16:15:00', '2024-07-22 16:15:00', '1'),
(11, 1, '1-1721665304514', 0, '2024-07-31 05:00:00', '2024-07-22 16:21:44', '2024-07-22 16:21:44', '1'),
(12, 2, '2-1721665304523', 1, NULL, '2024-07-22 16:21:44', '2024-07-22 16:21:44', '1'),
(13, 2, '2-1721665304530', 1, NULL, '2024-07-22 16:21:44', '2024-07-22 16:21:44', '1'),
(14, 1, '1-1721686746122', 2, '2024-07-27 05:00:00', '2024-07-22 22:19:06', '2024-07-22 22:19:06', '1'),
(15, 1, '1-1721686746133', 3, '2024-07-31 05:00:00', '2024-07-22 22:19:06', '2024-07-22 22:19:06', '1'),
(16, 1, '1-1721862904284', 4, '2025-01-26 05:00:00', '2024-07-24 23:15:04', '2024-07-24 23:15:04', '1'),
(17, 1, '1-1721862955503', 32, '2025-08-19 05:00:00', '2024-07-24 23:15:55', '2024-07-24 23:15:55', '1'),
(18, 3, '3-1721931751266', 7, '2024-07-26 05:00:00', '2024-07-25 18:22:31', '2024-07-25 18:22:31', '1'),
(19, 3, '3-1721931767669', 4, '2024-07-25 05:00:00', '2024-07-25 18:22:47', '2024-07-25 18:22:47', '1'),
(20, 4, '4-1721942364676', 40, '2027-06-24 05:00:00', '2024-07-25 21:19:24', '2024-07-25 21:19:24', '1'),
(21, 4, '4-1721943000656', 50, '2024-07-31 05:00:00', '2024-07-25 21:30:00', '2024-07-25 21:30:00', '1');

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
(1, 1, 1, 0, '2024-07-19 23:52:00', '2024-07-19 23:52:00', '1'),
(2, 2, 1, 1, '2024-07-19 23:53:29', '2024-07-19 23:53:29', '1'),
(3, 3, 1, 1, '2024-07-19 23:53:29', '2024-07-19 23:53:29', '1'),
(4, 4, 2, 0, '2024-07-22 15:56:57', '2024-07-22 15:56:57', '1'),
(5, 5, 2, 0, '2024-07-22 15:56:57', '2024-07-22 15:56:57', '1'),
(6, 6, 4, 1, '2024-07-22 15:59:16', '2024-07-22 15:59:16', '1'),
(7, 7, 4, 1, '2024-07-22 15:59:16', '2024-07-22 15:59:16', '1'),
(8, 8, 4, 1, '2024-07-22 16:15:00', '2024-07-22 16:15:00', '1'),
(9, 9, 4, 1, '2024-07-22 16:15:00', '2024-07-22 16:15:00', '1'),
(10, 10, 2, 0, '2024-07-22 16:15:00', '2024-07-22 16:15:00', '1'),
(11, 11, 2, 0, '2024-07-22 16:21:44', '2024-07-22 16:21:44', '1'),
(12, 12, 4, 1, '2024-07-22 16:21:44', '2024-07-22 16:21:44', '1'),
(13, 13, 4, 1, '2024-07-22 16:21:44', '2024-07-22 16:21:44', '1'),
(14, 14, 2, 2, '2024-07-22 22:19:06', '2024-07-22 22:19:06', '1'),
(15, 15, 2, 3, '2024-07-22 22:19:06', '2024-07-22 22:19:06', '1'),
(16, 16, 1, 4, '2024-07-24 23:15:04', '2024-07-24 23:15:04', '1'),
(17, 17, 2, 32, '2024-07-24 23:15:55', '2024-07-24 23:15:55', '1'),
(18, 18, 1, 7, '2024-07-25 18:22:31', '2024-07-25 18:22:31', '1'),
(19, 19, 2, 4, '2024-07-25 18:22:47', '2024-07-25 18:22:47', '1'),
(20, 20, 5, 40, '2024-07-25 21:19:24', '2024-07-25 21:19:24', '1'),
(21, 21, 5, 50, '2024-07-25 21:30:00', '2024-07-25 21:30:00', '1');

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
(1, 'Aseo', '2024-07-19 15:29:07', '2024-07-19 15:29:07', 'activo'),
(2, 'Construcción', '2024-07-22 14:46:54', '2024-07-22 14:46:54', 'activo'),
(3, 'Agricultura ', '2024-07-25 21:17:14', '2024-07-25 21:17:14', 'activo');

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
(1, 'low_stock', -3, 1),
(2, 'loans_due', 0, 1),
(3, 'date_expired', 3, 1),
(4, 'requesteds', 0, 0);

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
(1, 'Jabon', 41, 1, 1, 1, 1, '2024-07-19 23:51:35', '2024-07-19 23:51:35', '1'),
(2, 'Pala', 8, 2, 2, 1, 1, '2024-07-19 23:53:13', '2024-07-19 23:53:13', '1'),
(3, 'Shampoo', 11, 1, 1, 1, 1, '2024-07-25 18:22:09', '2024-07-25 18:22:09', '1'),
(4, 'Abono', 90, 1, 3, 1, 1, '2024-07-25 21:18:28', '2024-07-25 21:18:28', '1');

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
(1, 'gramo', '2024-07-19 15:29:14', '2024-07-19 15:29:14', '1');

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
(1, 1, 1, 1, NULL, NULL, '2024-07-19 23:52:00', '2024-07-19 23:52:00', NULL, NULL, NULL),
(2, 1, 1, 1, NULL, NULL, '2024-07-19 23:53:29', '2024-07-19 23:53:29', NULL, NULL, NULL),
(3, 4, 1, 3, 3, 3, '2024-07-19 23:53:51', '2024-07-22 14:47:27', '2024-07-20 22:00:00', '2024-07-22 14:47:27', 6),
(4, 2, 1, 1, NULL, NULL, '2024-07-19 23:54:38', '2024-07-19 23:54:38', NULL, NULL, NULL),
(5, 1, 1, 1, NULL, NULL, '2024-07-22 15:56:57', '2024-07-22 15:56:57', NULL, NULL, NULL),
(6, 2, 1, 3, NULL, NULL, '2024-07-22 15:58:23', '2024-07-22 15:58:23', NULL, NULL, NULL),
(7, 1, 1, 1, NULL, NULL, '2024-07-22 15:59:16', '2024-07-22 15:59:16', NULL, NULL, NULL),
(8, 1, 1, 1, NULL, NULL, '2024-07-22 16:15:00', '2024-07-22 16:15:00', NULL, NULL, NULL),
(9, 1, 1, 1, NULL, NULL, '2024-07-22 16:21:44', '2024-07-22 16:21:44', NULL, NULL, NULL),
(12, 2, 1, 3, NULL, NULL, '2024-07-22 16:25:14', '2024-07-22 16:25:14', NULL, NULL, NULL),
(13, 2, 1, 3, NULL, NULL, '2024-07-22 16:43:54', '2024-07-22 16:43:54', NULL, NULL, NULL),
(14, 1, 1, 1, NULL, NULL, '2024-07-22 22:19:06', '2024-07-22 22:19:06', NULL, NULL, NULL),
(15, 1, 1, 1, NULL, NULL, '2024-07-24 23:15:04', '2024-07-24 23:15:04', NULL, NULL, NULL),
(16, 1, 1, 1, NULL, NULL, '2024-07-24 23:15:55', '2024-07-24 23:15:55', NULL, NULL, NULL),
(17, 1, 1, 1, NULL, NULL, '2024-07-25 18:22:31', '2024-07-25 18:22:31', NULL, NULL, NULL),
(18, 1, 1, 1, NULL, NULL, '2024-07-25 18:22:47', '2024-07-25 18:22:47', NULL, NULL, NULL),
(19, 2, 1, 1, NULL, NULL, '2024-07-25 18:26:57', '2024-07-25 18:26:57', NULL, NULL, NULL),
(20, 4, 4, 1, 1, 4, '2024-07-24 18:56:39', '2024-07-25 21:32:05', '2024-07-24 22:00:00', '2024-07-25 21:32:05', 6),
(21, 1, 1, 1, NULL, NULL, '2024-07-25 21:19:24', '2024-07-25 21:19:24', NULL, NULL, NULL),
(23, 2, 1, 1, NULL, NULL, '2024-07-25 21:20:59', '2024-07-25 21:20:59', NULL, NULL, NULL),
(24, 2, 1, 1, NULL, NULL, '2024-07-25 21:23:16', '2024-07-25 21:23:16', NULL, NULL, NULL),
(25, 1, 1, 1, NULL, NULL, '2024-07-25 21:30:00', '2024-07-25 21:30:00', NULL, NULL, NULL);

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
(1, 1, 1, 1, 9, NULL, NULL, NULL, NULL, '2024-07-19 23:52:00', '2024-07-19 23:52:00'),
(2, 2, 2, 2, 1, NULL, NULL, NULL, NULL, '2024-07-19 23:53:29', '2024-07-19 23:53:29'),
(3, 2, 2, 3, 1, NULL, NULL, NULL, NULL, '2024-07-19 23:53:29', '2024-07-19 23:53:29'),
(4, 3, 2, 2, 1, NULL, 3, 3, 6, '2024-07-19 23:53:51', '2024-07-19 23:53:51'),
(5, 4, 1, 1, 3, NULL, NULL, NULL, NULL, '2024-07-19 23:54:39', '2024-07-19 23:54:39'),
(6, 5, 1, 4, 5, NULL, NULL, NULL, NULL, '2024-07-22 15:56:57', '2024-07-22 15:56:57'),
(7, 5, 1, 5, 3, NULL, NULL, NULL, NULL, '2024-07-22 15:56:57', '2024-07-22 15:56:57'),
(8, 6, 1, 4, 4, NULL, NULL, NULL, NULL, '2024-07-22 15:58:23', '2024-07-22 15:58:23'),
(9, 7, 2, 6, 1, NULL, NULL, NULL, NULL, '2024-07-22 15:59:16', '2024-07-22 15:59:16'),
(10, 7, 2, 7, 1, NULL, NULL, NULL, NULL, '2024-07-22 15:59:16', '2024-07-22 15:59:16'),
(11, 8, 2, 8, 1, NULL, NULL, NULL, NULL, '2024-07-22 16:15:00', '2024-07-22 16:15:00'),
(12, 8, 2, 9, 1, NULL, NULL, NULL, NULL, '2024-07-22 16:15:00', '2024-07-22 16:15:00'),
(13, 8, 1, 10, 5, NULL, NULL, NULL, NULL, '2024-07-22 16:15:00', '2024-07-22 16:15:00'),
(14, 9, 1, 11, 4, NULL, NULL, NULL, NULL, '2024-07-22 16:21:44', '2024-07-22 16:21:44'),
(15, 9, 2, 12, 1, NULL, NULL, NULL, NULL, '2024-07-22 16:21:44', '2024-07-22 16:21:44'),
(16, 9, 2, 13, 1, NULL, NULL, NULL, NULL, '2024-07-22 16:21:44', '2024-07-22 16:21:44'),
(17, 12, 1, 4, 1, 'Ejemplo 2', NULL, NULL, NULL, '2024-07-22 16:25:14', '2024-07-22 16:25:14'),
(18, 12, 1, 5, 2, 'Ejemplo 2', NULL, NULL, NULL, '2024-07-22 16:25:14', '2024-07-22 16:25:14'),
(19, 13, 1, 1, 3, 'Ejemplo 1', NULL, NULL, NULL, '2024-07-22 16:43:54', '2024-07-22 16:43:54'),
(20, 13, 1, 5, 1, 'Ejemplo 2', NULL, NULL, NULL, '2024-07-22 16:43:54', '2024-07-22 16:43:54'),
(21, 13, 1, 10, 5, 'Ejemplo 2', NULL, NULL, NULL, '2024-07-22 16:43:54', '2024-07-22 16:43:54'),
(22, 14, 1, 14, 5, NULL, NULL, NULL, NULL, '2024-07-22 22:19:06', '2024-07-22 22:19:06'),
(23, 14, 1, 15, 3, NULL, NULL, NULL, NULL, '2024-07-22 22:19:06', '2024-07-22 22:19:06'),
(24, 15, 1, 16, 4, NULL, NULL, NULL, NULL, '2024-07-24 23:15:04', '2024-07-24 23:15:04'),
(25, 16, 1, 17, 32, NULL, NULL, NULL, NULL, '2024-07-24 23:15:55', '2024-07-24 23:15:55'),
(26, 17, 3, 18, 7, NULL, NULL, NULL, NULL, '2024-07-25 18:22:31', '2024-07-25 18:22:31'),
(27, 18, 3, 19, 4, NULL, NULL, NULL, NULL, '2024-07-25 18:22:47', '2024-07-25 18:22:47'),
(28, 19, 1, 11, 4, 'ekjfld', NULL, NULL, NULL, '2024-07-25 18:26:57', '2024-07-25 18:26:57'),
(29, 19, 1, 14, 3, 'ekjfld', NULL, NULL, NULL, '2024-07-25 18:26:57', '2024-07-25 18:26:57'),
(30, 20, 2, 2, 1, NULL, 1, 4, 6, '2024-07-25 18:56:39', '2024-07-25 18:56:39'),
(31, 21, 4, 20, 45, NULL, NULL, NULL, NULL, '2024-07-25 21:19:24', '2024-07-25 21:19:24'),
(32, 23, 4, 20, 5, NULL, NULL, NULL, NULL, '2024-07-25 21:20:59', '2024-07-25 21:20:59'),
(33, 24, 1, 1, 3, 'sed hace salida de la bodega por vencimiento', NULL, NULL, NULL, '2024-07-25 21:23:16', '2024-07-25 21:23:16'),
(34, 25, 4, 21, 50, NULL, NULL, NULL, NULL, '2024-07-25 21:30:00', '2024-07-25 21:30:00');

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
(1, 'Ninguno', '2024-07-18 19:52:28', '2024-07-18 19:52:28', '1');

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
(4, 'coordinador', '2024-06-29 02:58:43', '2024-06-29 02:58:43', '1'),
(5, 'administrativo', '2024-07-18 19:48:10', '2024-07-18 19:48:10', '1'),
(6, 'pasante', '2024-07-18 19:48:56', '2024-07-18 19:48:56', '1');

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
(1, 'Hernán', 'Vega', '3123028342', 'cf.giron04@gmail.com', '$2b$10$tKSDBENMJWleE5x5./yrbOFqs5I75TCtlEhHWgzWCHgeBepWG6l/.', '000000', 3, 5, NULL, '2024-07-18 19:56:08', '2024-07-18 19:56:08', '1'),
(3, 'Anderson', 'Vega', '3453454535', 'prueba@gmail.com', '$2b$10$NQGsoinZsBlvORhTIBSWs.UlYfZa3fsoJ8ZM.W.Fq.fXLF2CoaMle', '42342342', 3, 3, NULL, '2024-07-19 15:30:42', '2024-07-19 15:30:42', '1'),
(4, 'Johan Eduardo', 'Perdomo Hoyos', '3123943452', 'johanperdomo109@gmail.com', '$2b$10$RyGnJFV86V9LWDcbtX9wK.f8GQyxDtCCHL5KOm8YECa4LJ/oHXxzS', '1081728459', 1, 1, 2644590, '2024-07-25 21:28:30', '2024-07-25 21:28:30', '1');

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
(1, 'Aseo', '2024-07-19 15:28:39', '2024-07-19 15:28:39', '1'),
(2, 'Bodega general', '2024-07-22 14:59:39', '2024-07-22 14:59:39', '1'),
(3, 'Agricultura', '2024-07-25 21:16:13', '2024-07-25 21:16:13', '1');

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
(1, 'General Aseo', 1, '2024-07-19 15:28:47', '2024-07-19 15:28:47', '1'),
(2, 'Aseo zona 2', 1, '2024-07-22 14:59:07', '2024-07-22 14:59:07', '1'),
(3, 'General', 2, '2024-07-22 15:00:00', '2024-07-22 15:00:00', '1'),
(4, 'Zona herramientas', 2, '2024-07-22 15:00:26', '2024-07-22 15:00:26', '1'),
(5, 'Agricultura centro', 3, '2024-07-25 21:16:33', '2024-07-25 21:16:33', '1');

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
  MODIFY `batch_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `batch_location_infos`
--
ALTER TABLE `batch_location_infos`
  MODIFY `batchLocationInfo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `counters`
--
ALTER TABLE `counters`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `elements`
--
ALTER TABLE `elements`
  MODIFY `element_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `measurementUnit_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `movements`
--
ALTER TABLE `movements`
  MODIFY `movement_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `movement_details`
--
ALTER TABLE `movement_details`
  MODIFY `movementDetail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `movement_types`
--
ALTER TABLE `movement_types`
  MODIFY `movementType_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `package_types`
--
ALTER TABLE `package_types`
  MODIFY `packageType_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `positions`
--
ALTER TABLE `positions`
  MODIFY `position_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `warehouse_locations`
--
ALTER TABLE `warehouse_locations`
  MODIFY `warehouseLocation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `update_counter_event` ON SCHEDULE EVERY 1 DAY STARTS '2024-07-18 14:38:51' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` EVENT `update_loans_due_event` ON SCHEDULE EVERY 1 DAY STARTS '2024-07-18 14:40:20' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE counters 
    SET count = (
        SELECT COUNT(*)
        FROM loans
        WHERE estimated_return < CURDATE()
    )
    WHERE counter_name = 'loans_due';
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
