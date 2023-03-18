-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


-- -----------------------------------------------------
-- Schema recomendame
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `recomendame` DEFAULT CHARACTER SET utf8mb4 ;
USE `recomendame` ;

-- -----------------------------------------------------
-- Table `recomendame`.`areas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`areas` (
  `id` INT(11) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `recomendame`.`companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`companies` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  `recomendations` INT(11) NULL DEFAULT NULL,
  `image` VARCHAR(45) NOT NULL,
  `areas_id` INT(11) NOT NULL,
  `pricePoint` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_companies_areas1_idx` (`areas_id` ASC),
  CONSTRAINT `fk_companies_areas1`
    FOREIGN KEY (`areas_id`)
    REFERENCES `recomendame`.`areas` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 24
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `recomendame`.`privileges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`privileges` (
  `id` INT(11) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `recomendame`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(100) NULL DEFAULT NULL,
  `category` VARCHAR(45) NULL DEFAULT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  `points` INT(11) NOT NULL,
  `image` VARCHAR(45) NOT NULL,
  `companies_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_products_companies1_idx` (`companies_id` ASC),
  CONSTRAINT `fk_products_companies1`
    FOREIGN KEY (`companies_id`)
    REFERENCES `recomendame`.`companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `recomendame`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(150) NOT NULL,
  `image` VARCHAR(45) NOT NULL,
  `points` VARCHAR(45) NULL DEFAULT NULL,
  `privileges_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_privileges_idx` (`privileges_id` ASC),
  CONSTRAINT `fk_users_privileges`
    FOREIGN KEY (`privileges_id`)
    REFERENCES `recomendame`.`privileges` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `recomendame`.`recommendations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recomendame`.`recommendations` (
  `users_id` INT(11) NOT NULL,
  `companies_id` INT(11) NOT NULL,
  `datePresent` DATE NULL DEFAULT NULL,
  `dateConfirm` DATE NULL DEFAULT NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  INDEX `fk_users_has_companies_companies1_idx` (`companies_id` ASC),
  INDEX `fk_users_has_companies_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_users_has_companies_companies1`
    FOREIGN KEY (`companies_id`)
    REFERENCES `recomendame`.`companies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_companies_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `recomendame`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
