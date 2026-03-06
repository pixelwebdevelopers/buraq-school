-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `role` ENUM('ADMIN', 'PRINCIPAL', 'STAFF') NOT NULL DEFAULT 'STAFF',
    `branchId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `principalId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_principalId_key`(`principalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `families` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fatherName` VARCHAR(100) NOT NULL,
    `fatherPhone` VARCHAR(20) NOT NULL,
    `fatherOccupation` VARCHAR(100) NULL,
    `balance` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `branchId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `families_fatherPhone_branchId_key`(`fatherPhone`, `branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admissionNo` VARCHAR(30) NOT NULL,
    `referenceNo` VARCHAR(30) NULL,
    `name` VARCHAR(100) NOT NULL,
    `dateOfBirth` VARCHAR(20) NULL,
    `formBNicNo` VARCHAR(30) NULL,
    `previousSchool` VARCHAR(150) NULL,
    `caste` VARCHAR(50) NULL,
    `religion` VARCHAR(50) NULL,
    `gender` VARCHAR(10) NULL,
    `classAdmitted` VARCHAR(30) NULL,
    `referenceInSchool` VARCHAR(100) NULL,
    `specialInfo` TEXT NULL,
    `guardianName` VARCHAR(100) NULL,
    `guardianRelation` VARCHAR(50) NULL,
    `houseNo` VARCHAR(20) NULL,
    `streetNo` VARCHAR(20) NULL,
    `blockPhase` VARCHAR(50) NULL,
    `mohallahColony` VARCHAR(100) NULL,
    `cell1` VARCHAR(20) NULL,
    `cell2` VARCHAR(20) NULL,
    `whatsapp` VARCHAR(20) NULL,
    `schoolLeavingCert` BOOLEAN NOT NULL DEFAULT false,
    `characterCert` BOOLEAN NOT NULL DEFAULT false,
    `birthCert` BOOLEAN NOT NULL DEFAULT false,
    `admissionFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `monthlyFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `annualCharges` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `academyFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `labMiscFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `branchId` INTEGER NOT NULL,
    `familyId` INTEGER NOT NULL,
    `enrolledById` INTEGER NULL,
    `admissionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `students_admissionNo_key`(`admissionNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `familyId` INTEGER NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `method` VARCHAR(30) NULL,
    `remarks` TEXT NULL,
    `receivedById` INTEGER NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `familyId` INTEGER NOT NULL,
    `studentId` INTEGER NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `description` VARCHAR(255) NULL,
    `billedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branches` ADD CONSTRAINT `branches_principalId_fkey` FOREIGN KEY (`principalId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `families` ADD CONSTRAINT `families_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_enrolledById_fkey` FOREIGN KEY (`enrolledById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_receivedById_fkey` FOREIGN KEY (`receivedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_logs` ADD CONSTRAINT `fee_logs_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `families`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fee_logs` ADD CONSTRAINT `fee_logs_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
