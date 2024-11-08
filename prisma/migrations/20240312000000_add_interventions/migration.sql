-- CreateTable
CREATE TABLE `Intervention` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `location` JSON NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `siteName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `technicianId` VARCHAR(191) NULL,
    `buyPrice` DOUBLE NULL,
    `sellPrice` DOUBLE NULL,
    `isSubcontracted` BOOLEAN NOT NULL DEFAULT false,
    `invoiceStatus` VARCHAR(191) NULL,
    `invoiceNumber` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `trackingNumbers` TEXT NULL,
    `attachments` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Intervention_clientId_idx`(`clientId`),
    INDEX `Intervention_technicianId_idx`(`technicianId`),
    INDEX `Intervention_projectId_idx`(`projectId`),
    INDEX `Intervention_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Intervention` ADD CONSTRAINT `Intervention_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;