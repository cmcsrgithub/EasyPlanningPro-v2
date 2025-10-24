CREATE TABLE `activities` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`activityType` varchar(100),
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`venueId` varchar(64),
	`location` varchar(500),
	`capacity` int,
	`registrationRequired` boolean DEFAULT false,
	`registrationDeadline` timestamp,
	`price` decimal(10,2) DEFAULT '0',
	`organizerId` varchar(64),
	`organizerName` varchar(255),
	`materials` text,
	`equipment` text,
	`notes` text,
	`status` enum('active','cancelled','completed') DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activityRegistrations` (
	`id` varchar(64) NOT NULL,
	`activityId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`memberId` varchar(64),
	`registeredAt` timestamp DEFAULT (now()),
	`status` enum('confirmed','cancelled','waitlist') DEFAULT 'confirmed',
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `activityRegistrations_id` PRIMARY KEY(`id`)
);
