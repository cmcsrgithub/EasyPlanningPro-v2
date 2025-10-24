ALTER TABLE `checklist_items` MODIFY COLUMN `priority` varchar(20) DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `checklist_items` MODIFY COLUMN `status` varchar(20) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `user_subscriptions` MODIFY COLUMN `status` varchar(20) NOT NULL DEFAULT 'active';