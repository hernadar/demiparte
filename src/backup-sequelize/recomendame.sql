-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Schema recomendame
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `recomendame` DEFAULT CHARACTER SET utf8 ;
USE `recomendame` ;




DROP TABLE IF EXISTS `privileges`;
-- -----------------------------------------------------
-- Table `recomendame`.`privileges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`privileges` (
  `idprivilege` INT(11) NOT NULL ,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idprivilege`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;

-- Dumping data for table `privileges`
LOCK TABLES `privileges` WRITE;
/*!40000 ALTER TABLE `privileges` DISABLE KEYS */;
INSERT INTO `privileges` VALUES (1,'Recomendador'),(2,'Recomendado'),(3,'Administrador');
/*!40000 ALTER TABLE `privileges` ENABLE KEYS */;
UNLOCK TABLES;


-- -----------------------------------------------------
-- Table `recomendame`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`users` (
  `iduser` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `image` VARCHAR(45) NOT NULL,
  `points` INT(11) NULL DEFAULT NULL,
  `privilege` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`iduser`),
  KEY `fk_users_privileges` (`privilege`),
  CONSTRAINT `fk_users_privileges`
    FOREIGN KEY (`privilege`)
    REFERENCES `recomendame`.`privileges` (`idprivilege`)
    )
ENGINE = InnoDB
AUTO_INCREMENT = 28
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '	';
-- -----------------------------------------------------
-- Table `recomendame`.`companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`companies` (
  `idcompany` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `area` VARCHAR(45) NOT NULL,
  `description` VARCHAR(150) NOT NULL,
  `pricepoint` DOUBLE NOT NULL,
  `image` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idcompany`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `recomendame`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`products` (
  `idproducts` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `category` VARCHAR(45) NOT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  `points` INT(11) NOT NULL,
  `image` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idproducts`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `recomendame`.`recommendations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`recommendations` (
  `idrecommendations` INT(11) NOT NULL AUTO_INCREMENT,
  `date_issued` DATE NOT NULL,
  `date_presented` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`idrecommendations`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
-- -----------------------------------------------------
-- Table `recomendame`.`exchanges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`exchanges` (
  `idexchange` INT(11) NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `idproduct` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idexchange`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
