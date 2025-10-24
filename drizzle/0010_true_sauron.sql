CREATE TABLE `brandingSettings` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`subdomain` varchar(100),
	`customDomain` varchar(255),
	`logoUrl` varchar(1024),
	`faviconUrl` varchar(1024),
	`primaryColor` varchar(7) DEFAULT '#00AEEF',
	`secondaryColor` varchar(7),
	`brandName` varchar(255),
	`tagline` text,
	`customCss` text,
	`isWhiteLabel` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brandingSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `brandingSettings_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `brandingSettings_subdomain_unique` UNIQUE(`subdomain`)
);
