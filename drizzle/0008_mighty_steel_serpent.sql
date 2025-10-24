CREATE TABLE `messageChannels` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isPrivate` boolean DEFAULT false,
	`createdBy` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messageChannels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`channelId` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`senderName` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`attachmentUrl` varchar(1024),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
