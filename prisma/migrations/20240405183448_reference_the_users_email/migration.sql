-- AddForeignKey
ALTER TABLE `TaskBoard` ADD CONSTRAINT `TaskBoard_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
