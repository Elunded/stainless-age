-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: Stainless_Age
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `successful_orders` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Олександр','Іванов','+380671234567',3),(2,'Марія','Петренко','+380931112233',5),(3,'Ігор','Коваленко','+380503456789',1),(7,'Олександр','Козар','380771522313',1),(8,'Дмитро','Лопотко','1231231231',0),(9,'Дмитро','Лопотко','380731639756',1),(10,'Олександр','Казар','380228133727',0),(11,'Анастасія','Сдєльнікова','380973179500',1),(12,'Віталій','Цаль','380973179511',0);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `items` json DEFAULT NULL,
  `order_status` enum('Прийняте','Виготовляється','Виконано','Скасовано') NOT NULL DEFAULT 'Прийняте',
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (5,1,'[{\"id\": 4, \"name\": \"Сталевий змішувач\", \"price\": \"299.99\", \"quantity\": 1}]','Виконано',299.99,'2025-05-17 18:53:14'),(6,7,'[{\"id\": 2, \"name\": \"Металева решітка\", \"price\": \"85.30\", \"quantity\": 3}]','Виконано',255.90,'2025-05-18 07:11:59'),(7,8,'[{\"id\": 2, \"name\": \"Металева решітка\", \"price\": \"85.30\", \"quantity\": 2}]','Прийняте',170.60,'2025-05-18 09:31:00'),(8,9,'[{\"id\": 8, \"name\": \"Сталевий поручень\", \"price\": \"479.99\", \"quantity\": 2}]','Прийняте',959.98,'2025-05-18 12:27:01'),(9,9,'[{\"id\": 4, \"name\": \"Сталевий змішувач\", \"price\": \"299.99\", \"quantity\": 3}]','Виконано',899.97,'2025-05-19 11:51:34'),(10,10,'[{\"id\": 2, \"name\": \"Металева решітка\", \"price\": \"85.30\", \"quantity\": 1}, {\"id\": 3, \"name\": \"Кухонна мийка\", \"price\": \"5640.50\", \"quantity\": 1}, {\"id\": 4, \"name\": \"Сталевий змішувач\", \"price\": \"299.99\", \"quantity\": 2}]','Прийняте',6325.78,'2025-05-19 12:10:15'),(11,9,'[{\"id\": 5, \"name\": \"Металеві двері\", \"price\": \"42379.00\", \"quantity\": 1}, {\"id\": 3, \"name\": \"Кухонна мийка\", \"price\": \"5640.50\", \"quantity\": 2}]','Скасовано',53660.00,'2025-05-19 16:10:22'),(12,9,'[{\"id\": 13, \"name\": \"Фіксатор для труб\", \"price\": \"49.99\", \"quantity\": 1}, {\"id\": 8, \"name\": \"Нержавіючі перила\", \"price\": \"4200.00\", \"quantity\": 5}, {\"id\": 9, \"name\": \"Металева решітка\", \"price\": \"220.00\", \"quantity\": 3}]','Виготовляється',21709.99,'2025-05-19 16:15:57'),(13,11,'[{\"id\": 1, \"name\": \"Сталевий поручень\", \"price\": \"3200.00\", \"quantity\": 10}]','Виконано',32000.00,'2025-05-19 16:31:56'),(14,12,'[{\"id\": 1, \"name\": \"Сталевий поручень\", \"price\": \"3200.00\", \"quantity\": 2}]','Прийняте',6400.00,'2025-05-19 22:41:50');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` enum('Індивідуальне замовлення','Декоративні елементи','Для ванни','Для димоходів та вентиляції','Рушникосушки') NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cost_price` decimal(10,2) NOT NULL,
  `size` enum('Малий','Середній','Великий') NOT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `shipping_available` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Сталевий поручень','Індивідуальне замовлення','Надійний сталевий поручень, ідеально підходить для сходів, балконів та ванних кімнат. Виготовлений з високоякісної нержавіючої сталі, що забезпечує довговічність та стійкість до корозії.',3200.00,'poruch.jpg','2025-05-12 17:55:07',90.00,'Середній',12.00,0),(2,'Металева решітка','Декоративні елементи','Металева решітка, призначена для вентиляції та декоративного оформлення приміщень. Завдяки міцній конструкції, вона ефективно запобігає потраплянню великих частинок пилу та забезпечує безперешкодний повітряний потік.',85.30,'reshitka.jpg','2025-05-12 17:55:07',60.00,'Малий',5.00,1),(3,'Кухонна мийка','Для ванни','Кухонна мийка з нержавіючої сталі, що має сучасний дизайн і практичну глибину для зручного миття посуду. Висока стійкість до подряпин та антикорозійне покриття роблять її ідеальним вибором для будь-якої кухні.',5640.50,'myika.jpg','2025-05-12 17:55:07',150.00,'Середній',15.00,1),(4,'Сталевий змішувач','Для ванни','Сталевий змішувач із антикорозійним покриттям, що забезпечує плавну роботу механізму та довговічність. Стильний дизайн та висока якість матеріалів роблять його чудовим доповненням до сучасної ванної кімнати.',299.99,'faucet.jpg','2025-05-13 19:23:28',210.00,'Середній',12.00,1),(5,'Металеві двері','Індивідуальне замовлення','Надійні металеві двері з антивандальним покриттям, що забезпечують максимальний захист. Виготовлені з товстої сталі, вони гарантують високий рівень безпеки та довговічність використання.',42379.00,'metal_door.jpg','2025-05-13 19:23:28',950.00,'Великий',20.00,0),(6,'Сталевий ланцюг','Декоративні елементи','Сталевий ланцюг підвищеної міцності, що використовується для кріплення, підвішування та транспортних механізмів. Завдяки оцинкованому покриттю, забезпечується захист від корозії та зношення.',89.99,'steel_chain.jpg','2025-05-13 19:23:28',65.00,'Середній',8.00,1),(7,'Решітка для вентиляції','Для димоходів та вентиляції','Решітка для вентиляції з нержавіючої сталі, що ефективно сприяє циркуляції повітря та запобігає потраплянню пилу та дрібних частинок. Ідеальний варіант для промислових та житлових приміщень.',159.00,'vent_grid.jpg','2025-05-13 19:23:28',120.00,'Малий',3.50,1),(8,'Нержавіючі перила','Індивідуальне замовлення','Високоякісні перила, які ідеально підкреслять вартість інтер\'єру своїм блиском.',4200.00,'stair_rail.jpg','2025-05-13 19:23:28',380.00,'Великий',10.00,0),(9,'Металева решітка','Декоративні елементи','Захисна решітка з нержавіючої сталі',220.00,'security_grid.jpg','2025-05-13 19:23:28',160.00,'Великий',18.00,1),(10,'Сталевий контейнер','Індивідуальне замовлення','Сталевий контейнер для зберігання та транспортування різних матеріалів. Виготовлений з високоякісної сталі, що витримує великі навантаження та має антикорозійний захист.',4200.00,'toolbox.jpg','2025-05-13 19:23:28',250.00,'Малий',9.00,1),(11,'Високоякісна труба','Для димоходів та вентиляції','Високоякісна труба з нержавіючої сталі, що використовується для систем вентиляції та димоходів. Завдяки гладкій поверхні та антикорозійному покриттю, гарантує довговічну службу.',175.99,'steel_pipe.jpg','2025-05-13 19:23:28',130.00,'Малий',4.50,1),(12,'Лист нержавійки','Рушникосушки','Лист нержавіючої сталі високої якості, що ідеально підходить для виготовлення рушникосушок, декоративних елементів та інших конструкцій. Стійкий до впливу вологи та високих температур.',9800.00,'steel_sheet.jpg','2025-05-13 19:23:28',80.00,'Великий',11.00,0),(13,'Фіксатор для труб','Для димоходів та вентиляції','Фіксатор для труб, що забезпечує надійне кріплення вентиляційних та водопровідних систем. Виготовлений зі сталі з підвищеною міцністю, що гарантує тривалу експлуатацію без деформації.',49.99,'pipe_clamp.jpg','2025-05-13 19:23:28',35.00,'Малий',6.00,1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review_text` text,
  `is_anonymous` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,'Олександр Іванов',5,'Якісний виріб, рекомендую!',0,'2025-05-12 17:55:34'),(4,1,'Олександр',5,'Дуже задоволений якістю товару, міцний і зручний!',0,'2025-05-14 14:45:00'),(5,2,'Марина',4,'Товар хороший, але упаковка могла б бути трохи кращою.',0,'2025-05-14 14:47:30'),(6,3,'Ігор',5,'Замовляю вдруге, все супер! Раджу всім!',0,'2025-05-14 14:50:15'),(7,4,'Анонім',3,'Нормальний продукт, але очікував більшої міцності.',1,'2025-05-14 14:53:40'),(8,5,'Катерина',4,'Хороший товар, використовую вже тиждень без проблем.',0,'2025-05-14 14:55:20'),(9,1,'Василь',5,'Міцний матеріал, стильний вигляд! Дуже задоволений!',0,'2025-05-14 14:58:10'),(11,3,'Світлана',5,'Все просто чудово! Сервіс на вищому рівні!',0,'2025-05-14 15:03:30'),(12,4,'Анонім',4,'Товар якісний, але доставка була трохи довга.',1,'2025-05-14 15:06:15'),(13,5,'Олег',5,'Класна річ! Мені дуже подобається!',0,'2025-05-14 15:09:00');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-20 23:44:24
