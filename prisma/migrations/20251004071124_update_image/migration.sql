/*
  Warnings:

  - Made the column `target` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `image` VARCHAR(255) NULL,
    MODIFY `target` VARCHAR(255) NOT NULL;
