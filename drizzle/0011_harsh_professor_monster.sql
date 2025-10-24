CREATE TABLE `customForms` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customForms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`donorName` varchar(255),
	`donorEmail` varchar(320),
	`amount` decimal(10,2) NOT NULL,
	`message` text,
	`isAnonymous` boolean DEFAULT false,
	`stripePaymentId` varchar(255),
	`status` enum('pending','completed','refunded') DEFAULT 'pending',
	`donatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `formFields` (
	`id` varchar(64) NOT NULL,
	`formId` varchar(64) NOT NULL,
	`label` varchar(255) NOT NULL,
	`fieldType` enum('text','email','number','textarea','select','checkbox','radio','date') NOT NULL,
	`options` text,
	`isRequired` boolean DEFAULT false,
	`orderIndex` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `formFields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `formResponses` (
	`id` varchar(64) NOT NULL,
	`formId` varchar(64) NOT NULL,
	`userId` varchar(64),
	`userName` varchar(255),
	`userEmail` varchar(320),
	`responseData` text NOT NULL,
	`submittedAt` timestamp DEFAULT (now()),
	CONSTRAINT `formResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`tier` enum('platinum','gold','silver','bronze') DEFAULT 'bronze',
	`logoUrl` varchar(1024),
	`website` varchar(1024),
	`description` text,
	`contributionAmount` decimal(10,2),
	`contactName` varchar(255),
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `sponsors_id` PRIMARY KEY(`id`)
);
