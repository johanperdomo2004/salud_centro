-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 08-07-2024 a las 13:34:39
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
(134, 2, '2-1719855456013', 0, '2025-05-12 05:00:00', '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(135, 2, '2-1719855456024', 1, '2025-05-12 05:00:00', '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(136, 2, '2-1719855456030', 1, '2025-05-12 05:00:00', '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(137, 2, '2-1719855456038', 1, '2025-05-12 05:00:00', '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(138, 4, '4-1719855456046', 0, '2025-05-12 05:00:00', '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(139, 4, '4-1720053971124', 0, '2025-05-12 05:00:00', '2024-07-04 00:46:11', '2024-07-04 00:46:11', '1'),
(140, 2, '2-1720054156667', 1, NULL, '2024-07-04 00:49:16', '2024-07-04 00:49:16', '1'),
(141, 2, '2-1720054156677', 1, NULL, '2024-07-04 00:49:16', '2024-07-04 00:49:16', '1'),
(142, 9, '9-1720317111031', 3, '2024-07-17 05:00:00', '2024-07-07 01:51:51', '2024-07-07 01:51:51', '1'),
(143, 11, '11-1720317176704', 1, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56', '1'),
(144, 11, '11-1720317176709', 1, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56', '1'),
(145, 11, '11-1720317176720', 1, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56', '1'),
(146, 11, '11-1720317483742', 1, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(147, 11, '11-1720317483749', 1, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(148, 11, '11-1720317483755', 1, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(149, 11, '11-1720317483760', 1, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(150, 4, '4-1720317880545', 45, '2024-07-08 05:00:00', '2024-07-07 02:04:40', '2024-07-07 02:04:40', '1'),
(151, 4, '4-1720320218091', 77, '2024-07-02 05:00:00', '2024-07-07 02:43:38', '2024-07-07 02:43:38', '1'),
(152, 3, '3-1720397061347', 493, '2024-07-11 05:00:00', '2024-07-08 00:04:21', '2024-07-08 00:04:21', '1'),
(153, 9, '9-1720397297008', 3, '2024-07-04 05:00:00', '2024-07-08 00:08:17', '2024-07-08 00:08:17', '1'),
(154, 9, '9-1720445103615', 55, '2024-07-17 05:00:00', '2024-07-08 13:25:03', '2024-07-08 13:25:03', '1');

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
(140, 134, 3, 0, '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(141, 135, 3, 1, '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(142, 136, 3, 1, '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(143, 137, 3, 1, '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(144, 138, 3, 0, '2024-07-01 17:37:36', '2024-07-01 17:37:36', '1'),
(145, 139, 3, 0, '2024-07-04 00:46:11', '2024-07-04 00:46:11', '1'),
(146, 140, 3, 1, '2024-07-04 00:49:16', '2024-07-04 00:49:16', '1'),
(147, 141, 3, 1, '2024-07-04 00:49:16', '2024-07-04 00:49:16', '1'),
(148, 142, 1, 3, '2024-07-07 01:51:51', '2024-07-07 01:51:51', '1'),
(149, 143, 1, 1, '2024-07-07 01:52:56', '2024-07-07 01:52:56', '1'),
(150, 144, 1, 1, '2024-07-07 01:52:56', '2024-07-07 01:52:56', '1'),
(151, 145, 1, 1, '2024-07-07 01:52:56', '2024-07-07 01:52:56', '1'),
(152, 146, 3, 1, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(153, 147, 3, 1, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(154, 148, 3, 1, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(155, 149, 3, 1, '2024-07-07 01:58:03', '2024-07-07 01:58:03', '1'),
(156, 150, 5, 45, '2024-07-07 02:04:40', '2024-07-07 02:04:40', '1'),
(157, 151, 5, 77, '2024-07-07 02:43:38', '2024-07-07 02:43:38', '1'),
(158, 152, 5, 493, '2024-07-08 00:04:21', '2024-07-08 00:04:21', '1'),
(159, 153, 6, 3, '2024-07-08 00:08:17', '2024-07-08 00:08:17', '1'),
(160, 154, 5, 55, '2024-07-08 13:25:03', '2024-07-08 13:25:03', '1');

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
(1, 'Electronics', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(2, 'Furniture', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(3, 'Clothing', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(4, 'Books', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(5, 'Toys', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(6, 'Food', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(7, 'Health & Beauty', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(8, 'Sports & Outdoors', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(9, 'Automotive', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo'),
(10, 'Home & Garden', '2024-06-30 22:05:09', '2024-06-30 22:05:09', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elements`
--

CREATE TABLE `elements` (
  `element_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `stock` int DEFAULT '0',
  `elementType_id` int NOT NULL,
  `category_id` int NOT NULL,
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
(1, 'Laptop', 0, 1, 1, NULL, NULL, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(2, 'Office Chair', 5, 2, 2, NULL, NULL, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(3, 'Notebook', 493, 1, 4, 7, 2, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(4, 'Water Bottle', 122, 1, 6, 3, 3, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(5, 'Headphones', 0, 1, 1, NULL, NULL, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(6, 'Desk', 0, 2, 2, NULL, NULL, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(7, 'T-Shirt', 0, 1, 3, NULL, 1, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(8, 'Basketball', 0, 1, 8, NULL, NULL, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(9, 'Engine Oil', 61, 1, 9, 3, 2, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(10, 'Rose Plant', 0, 1, 10, 5, NULL, '2024-06-30 22:10:22', '2024-06-30 22:10:22', '1'),
(11, 'Hdh', 7, 2, 3, 2, 2, '2024-07-04 15:52:09', '2024-07-04 15:52:09', '1'),
(12, 'Xffhdh', 0, 2, 2, 3, 3, '2024-07-04 15:52:27', '2024-07-04 15:52:27', '1'),
(13, 'Jabon', 0, 1, 4, 4, 1, '2024-07-04 16:04:35', '2024-07-04 16:04:35', '1'),
(14, 'Edwr', 0, 1, 2, 2, 2, '2024-07-04 16:06:23', '2024-07-04 16:06:23', '1');

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
(1, 'Consumable', '2024-06-30 21:18:41', '2024-06-30 21:18:41', '1'),
(2, 'Tool', '2024-06-30 21:18:41', '2024-06-30 21:18:41', '1');

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
(1, 'Requested', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(2, 'Under Review', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(3, 'Accepted', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(4, 'Rejected', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(5, 'On Loan', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(6, 'Completed', '2024-06-30 21:17:05', '2024-06-30 21:17:05'),
(7, 'Cancelled', '2024-06-30 21:17:05', '2024-06-30 21:17:05');

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
(1, 'Kilogram', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(2, 'Gram', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(3, 'Liter', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(4, 'Milliliter', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(5, 'Meter', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(6, 'Centimeter', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(7, 'Millimeter', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(8, 'Piece', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(9, 'Box', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(10, 'Packet', '2024-06-30 22:06:59', '2024-06-30 22:06:59', '1'),
(11, 'Jyfjyu', '2024-07-04 15:55:32', '2024-07-04 15:55:32', '1');

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
(72, 1, 1, 1, NULL, NULL, '2024-07-01 17:37:36', '2024-07-01 17:37:36', NULL, NULL, NULL),
(73, 3, 1, 1, NULL, NULL, '2024-07-01 17:39:58', '2024-07-01 20:45:32', '2024-07-08 05:00:00', NULL, 7),
(74, 3, 1, 1, NULL, NULL, '2024-07-01 20:54:27', '2024-07-01 20:56:15', '2024-07-03 05:00:00', NULL, 7),
(75, 3, 1, 1, NULL, NULL, '2024-07-01 20:56:43', '2024-07-01 20:57:32', '2024-07-03 05:00:00', NULL, 7),
(76, 3, 1, 1, NULL, NULL, '2024-07-01 21:34:25', '2024-07-01 21:58:27', '2024-07-03 05:00:00', NULL, 3),
(77, 1, 1, 2, NULL, NULL, '2024-07-04 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(78, 2, 1, 3, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(79, 1, 2, 3, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(80, 2, 2, 4, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(81, 1, 3, 1, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(82, 2, 3, 2, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(83, 1, 4, 1, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(84, 2, 4, 2, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(85, 1, 1, 3, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(86, 2, 2, 1, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(87, 1, 3, 4, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(88, 2, 4, 3, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(89, 1, 1, 2, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(90, 2, 2, 3, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(91, 1, 3, 1, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(92, 2, 4, 2, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(93, 1, 1, 3, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(94, 2, 2, 1, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(95, 1, 3, 2, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(96, 2, 4, 1, NULL, NULL, '2024-07-03 01:17:30', '2024-07-03 01:17:30', NULL, NULL, NULL),
(97, 1, 1, 2, 3, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(98, 2, 1, 3, 2, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(99, 1, 2, 3, 1, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(100, 2, 2, 4, 1, 3, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(101, 1, 3, 1, 2, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(102, 2, 3, 2, 1, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(103, 1, 4, 1, 3, 2, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(104, 2, 4, 2, 3, 1, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(105, 1, 1, 3, 2, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(106, 2, 2, 1, 3, 4, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(107, 1, 3, 4, 1, 2, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(108, 2, 4, 3, 1, 2, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(109, 1, 1, 2, 4, 3, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(110, 2, 2, 3, 4, 1, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(111, 1, 3, 1, 4, 2, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(112, 2, 4, 2, 1, 3, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(113, 1, 1, 3, 4, 2, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(114, 2, 2, 1, 4, 3, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 1),
(115, 1, 3, 2, 4, 1, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(116, 2, 4, 1, 3, 2, '2024-07-03 19:28:23', '2024-07-03 19:28:23', '2025-01-01 04:59:59', NULL, 2),
(119, 1, 1, 1, NULL, NULL, '2024-07-04 00:46:11', '2024-07-04 00:46:11', NULL, NULL, NULL),
(121, 1, 1, 1, NULL, NULL, '2024-07-04 00:49:16', '2024-07-04 00:49:16', NULL, NULL, NULL),
(122, 1, 1, 1, NULL, NULL, '2024-07-07 01:51:51', '2024-07-07 01:51:51', NULL, NULL, NULL),
(123, 1, 1, 1, NULL, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56', NULL, NULL, NULL),
(131, 1, 1, 1, NULL, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03', NULL, NULL, NULL),
(133, 1, 1, 1, NULL, NULL, '2024-07-07 02:04:40', '2024-07-07 02:04:40', NULL, NULL, NULL),
(141, 1, 1, 1, NULL, NULL, '2024-07-07 02:43:38', '2024-07-07 02:43:38', NULL, NULL, NULL),
(142, 2, 1, 1, NULL, NULL, '2024-07-07 03:11:48', '2024-07-07 03:11:48', NULL, NULL, NULL),
(143, 1, 1, 1, NULL, NULL, '2024-07-08 00:04:21', '2024-07-08 00:04:21', NULL, NULL, NULL),
(147, 1, 1, 1, NULL, NULL, '2024-07-08 00:08:17', '2024-07-08 00:08:17', NULL, NULL, NULL),
(149, 2, 1, 1, NULL, NULL, '2024-07-08 01:49:17', '2024-07-08 01:49:17', NULL, NULL, NULL),
(150, 2, 1, 1, NULL, NULL, '2024-07-08 01:49:41', '2024-07-08 01:49:41', NULL, NULL, NULL),
(151, 2, 1, 1, NULL, NULL, '2024-07-08 01:50:34', '2024-07-08 01:50:34', NULL, NULL, NULL),
(153, 1, 1, 1, NULL, NULL, '2024-07-08 13:25:03', '2024-07-08 13:25:03', NULL, NULL, NULL);

--
-- Disparadores `movements`
--
DELIMITER $$
CREATE TRIGGER `movements_BEFORE_INSERT` BEFORE INSERT ON `movements` FOR EACH ROW BEGIN
	IF NEW.movementType_id = 3 AND NEW.movementLoan_status IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo movementLoan_status no puede ser nulo para préstamos';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `movements_BEFORE_UPDATE` BEFORE UPDATE ON `movements` FOR EACH ROW BEGIN
	IF NEW.movementType_id = 3 AND NEW.movementLoan_status IS NULL THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El campo movementLoan_status no puede ser nulo para préstamos';
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
(155, 72, 2, 134, 1, 'Consumible con varios', NULL, NULL, NULL, '2024-07-01 17:37:36', '2024-07-01 17:37:36'),
(156, 72, 2, 135, 1, 'Consumible con varios', NULL, NULL, NULL, '2024-07-01 17:37:36', '2024-07-01 17:37:36'),
(157, 72, 2, 136, 1, 'Consumible con varios', NULL, NULL, NULL, '2024-07-01 17:37:36', '2024-07-01 17:37:36'),
(158, 72, 2, 137, 1, 'Consumible con varios', NULL, NULL, NULL, '2024-07-01 17:37:36', '2024-07-01 17:37:36'),
(159, 72, 4, 138, 10, 'Consumible con varios', NULL, NULL, NULL, '2024-07-01 17:37:36', '2024-07-01 17:37:36'),
(160, 73, 2, 134, 1, 'Cancelado', NULL, NULL, 7, '2024-07-01 17:39:58', '2024-07-01 20:45:32'),
(161, 73, 2, 135, 1, 'Cancelado', NULL, NULL, 7, '2024-07-01 17:39:58', '2024-07-01 20:45:32'),
(162, 74, 2, 134, 1, 'Cancelado', NULL, NULL, 7, '2024-07-01 20:54:27', '2024-07-01 20:56:15'),
(163, 74, 2, 135, 1, 'Cancelado', NULL, NULL, 7, '2024-07-01 20:54:27', '2024-07-01 20:56:15'),
(164, 75, 2, 134, 1, 'Cancelado', NULL, NULL, 7, '2024-07-01 20:56:43', '2024-07-01 20:57:32'),
(165, 75, 2, 135, 1, 'Cancelado', NULL, NULL, 7, '2024-07-01 20:56:43', '2024-07-01 20:57:32'),
(166, 76, 2, 134, 1, 'Aceptado', NULL, NULL, 3, '2024-07-01 21:34:25', '2024-07-01 21:40:23'),
(167, 76, 2, 135, 1, 'Rechazado', NULL, NULL, 4, '2024-07-01 21:34:25', '2024-07-01 21:40:23'),
(168, 119, 4, 139, 2, 'Consumible con varios', NULL, NULL, NULL, '2024-07-04 00:46:11', '2024-07-04 00:46:11'),
(169, 121, 2, 140, 1, 'Consumible con varios', NULL, NULL, NULL, '2024-07-04 00:49:16', '2024-07-04 00:49:16'),
(170, 121, 2, 141, 1, 'Consumible con varios', NULL, NULL, NULL, '2024-07-04 00:49:16', '2024-07-04 00:49:16'),
(171, 122, 9, 142, 3, NULL, NULL, NULL, NULL, '2024-07-07 01:51:51', '2024-07-07 01:51:51'),
(172, 123, 11, 143, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56'),
(173, 123, 11, 144, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56'),
(174, 123, 11, 145, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:52:56', '2024-07-07 01:52:56'),
(175, 131, 11, 146, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03'),
(176, 131, 11, 147, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03'),
(177, 131, 11, 148, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03'),
(178, 131, 11, 149, 1, NULL, NULL, NULL, NULL, '2024-07-07 01:58:03', '2024-07-07 01:58:03'),
(179, 133, 4, 150, 85, NULL, NULL, NULL, NULL, '2024-07-07 02:04:40', '2024-07-07 02:04:40'),
(180, 141, 4, 151, 77, NULL, NULL, NULL, NULL, '2024-07-07 02:43:38', '2024-07-07 02:43:38'),
(181, 142, 4, 138, 10, NULL, NULL, NULL, NULL, '2024-07-07 03:11:48', '2024-07-07 03:11:48'),
(182, 142, 4, 139, 2, NULL, NULL, NULL, NULL, '2024-07-07 03:11:48', '2024-07-07 03:11:48'),
(183, 142, 4, 150, 40, NULL, NULL, NULL, NULL, '2024-07-07 03:11:48', '2024-07-07 03:11:48'),
(184, 143, 3, 152, 501, NULL, NULL, NULL, NULL, '2024-07-08 00:04:21', '2024-07-08 00:04:21'),
(185, 147, 9, 153, 3, NULL, NULL, NULL, NULL, '2024-07-08 00:08:17', '2024-07-08 00:08:17'),
(186, 149, 3, 152, 3, NULL, NULL, NULL, NULL, '2024-07-08 01:49:17', '2024-07-08 01:49:17'),
(187, 151, 3, 152, 5, NULL, NULL, NULL, NULL, '2024-07-08 01:50:34', '2024-07-08 01:50:34'),
(188, 153, 9, 154, 55, NULL, NULL, NULL, NULL, '2024-07-08 13:25:03', '2024-07-08 13:25:03');

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
(4, 'loan', '2024-06-30 21:13:47', '2024-06-30 21:13:47', '1'),
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
(2, 'Box', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(3, 'Pallet', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(4, 'Crate', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(5, 'Bag', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1'),
(6, 'Envelope', '2024-06-30 21:23:23', '2024-06-30 21:23:23', '1');

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
(2, 'Juan', 'Perez', '123456789', 'juan@example.com', '$2a$10$6aI8J5oU49s4C/QBDn/O3u9cqSasLJzNKTzkVd8gB8eR/cTegwQG6', '123ABC', 1, 1, 201, '2024-06-30 21:34:02', '2024-06-30 21:34:02', '1'),
(3, 'María', 'González', '987654321', 'maria@example.com', '$2a$10$0sYB9P.gXHE7s7q1m/wAfeJ8nJ8AgIRXeEL66e3KNiGbsz0fRKO2G', '456DEF', 2, 2, NULL, '2024-06-30 21:34:02', '2024-06-30 21:34:02', '1'),
(4, 'Pedro', 'López', '555555555', 'pedro@example.com', '$2a$10$0zqMzTmFNPSYR7vFFQCHW.wXrSdUOknhDQaS8uZfZhizQnDkX2IXy', '789GHI', 1, 3, NULL, '2024-06-30 21:34:02', '2024-06-30 21:34:02', '1'),
(12, 'johan', 'perdomo', '132145', 'johanperdomo109@gmail.com', '$2b$10$xgQZdVipR2o5cbLirnD8u.GlOecZHXQFuwOCa6/oZY3J0E8jqSL4m', '131355452', 1, 1, 4522, '2024-07-04 16:03:19', '2024-07-04 16:03:19', '1'),
(52, 'hjgh', 'jioo', '44355', 'iohjhug@gmail.com', '$2b$10$of7ZEum7TyHNehzubSMqQ.WzkQngP1gAwUI/36ADK4SOt6Jcy73wy', '555', 1, 1, -8, '2024-07-04 15:53:24', '2024-07-04 15:53:24', '1'),
(465, 'johan', 'hjhj', '132145', 'johanperdomo@gmail.com', '$2b$10$sMuOwLLdNpr3r8fWuO/cBu7TmVTMnIZd73TcVDdgTS2o2Q4OCzGoS', '4554', 2, 2, NULL, '2024-07-04 16:05:10', '2024-07-04 16:05:10', '1'),
(3333, 'uioi', 'bjhkjh', '5645', 'ijjj@gmail.com', '$2b$10$DE8d2GIgEwz/oYZp9Nbd5ucnIRoc6L3h67Lmx960RLgtAMxBjbMmW', '5665', 1, 2, 445, '2024-07-04 15:57:13', '2024-07-04 15:57:13', '1'),
(4554, 'simon', 'hjhh', '45544', 'johano109@gmail.com', '$2b$10$gP8saM9V8TsneJkbuEy9o.VrKOyONXEEOua4wN9uhLsmJpei7Zgtm', '455888', 2, 1, 5345, '2024-07-04 16:05:58', '2024-07-04 16:05:58', '1');

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
(1, 'Location A', 1, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(2, 'Location B', 1, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(3, 'Location C', 1, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(4, 'Location D', 2, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(5, 'Location E', 2, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(6, 'Location F', 2, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(7, 'Location G', 3, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(8, 'Location H', 3, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1'),
(9, 'Location I', 3, '2024-06-30 21:27:31', '2024-06-30 21:27:31', '1');

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
  MODIFY `batch_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT de la tabla `batch_location_infos`
--
ALTER TABLE `batch_location_infos`
  MODIFY `batchLocationInfo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `elements`
--
ALTER TABLE `elements`
  MODIFY `element_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `measurementUnit_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `movements`
--
ALTER TABLE `movements`
  MODIFY `movement_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT de la tabla `movement_details`
--
ALTER TABLE `movement_details`
  MODIFY `movementDetail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

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
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4555;

--
-- AUTO_INCREMENT de la tabla `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `warehouse_locations`
--
ALTER TABLE `warehouse_locations`
  MODIFY `warehouseLocation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
