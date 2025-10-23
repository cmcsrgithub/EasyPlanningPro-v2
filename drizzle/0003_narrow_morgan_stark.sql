CREATE TABLE `poll_options` (
	`id` int NOT NULL,
	`pollId` int NOT NULL,
	`text` varchar(255) NOT NULL,
	`order` int DEFAULT 0,
	CONSTRAINT `poll_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poll_votes` (
	`id` int NOT NULL,
	`pollId` int NOT NULL,
	`optionId` int NOT NULL,
	`userId` varchar(64),
	`voterName` varchar(255),
	`votedAt` timestamp DEFAULT (now()),
	CONSTRAINT `poll_votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `polls` (
	`id` int NOT NULL,
	`userId` varchar(64) NOT NULL,
	`eventId` varchar(64),
	`title` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean DEFAULT true,
	`allowMultiple` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`closesAt` timestamp,
	CONSTRAINT `polls_id` PRIMARY KEY(`id`)
);
