CREATE TABLE `organization_members` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`role` enum('owner','admin','member') DEFAULT 'member',
	`permissions` text,
	`invitedBy` varchar(64),
	`joinedAt` timestamp DEFAULT (now()),
	CONSTRAINT `organization_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`ownerId` varchar(64) NOT NULL,
	`subscriptionTier` enum('basic','premium','pro','business','enterprise') DEFAULT 'basic',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_invitations` (
	`id` varchar(64) NOT NULL,
	`organizationId` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('admin','member') DEFAULT 'member',
	`invitedBy` varchar(64) NOT NULL,
	`status` enum('pending','accepted','expired') DEFAULT 'pending',
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `team_invitations_id` PRIMARY KEY(`id`)
);
