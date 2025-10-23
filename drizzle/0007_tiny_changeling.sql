CREATE TABLE `budgets` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`category` varchar(100) NOT NULL,
	`allocatedAmount` decimal(10,2) NOT NULL,
	`spentAmount` decimal(10,2) DEFAULT '0',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`amount` decimal(10,2) NOT NULL,
	`date` timestamp NOT NULL,
	`receipt` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
