CREATE TABLE `eventTemplates` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`eventType` varchar(100),
	`defaultDuration` int,
	`defaultMaxAttendees` int,
	`defaultIsPublic` boolean DEFAULT true,
	`templateData` json,
	`imageUrl` text,
	`isPublic` boolean DEFAULT false,
	`createdBy` varchar(64),
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `eventTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventWaitlist` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`position` int,
	`status` enum('waiting','offered','accepted','declined','expired') DEFAULT 'waiting',
	`notes` text,
	`joinedAt` timestamp DEFAULT (now()),
	`offeredAt` timestamp,
	`respondedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `eventWaitlist_id` PRIMARY KEY(`id`)
);
