CREATE TABLE `event_payments` (
	`id` varchar(64) NOT NULL,
	`eventId` varchar(64) NOT NULL,
	`userId` varchar(64),
	`attendeeName` varchar(255),
	`attendeeEmail` varchar(320),
	`amount` int NOT NULL,
	`currency` varchar(3) DEFAULT 'usd',
	`stripePaymentIntentId` varchar(255),
	`status` enum('pending','succeeded','failed','refunded') DEFAULT 'pending',
	`ticketType` varchar(64),
	`quantity` int DEFAULT 1,
	`createdAt` timestamp DEFAULT (now()),
	`paidAt` timestamp,
	CONSTRAINT `event_payments_id` PRIMARY KEY(`id`)
);
