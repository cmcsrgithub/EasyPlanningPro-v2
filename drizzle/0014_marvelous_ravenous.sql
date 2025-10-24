CREATE TABLE `accommodations` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`checkInDate` timestamp,
	`checkOutDate` timestamp,
	`confirmationNumber` varchar(100),
	`roomType` varchar(100),
	`cost` decimal(10,2),
	`contactPhone` varchar(50),
	`notes` text,
	`status` enum('planned','booked','confirmed','cancelled') DEFAULT 'planned',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `accommodations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `travelArrangements` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`travelType` enum('flight','train','bus','car','other') NOT NULL,
	`departureLocation` varchar(255),
	`arrivalLocation` varchar(255),
	`departureTime` timestamp,
	`arrivalTime` timestamp,
	`confirmationNumber` varchar(100),
	`carrier` varchar(255),
	`cost` decimal(10,2),
	`notes` text,
	`status` enum('planned','booked','confirmed','cancelled') DEFAULT 'planned',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `travelArrangements_id` PRIMARY KEY(`id`)
);
