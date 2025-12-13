-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: docscanner
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('spatie.permission.cache','a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:12:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:14:\"view_dashboard\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:14:\"view_documents\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:16:\"create_documents\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:14:\"edit_documents\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:16:\"delete_documents\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:12:\"manage_units\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"manage_types\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:12:\"manage_pptks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:18:\"manage_sumber_dana\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:12:\"manage_users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:12:\"manage_roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:15:\"manage_settings\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}}s:5:\"roles\";a:3:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:11:\"Super Admin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:5:\"Admin\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:8:\"Operator\";s:1:\"c\";s:3:\"web\";}}}',1765705524);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2024_01_01_000001_create_units_table',1),(5,'2024_01_01_000002_create_types_table',1),(6,'2024_01_01_000003_create_pptks_table',1),(7,'2024_01_01_000004_create_records_table',1),(8,'2024_01_01_000005_create_settings_table',1),(9,'2024_01_01_000006_add_username_avatar_to_users_table',1),(10,'2025_12_13_143238_create_personal_access_tokens_table',1),(11,'2024_01_01_000007_add_avatar_to_pptks_table',2),(12,'2024_01_01_000008_create_sumber_danas_table',3),(13,'2025_12_13_155219_create_permission_tables',4),(14,'2024_01_01_000009_make_email_nullable_in_users_table',5),(15,'2024_01_01_000010_add_unit_pptk_to_users_table',6),(16,'2024_01_01_000011_swap_name_code_in_units_and_types',7);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1),(2,'App\\Models\\User',2),(3,'App\\Models\\User',3);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'view_dashboard','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(2,'view_documents','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(3,'create_documents','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(4,'edit_documents','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(5,'delete_documents','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(6,'manage_units','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(7,'manage_types','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(8,'manage_pptks','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(9,'manage_sumber_dana','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(10,'manage_users','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(11,'manage_roles','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(12,'manage_settings','web','2025-12-13 15:55:30','2025-12-13 15:55:30');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth-token','210eb8584faca2dda91b2d521c10a9a97aac0fdf5457948b26f307271fd46f16','[\"*\"]',NULL,NULL,'2025-12-13 14:43:08','2025-12-13 14:43:08'),(2,'App\\Models\\User',1,'auth-token','d4b1ef543b7cfc205707a356aac257e40458df85f231484828caf1af62ac5f63','[\"*\"]',NULL,NULL,'2025-12-13 14:45:23','2025-12-13 14:45:23'),(3,'App\\Models\\User',1,'auth-token','c67dee1ac8df21ee7772b38227a8e954aaeb1d48664d54b57b24a9dd7a664d63','[\"*\"]',NULL,NULL,'2025-12-13 14:47:17','2025-12-13 14:47:17'),(4,'App\\Models\\User',3,'auth-token','15e7c70ad82567b9a89b9f8acbe8827a1b26a3c49d646898cb16aea7d213a13a','[\"*\"]',NULL,NULL,'2025-12-13 16:45:12','2025-12-13 16:45:12'),(5,'App\\Models\\User',3,'auth-token','7b12cbd487ac3dcb078a207abe3a1d7ab87235efc2df7afc961f55c09a5e11c3','[\"*\"]',NULL,NULL,'2025-12-13 16:54:57','2025-12-13 16:54:57'),(6,'App\\Models\\User',3,'auth-token','419f20ce812cac724b23b016ef51df77239478e47d8dd5ea757af97871a07c46','[\"*\"]',NULL,NULL,'2025-12-13 17:01:26','2025-12-13 17:01:26'),(7,'App\\Models\\User',3,'auth-token','74fe3e68a3c7399a0a9169a882f897f9edf05d4f98bf72e9a80c135cc939118d','[\"*\"]','2025-12-13 17:57:31',NULL,'2025-12-13 17:07:09','2025-12-13 17:57:31'),(8,'App\\Models\\User',3,'auth-token','e54dfbebd1a35a1752bbd88758f469b9fb5c3cef254217154cf4234f223a8228','[\"*\"]',NULL,NULL,'2025-12-13 17:07:34','2025-12-13 17:07:34'),(9,'App\\Models\\User',3,'auth-token','870f4488a635c1f5ffb2c6dfe92a7b4f4e9f75c28b762a9ad3eef813141c068f','[\"*\"]',NULL,NULL,'2025-12-13 17:09:41','2025-12-13 17:09:41'),(10,'App\\Models\\User',3,'auth-token','e433a7a667cf23bc2c2c24ccf5a6dc655b9d1b28fc6c003062401211935cf487','[\"*\"]','2025-12-13 17:31:05',NULL,'2025-12-13 17:12:11','2025-12-13 17:31:05'),(11,'App\\Models\\User',3,'auth-token','e54f851f5c5e25afa2455fd43e296053b0a58f3e04bc91546fe44cedf322a0a8','[\"*\"]','2025-12-13 18:07:56',NULL,'2025-12-13 18:01:10','2025-12-13 18:07:56'),(12,'App\\Models\\User',3,'auth-token','d0a09404965a4e4b401b7682b0a7c924425e949083429e64b9ee6ad34ebd66e2','[\"*\"]','2025-12-13 18:12:29',NULL,'2025-12-13 18:11:56','2025-12-13 18:12:29'),(13,'App\\Models\\User',3,'auth-token','e147cd91d27ddcb526a149b8f0fe0a723995362b904573b82c124e526d04a044','[\"*\"]','2025-12-13 18:16:37',NULL,'2025-12-13 18:12:34','2025-12-13 18:16:37'),(14,'App\\Models\\User',3,'auth-token','244e0bf8a9a6f0d17a9d511803a94463636c84922a3ecf5fb4c9384b1d90fa55','[\"*\"]','2025-12-13 18:16:52',NULL,'2025-12-13 18:16:47','2025-12-13 18:16:52'),(15,'App\\Models\\User',3,'auth-token','b437ecf31eafeb4738ecdceaedc4d3ed2686df3dc487d091fc4276e92f1fbce7','[\"*\"]','2025-12-13 18:52:36',NULL,'2025-12-13 18:34:06','2025-12-13 18:52:36'),(16,'App\\Models\\User',3,'auth-token','8b69aca7131035c7c036b7df26f588789d3ef6680bbc5a129d8b5d380e16e299','[\"*\"]',NULL,NULL,'2025-12-13 18:41:40','2025-12-13 18:41:40'),(17,'App\\Models\\User',3,'auth-token','9bb537445e09124aa40c0909fa14b96ac45514bdd809a07fd7556e11e4c415d0','[\"*\"]','2025-12-13 18:59:43',NULL,'2025-12-13 18:53:18','2025-12-13 18:59:43'),(18,'App\\Models\\User',3,'auth-token','9a526e001358695f607bd2730d7a168b3894b1ac698a5aebddfe5d2b9482a5f3','[\"*\"]',NULL,NULL,'2025-12-13 18:59:59','2025-12-13 18:59:59'),(19,'App\\Models\\User',1,'auth-token','09c245f3c8992c4499ecde495daffe25808fb4ea43b9a083c45f31766a870c56','[\"*\"]','2025-12-13 19:19:31',NULL,'2025-12-13 19:18:39','2025-12-13 19:19:31'),(20,'App\\Models\\User',3,'auth-token','4553d21f5d3f11988e6f572eb0ce1e10361f23b042bfa441df3249efc6a2dd8c','[\"*\"]',NULL,NULL,'2025-12-13 19:19:40','2025-12-13 19:19:40'),(21,'App\\Models\\User',1,'auth-token','6fafb78950902b960f8d9277066526bb4ec3cfded4a980dc35a941234ae1d374','[\"*\"]','2025-12-13 19:26:39',NULL,'2025-12-13 19:21:12','2025-12-13 19:26:39'),(22,'App\\Models\\User',1,'auth-token','032001c3f78d5638c9f680af1f7ba6eb35e7a9354fa3802fdc355c5dc08bfdd5','[\"*\"]','2025-12-13 19:29:06',NULL,'2025-12-13 19:26:47','2025-12-13 19:29:06'),(23,'App\\Models\\User',1,'auth-token','dc0a7a7afde2708c17f4cdaee5965fd48f1f55b41f844c67c8eebfe46fd6a109','[\"*\"]',NULL,NULL,'2025-12-13 19:29:39','2025-12-13 19:29:39'),(24,'App\\Models\\User',1,'auth-token','fa6a211a860bebdd3547134bfc2344ccb2b533c29f3eec0ef6e8a33e6ccb6482','[\"*\"]',NULL,NULL,'2025-12-13 19:34:51','2025-12-13 19:34:51'),(25,'App\\Models\\User',3,'auth-token','17c54c0c134a0ca847c293136963ef656353928a93a892022dba8c9c082b2faf','[\"*\"]','2025-12-13 19:41:01',NULL,'2025-12-13 19:40:38','2025-12-13 19:41:01');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pptks`
--

DROP TABLE IF EXISTS `pptks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pptks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pptks_unit_id_foreign` (`unit_id`),
  CONSTRAINT `pptks_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pptks`
--

LOCK TABLES `pptks` WRITE;
/*!40000 ALTER TABLE `pptks` DISABLE KEYS */;
INSERT INTO `pptks` VALUES (3,'IRFAN, S.Pt',NULL,NULL,1,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(4,'ENDANG SUSANTI, SE',NULL,NULL,1,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(5,'I. NURFAIDAH, SE.,M.Si',NULL,NULL,1,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(6,'ROCKHFANI K. NGONGO, S.Sos',NULL,NULL,1,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(7,'MOHAMAD FAKHRURRAZI, S.Ak',NULL,NULL,1,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(8,'RETNO PRATIWI, SSTP.,MAP',NULL,NULL,2,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(9,'RAHMAD HIDAYAT, S.STP',NULL,NULL,2,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(10,'IMTIZAL SYAHBAN, S.Tr.IP',NULL,NULL,2,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(11,'REINA MIFTAHANI, S.Sn',NULL,NULL,2,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(12,'BENI, S.AP',NULL,NULL,13,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(13,'Hj. URIANI HASAN, S.Pd.,MSi',NULL,NULL,3,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(14,'MOHAMAD IRFAN, S.ST',NULL,NULL,3,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(15,'JUNAIDIN, SH., M.Si',NULL,NULL,3,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(16,'GUNAWAN, SE',NULL,NULL,14,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(17,'ASRIA, SE.,MM',NULL,NULL,4,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(18,'FAIZAH, SP.,MM',NULL,NULL,5,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(19,'JORDAN YORRY MOULA,SH.M.Si.,AIFO-P',NULL,NULL,6,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(20,'INDRIYANI, SE',NULL,NULL,15,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(21,'ETTY BUDI SETIAWATY, S.Pi',NULL,NULL,16,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(22,'HENDRAWAN BASO, SH',NULL,NULL,17,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(23,'RUBLAN LIDAYA, S.Pd',NULL,NULL,18,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(24,'RAMADHAN TAMBONG, S.Sos',NULL,NULL,19,1,'2025-12-13 15:26:59','2025-12-13 15:26:59'),(25,'RAPIAH, SE',NULL,NULL,20,1,'2025-12-13 15:26:59','2025-12-13 15:26:59');
/*!40000 ALTER TABLE `pptks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `records`
--

DROP TABLE IF EXISTS `records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `unit_id` bigint unsigned NOT NULL,
  `type_id` bigint unsigned NOT NULL,
  `pptk_id` bigint unsigned NOT NULL,
  `nilai` decimal(15,2) NOT NULL DEFAULT '0.00',
  `uraian` text COLLATE utf8mb4_unicode_ci,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `records_unit_id_foreign` (`unit_id`),
  KEY `records_type_id_foreign` (`type_id`),
  KEY `records_pptk_id_foreign` (`pptk_id`),
  KEY `records_created_by_foreign` (`created_by`),
  CONSTRAINT `records_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `records_pptk_id_foreign` FOREIGN KEY (`pptk_id`) REFERENCES `pptks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `records_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `records_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `records`
--

LOCK TABLES `records` WRITE;
/*!40000 ALTER TABLE `records` DISABLE KEYS */;
INSERT INTO `records` VALUES (1,1,2,3,2500000.00,'Belanja Makan Minum Kegiatan','documents/sntgXKWgL8Iy1FulzjbztAGUPya9ybjy70fRPpQo.pdf',3,'2025-12-13 17:25:17','2025-12-13 17:25:17');
/*!40000 ALTER TABLE `records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(12,2),(1,3),(2,3),(3,3),(4,3);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(2,'Admin','web','2025-12-13 15:55:30','2025-12-13 15:55:30'),(3,'Operator','web','2025-12-13 15:55:30','2025-12-13 15:55:30');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('9ynPsAkkulaUxY8wjTT4QZS2nH1Ix2t1PP569SD1',NULL,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiRmE2UTFibk9rM0I2MHNuNEo2UmZuN1p0bEdlZDd5ZEgxcU9lWndTdSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765625227),('AqzwltrIeDWnUJkDKlNQ8To0S9J6O5zM6po1e5TD',NULL,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWWFiZWtJOXhBNVhpaUg4OGpQVktnQnNwc2V5TVlTWlRBVFY0amwwVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hZG1pbi9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjE6e3M6ODoiaW50ZW5kZWQiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hZG1pbiI7fX0=',1765620331),('NtnaIsiZ2dFaEbXQQR8aJWrDJljvl0qjrLF0Ec2T',NULL,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia2ZjaHhBeXJ5MjQ5SWRINVRZN0d0TlM0NE1wNHRrZmJtbzhHQXFkNyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hZG1pbi9sb2dpbiI7fX0=',1765614777),('OH3KH9RH9di3dSrgkPBxNkDxjba6ogx98XRuRSOO',1,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoiR0JBVWhMaVhhVzg2R3R2NUdHaXJadW1OMFE2bUY2WDhoeGMwZHk5UiI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQwOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYWRtaW4vdXNlcnMvY3JlYXRlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJG1ZRDM4WkhMYjdGV2JUVGQvb3cyVXVwUVFmNmlpLnpMbDRUN05Id0JOZHQxMEdQTXNISHlhIjt9',1765614964),('qFhr7dwBUTVHpn7qGPGgV1FTO7YkHlIN5CywkUjV',1,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoicHFJZzc5blM0UjF0SURFcTNPMDNFb0Y4eHdOR3NBWXB4em1aeGVXMyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQwOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYWRtaW4vdXNlcnMvY3JlYXRlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJG1ZRDM4WkhMYjdGV2JUVGQvb3cyVXVwUVFmNmlpLnpMbDRUN05Id0JOZHQxMEdQTXNISHlhIjt9',1765614840),('s0ne8c81aXSzHrNm6pVBWwl7yID4ApneRKm9vWlA',NULL,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMURvTmJYRTVFck0zajNJT1JpWTltSnZYOHZrOTN5dW9rMVI3NGptTiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo0MDoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FkbWluL3VzZXJzL2NyZWF0ZSI7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYWRtaW4vbG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765614901),('SI0K7QCPocxy1UT2IamtUekH7AD4OO3fMwr2PhiN',NULL,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiZnRrdnZsOXFBZGNXRGFUaDROcWFZT2xJSTFseTBYcGdoRlBDZkxPMiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765625423),('u1ZWwAv2z6SzHPDdgLTR5GcTm44iW2QeaBmGD7uz',NULL,'172.18.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoibThzYWhiTzhhT2lDYThqbG9XQkFHajZIZFRza3NYb0ZTYU9rMEExRyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765626011);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sumber_danas`
--

DROP TABLE IF EXISTS `sumber_danas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sumber_danas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sumber_danas`
--

LOCK TABLES `sumber_danas` WRITE;
/*!40000 ALTER TABLE `sumber_danas` DISABLE KEYS */;
INSERT INTO `sumber_danas` VALUES (1,'DANA-01','PAD / DAU BIASA',1,'2025-12-13 15:38:30','2025-12-13 15:42:48'),(2,'DANA-04','DAK SMK',1,'2025-12-13 15:38:51','2025-12-13 15:39:23'),(3,'DANA-02','DAU EMARKED',1,'2025-12-13 15:40:13','2025-12-13 15:40:13'),(4,'DANA-03','DAK SMA',1,'2025-12-13 15:40:41','2025-12-13 15:40:41');
/*!40000 ALTER TABLE `sumber_danas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `types_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES (1,'UP','UP',1,'2025-12-13 15:36:56','2025-12-13 15:36:56'),(2,'GU','GU',1,'2025-12-13 15:37:10','2025-12-13 15:37:10'),(3,'LS','LS',1,'2025-12-13 15:37:21','2025-12-13 15:37:21');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `units_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'SEKRETARIAT','SEKRETARIAT',1,'2025-12-13 14:58:29','2025-12-13 14:58:29'),(2,'BIDANG SMA','BIDANG SMA',1,'2025-12-13 14:58:46','2025-12-13 14:58:46'),(3,'BIDANG SMK','BIDANG SMK',1,'2025-12-13 14:59:13','2025-12-13 14:59:13'),(4,'BIDANG PTK','BIDANG PTK',1,'2025-12-13 15:00:31','2025-12-13 15:00:31'),(5,'BIDANG PK-PLK','BIDANG PK-PLK',1,'2025-12-13 15:02:10','2025-12-13 15:02:10'),(6,'UPTD. BLPT','UPTD. BLPT',1,'2025-12-13 15:02:21','2025-12-13 15:02:21'),(13,'DAK SMA','DAK SMA',1,'2025-12-13 15:04:49','2025-12-13 15:04:49'),(14,'DAK SMK','DAK SMK',1,'2025-12-13 15:06:00','2025-12-13 15:06:00'),(15,'CABDIS WILAYAH 1','CABDIS WILAYAH 1',1,'2025-12-13 15:08:13','2025-12-13 15:08:13'),(16,'CABDIS WILAYAH 2','CABDIS WILAYAH 2',1,'2025-12-13 15:08:24','2025-12-13 15:08:24'),(17,'CABDIS WILAYAH 3','CABDIS WILAYAH 3',1,'2025-12-13 15:08:35','2025-12-13 15:08:35'),(18,'CABDIS WILAYAH 4','CABDIS WILAYAH 4',1,'2025-12-13 15:09:00','2025-12-13 15:09:00'),(19,'CABDSI WILAYAH 5','CABDSI WILAYAH 5',1,'2025-12-13 15:09:12','2025-12-13 15:09:12'),(20,'CABDIS WILAYAH 6','CABDIS WILAYAH 6',1,'2025-12-13 15:09:23','2025-12-13 15:09:23');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_id` bigint unsigned DEFAULT NULL,
  `pptk_id` bigint unsigned DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_unit_id_foreign` (`unit_id`),
  KEY `users_pptk_id_foreign` (`pptk_id`),
  CONSTRAINT `users_pptk_id_foreign` FOREIGN KEY (`pptk_id`) REFERENCES `pptks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_unit_id_foreign` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrator','admin','admin@docscanner.local',NULL,NULL,NULL,NULL,'$2y$12$mYD38ZHLb7FWbTTd/ow2UupQQf6ii.zLl4T7NHwBNdt10GPMsHHya',NULL,'2025-12-13 14:42:25','2025-12-13 14:42:25'),(2,'Endang Yuliani','endang01',NULL,'avatars/01KCBCNBNM42XEN93B6NYY53MW.jpg',NULL,NULL,NULL,'$2y$12$5xA4UhCpgdnBHFngBK627uZjC7whdcD9wITU2B.xMsaTBp/NIkg.S',NULL,'2025-12-13 16:19:00','2025-12-13 16:19:00'),(3,'Operatornya PPTK','operator01',NULL,'avatars/01KCBDA58FWQYYM6TQBZ6M45RH.png',1,3,NULL,'$2y$12$GyIVI2RnAytCvjE9Xg9lfe.gOmmC7cQYRlhRzvx4kBYo/viflpri.',NULL,'2025-12-13 16:30:22','2025-12-13 16:30:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-13 12:38:03
