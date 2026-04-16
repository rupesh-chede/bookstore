-- ============================================================
-- AWS RDS MySQL - Database Setup Script
-- RDS create karne ke baad ye script run karo
-- ============================================================

-- Database create karo
CREATE DATABASE IF NOT EXISTS books CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE books;

-- Tables (Spring Boot auto-create bhi kar sakta hai, par
-- manually bhi run kar sakte ho)

CREATE TABLE IF NOT EXISTS `register` (
  `id`        BIGINT NOT NULL AUTO_INCREMENT,
  `name`      VARCHAR(100) NOT NULL,
  `email`     VARCHAR(100) NOT NULL UNIQUE,
  `password`  VARCHAR(100) NOT NULL,
  `user_type` VARCHAR(20) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `products` (
  `id`    BIGINT NOT NULL AUTO_INCREMENT,
  `name`  VARCHAR(100) NOT NULL,
  `price` INT NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `cart` (
  `id`       BIGINT NOT NULL AUTO_INCREMENT,
  `user_id`  BIGINT NOT NULL,
  `name`     VARCHAR(100) NOT NULL,
  `price`    INT NOT NULL,
  `quantity` INT NOT NULL,
  `image`    VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `orders` (
  `id`             BIGINT NOT NULL AUTO_INCREMENT,
  `user_id`        BIGINT NOT NULL,
  `name`           VARCHAR(100) NOT NULL,
  `number`         VARCHAR(12) NOT NULL,
  `email`          VARCHAR(100) NOT NULL,
  `method`         VARCHAR(50) NOT NULL,
  `address`        VARCHAR(500) NOT NULL,
  `total_products` VARCHAR(1000) NOT NULL,
  `total_price`    INT NOT NULL,
  `placed_on`      VARCHAR(50) NOT NULL,
  `payment_status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `message` (
  `id`      BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `name`    VARCHAR(100) NOT NULL,
  `email`   VARCHAR(100) NOT NULL,
  `number`  VARCHAR(12) NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- ============================================================
-- Default Admin User insert karo (password: admin123)
-- BCrypt hash hai - login karke change karo
-- ============================================================
INSERT IGNORE INTO `register` (name, email, password, user_type)
VALUES (
  'Admin',
  'admin@bookstore.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
);

-- ============================================================
-- AWS RDS Setup Steps (README):
-- 
-- 1. AWS Console > RDS > Create Database
-- 2. Engine: MySQL 8.0
-- 3. Template: Free Tier (ya production ke liye Multi-AZ)
-- 4. DB identifier: bookstore-db
-- 5. Master username: admin
-- 6. Master password: (strong password daalo)
-- 7. DB name: books
-- 8. VPC: Backend EC2 ke same VPC mein
-- 9. Security Group: EC2 se port 3306 allow karo
-- 10. Public access: No (private rehne do)
--
-- RDS Endpoint milega:
-- bookstore-db.xxxxx.ap-south-1.rds.amazonaws.com
--
-- Ye endpoint deploy-backend-ec2.sh mein DB_HOST mein daalo
-- ============================================================
