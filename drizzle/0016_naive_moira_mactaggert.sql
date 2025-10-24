CREATE TABLE `checklist_items` (
	`id` varchar(64) NOT NULL,
	`checklist_id` text,
	`title` text NOT NULL,
	`description` text,
	`due_date` timestamp,
	`assigned_to` text,
	`priority` text DEFAULT ('medium'),
	`status` text DEFAULT ('pending'),
	`completed_at` timestamp,
	`completed_by` text,
	`order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `checklist_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checklists` (
	`id` varchar(64) NOT NULL,
	`event_id` text,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`is_template` boolean DEFAULT false,
	`created_by` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `checklists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_types` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`default_duration` int,
	`default_capacity` int,
	`custom_fields` json,
	`is_active` boolean DEFAULT true,
	`created_by` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `event_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guest_list` (
	`id` varchar(64) NOT NULL,
	`event_id` text,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`status` text DEFAULT ('invited'),
	`category` text,
	`dietary_restrictions` text,
	`special_needs` text,
	`table_assignment` text,
	`seat_number` text,
	`checked_in` boolean DEFAULT false,
	`checked_in_at` timestamp,
	`plus_ones` int DEFAULT 0,
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `guest_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` varchar(64) NOT NULL,
	`event_id` text,
	`recipient_email` text NOT NULL,
	`recipient_name` text,
	`status` text NOT NULL DEFAULT ('pending'),
	`message` text,
	`sent_at` timestamp,
	`opened_at` timestamp,
	`responded_at` timestamp,
	`plus_ones` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `invitations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seating_charts` (
	`id` varchar(64) NOT NULL,
	`event_id` text,
	`name` text NOT NULL,
	`layout` json,
	`total_seats` int,
	`assigned_seats` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `seating_charts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seating_tables` (
	`id` varchar(64) NOT NULL,
	`chart_id` text,
	`table_number` text NOT NULL,
	`capacity` int NOT NULL,
	`shape` text DEFAULT ('round'),
	`position` json,
	`assigned_guests` int DEFAULT 0,
	`notes` text,
	CONSTRAINT `seating_tables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_types` (
	`id` varchar(64) NOT NULL,
	`event_id` text,
	`name` text NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`quantity` int,
	`sold` int DEFAULT 0,
	`sales_start` timestamp,
	`sales_end` timestamp,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `ticket_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` varchar(64) NOT NULL,
	`event_id` text,
	`ticket_type_id` text,
	`attendee_name` text NOT NULL,
	`attendee_email` text NOT NULL,
	`ticket_number` text NOT NULL,
	`qr_code` text,
	`status` text DEFAULT ('active'),
	`purchase_price` decimal(10,2),
	`purchased_at` timestamp DEFAULT (now()),
	`used_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `tickets_ticket_number_unique` UNIQUE(`ticket_number`)
);
--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` varchar(64) NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`status` text NOT NULL DEFAULT ('active'),
	`stripe_subscription_id` text,
	`stripe_customer_id` text,
	`current_period_start` timestamp,
	`current_period_end` timestamp,
	`cancel_at_period_end` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_checklist_id_checklists_id_fk` FOREIGN KEY (`checklist_id`) REFERENCES `checklists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checklists` ADD CONSTRAINT `checklists_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guest_list` ADD CONSTRAINT `guest_list_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seating_charts` ADD CONSTRAINT `seating_charts_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seating_tables` ADD CONSTRAINT `seating_tables_chart_id_seating_charts_id_fk` FOREIGN KEY (`chart_id`) REFERENCES `seating_charts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_types` ADD CONSTRAINT `ticket_types_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;