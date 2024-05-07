-- DropForeignKey
ALTER TABLE `column` DROP FOREIGN KEY `Column_board_id_fkey`;

-- DropForeignKey
ALTER TABLE `subtask` DROP FOREIGN KEY `Subtask_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_column_id_fkey`;

-- AddForeignKey
ALTER TABLE `Column` ADD CONSTRAINT `Column_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `TaskBoard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_column_id_fkey` FOREIGN KEY (`column_id`) REFERENCES `Column`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subtask` ADD CONSTRAINT `Subtask_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
