CREATE TABLE `eventPackages` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2),
	`imageUrl` varchar(1024),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventPackages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packageEvents` (
	`id` varchar(64) NOT NULL,
	`packageId` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`orderIndex` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `packageEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packagePurchases` (
	`id` varchar(64) NOT NULL,
	`packageId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`userName` varchar(255),
	`userEmail` varchar(320),
	`amount` decimal(10,2) NOT NULL,
	`stripePaymentId` varchar(255),
	`status` enum('pending','completed','refunded') DEFAULT 'pending',
	`qrCode` text,
	`purchasedAt` timestamp DEFAULT (now()),
	CONSTRAINT `packagePurchases_id` PRIMARY KEY(`id`)
);
