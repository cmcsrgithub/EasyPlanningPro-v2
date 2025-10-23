CREATE TABLE `albums` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`eventId` varchar(64),
	`title` varchar(255) NOT NULL,
	`description` text,
	`isPrivate` boolean DEFAULT false,
	`coverPhotoUrl` varchar(1024),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `albums_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventType` varchar(64),
	`startDate` timestamp,
	`endDate` timestamp,
	`location` text,
	`venueId` varchar(64),
	`isPublic` boolean DEFAULT false,
	`maxAttendees` int,
	`imageUrl` varchar(1024),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`branch` varchar(100),
	`interests` text,
	`bio` text,
	`avatarUrl` varchar(1024),
	`isAdmin` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`eventId` varchar(64),
	`albumId` varchar(64),
	`title` varchar(255),
	`description` text,
	`s3Key` varchar(512) NOT NULL,
	`s3Url` varchar(1024) NOT NULL,
	`thumbnailUrl` varchar(1024),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`userId` varchar(64),
	`guestName` varchar(255),
	`guestEmail` varchar(320),
	`status` enum('yes','no','maybe') NOT NULL,
	`guestCount` int DEFAULT 1,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rsvps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `venues` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(20),
	`capacity` int,
	`description` text,
	`amenities` text,
	`contactName` varchar(255),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`imageUrl` varchar(1024),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `venues_id` PRIMARY KEY(`id`)
);
