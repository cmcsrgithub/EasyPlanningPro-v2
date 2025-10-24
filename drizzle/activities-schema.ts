import { pgTable, text, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const activities = pgTable("activities", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  eventId: text("event_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  activityType: text("activity_type"), // workshop, session, tour, meal, etc.
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  venueId: text("venue_id"),
  location: text("location"),
  capacity: integer("capacity"),
  registrationRequired: boolean("registration_required").default(false),
  registrationDeadline: timestamp("registration_deadline"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  organizerId: text("organizer_id"),
  organizerName: text("organizer_name"),
  materials: text("materials"), // JSON string of required materials
  equipment: text("equipment"), // JSON string of required equipment
  notes: text("notes"),
  status: text("status").default("active"), // active, cancelled, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activityRegistrations = pgTable("activity_registrations", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  activityId: text("activity_id").notNull(),
  userId: text("user_id").notNull(),
  memberId: text("member_id"),
  registeredAt: timestamp("registered_at").defaultNow(),
  status: text("status").default("confirmed"), // confirmed, cancelled, waitlist
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

