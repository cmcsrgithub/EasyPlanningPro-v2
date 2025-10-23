ALTER TABLE `users` ADD `subscriptionTier` enum('basic','premium','pro','business','enterprise') DEFAULT 'basic' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','canceled','past_due','trialing');--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndsAt` timestamp;