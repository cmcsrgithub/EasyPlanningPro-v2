CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entity_type` varchar(50),
	`entity_id` int,
	`details` json,
	`ip_address` varchar(45),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flagged_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content_type` varchar(50) NOT NULL,
	`content_id` int NOT NULL,
	`reported_by` int NOT NULL,
	`reason` varchar(100) NOT NULL,
	`description` text,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`reviewed_by` int,
	`reviewed_at` timestamp,
	`review_notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `flagged_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moderation_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moderator_id` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`target_type` varchar(50) NOT NULL,
	`target_id` int NOT NULL,
	`reason` text,
	`duration` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `moderation_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metric` varchar(100) NOT NULL,
	`value` int NOT NULL,
	`endpoint` varchar(255),
	`method` varchar(10),
	`status_code` int,
	`user_id` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `performance_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` varchar(50) NOT NULL,
	`permission_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`category` varchar(50) NOT NULL,
	`description` text,
	`is_public` boolean DEFAULT false,
	`updated_by` int,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `system_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `system_config_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `system_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` varchar(20) NOT NULL,
	`category` varchar(50) NOT NULL,
	`message` text NOT NULL,
	`details` json,
	`user_id` int,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `system_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`role` varchar(50) NOT NULL,
	`assigned_by` int,
	`assigned_at` timestamp DEFAULT (now()),
	`expires_at` timestamp,
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_suspensions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`suspended_by` int NOT NULL,
	`reason` text NOT NULL,
	`start_date` timestamp DEFAULT (now()),
	`end_date` timestamp,
	`is_permanent` boolean DEFAULT false,
	`is_active` boolean DEFAULT true,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_suspensions_id` PRIMARY KEY(`id`)
);
