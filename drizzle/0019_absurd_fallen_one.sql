CREATE TABLE `template_customizations` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64),
	`userId` varchar(64) NOT NULL,
	`templateId` varchar(64) NOT NULL,
	`colorScheme` varchar(64) DEFAULT 'default',
	`fontFamily` varchar(64) DEFAULT 'inter',
	`customBackgroundColor` varchar(16),
	`customFontColor` varchar(16),
	`customAccentColor` varchar(16),
	`shareableSlug` varchar(128),
	`isPubliclyAccessible` boolean DEFAULT true,
	`customSettings` json,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `template_customizations_id` PRIMARY KEY(`id`)
);
