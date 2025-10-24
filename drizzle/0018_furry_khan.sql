ALTER TABLE `checklist_items` MODIFY COLUMN `checklist_id` varchar(64);--> statement-breakpoint
ALTER TABLE `checklists` MODIFY COLUMN `event_id` varchar(64);--> statement-breakpoint
ALTER TABLE `guest_list` MODIFY COLUMN `event_id` varchar(64);--> statement-breakpoint
ALTER TABLE `invitations` MODIFY COLUMN `event_id` varchar(64);--> statement-breakpoint
ALTER TABLE `seating_charts` MODIFY COLUMN `event_id` varchar(64);--> statement-breakpoint
ALTER TABLE `seating_tables` MODIFY COLUMN `chart_id` varchar(64);--> statement-breakpoint
ALTER TABLE `ticket_types` MODIFY COLUMN `event_id` varchar(64);--> statement-breakpoint
ALTER TABLE `tickets` MODIFY COLUMN `event_id` varchar(64);--> statement-breakpoint
ALTER TABLE `tickets` MODIFY COLUMN `ticket_type_id` varchar(64);--> statement-breakpoint
ALTER TABLE `user_subscriptions` MODIFY COLUMN `user_id` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_subscriptions` MODIFY COLUMN `stripe_subscription_id` varchar(64);--> statement-breakpoint
ALTER TABLE `user_subscriptions` MODIFY COLUMN `stripe_customer_id` varchar(64);