-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: inmobiliaria_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Juan Perez','juan@correo.cl','1234','2026-01-10','bloqueado',1),(2,'Admin','admin@correo.cl','$2a$10$oOz9KTzNSPrNS4IjhborM.TiUWXhiHHmPT3fbb2Pjd8B7gzKKHiPC','2026-01-10','activo',2),(3,'pedro','pelluco84@gmail.com','$2a$10$yK9y4absSg2UNfEMiuFYte7tidTFmKbDb4ROs2TIc/kLVP0ViFd9O','2026-01-19','inactivo',1),(4,'agustin cardenas','agus@gmail.com','$2a$10$390yEpA1JqLb9j29UU3.buCoi0aBlP15W3wWe2bAXkSHeC3w6lxRK','2026-01-19','bloqueado',1),(5,'agus','agus@correo.cl','$2a$10$TYHh/j87OucLcO/fxkqka.CHIMYnH2Xr//Y4nNQl94peXqgttfHFa','2026-01-21','bloqueado',1),(6,'pelluco','pelluco@correo.cl','$2a$10$9uVtVz99EhzlawLuhOddCu7fyHZFYdmowQXw6OgL9rtPW/lxNoJtm','2026-01-21','bloqueado',1),(7,'pedroc','pedroc@correo.cl','$2a$10$.gEjPIAO9mXNsxOvF68pkOliRpnv4IV/JFkhTDCFtH59kixNxfAQG','2026-01-21','bloqueado',1),(8,'agustin','agustin@correo.cl','$2a$10$X9QknzynoPMufokRE4ntMOqIwC3umye6RCTVC3ty9p4pc79dkTnia','2026-01-21','bloqueado',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-22 23:54:36
