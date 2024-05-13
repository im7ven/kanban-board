/*
  Warnings:

  - You are about to alter the column `isNew` on the `column` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `column` MODIFY `isNew` BOOLEAN NULL;
