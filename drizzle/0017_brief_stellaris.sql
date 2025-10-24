ALTER TABLE `checklist_items` MODIFY COLUMN `priority` varchar(64) DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `checklist_items` MODIFY COLUMN `status` varchar(64) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `guest_list` MODIFY COLUMN `status` varchar(64) DEFAULT 'invited';--> statement-breakpoint
ALTER TABLE `tickets` MODIFY COLUMN `status` varchar(64) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `user_subscriptions` MODIFY COLUMN `plan` varchar(64) NOT NULL;