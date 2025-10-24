CREATE TABLE `forumReplies` (
	`id` varchar(64) NOT NULL,
	`topicId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`authorId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `forumReplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forumTopics` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64),
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`authorId` varchar(64) NOT NULL,
	`isPinned` boolean DEFAULT false,
	`isLocked` boolean DEFAULT false,
	`viewCount` int DEFAULT 0,
	`replyCount` int DEFAULT 0,
	`lastReplyAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `forumTopics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64),
	`subject` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(100),
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
	`submittedBy` varchar(64) NOT NULL,
	`assignedTo` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticketComments` (
	`id` varchar(64) NOT NULL,
	`ticketId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`authorId` varchar(64) NOT NULL,
	`isInternal` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `ticketComments_id` PRIMARY KEY(`id`)
);
