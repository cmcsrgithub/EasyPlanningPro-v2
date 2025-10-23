import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Subscription fields
  subscriptionTier: mysqlEnum("subscriptionTier", ["basic", "premium", "pro", "business", "enterprise"]).default("basic").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "trialing"]),
  subscriptionEndsAt: timestamp("subscriptionEndsAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Events table - Core feature for event management
 */
export const events = mysqlTable("events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("eventType", { length: 64 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  location: text("location"),
  venueId: varchar("venueId", { length: 64 }),
  isPublic: boolean("isPublic").default(false),
  maxAttendees: int("maxAttendees"),
  imageUrl: varchar("imageUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * RSVPs table - Track event responses
 */
export const rsvps = mysqlTable("rsvps", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }),
  guestName: varchar("guestName", { length: 255 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  status: mysqlEnum("status", ["yes", "no", "maybe"]).notNull(),
  guestCount: int("guestCount").default(1),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = typeof rsvps.$inferInsert;

/**
 * Venues table - Venue management
 */
export const venues = mysqlTable("venues", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 20 }),
  capacity: int("capacity"),
  description: text("description"),
  amenities: text("amenities"), // JSON string
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  imageUrl: varchar("imageUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = typeof venues.$inferInsert;

/**
 * Members table - Directory/member management
 */
export const members = mysqlTable("members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(), // owner
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  branch: varchar("branch", { length: 100 }),
  interests: text("interests"), // JSON string
  bio: text("bio"),
  avatarUrl: varchar("avatarUrl", { length: 1024 }),
  isAdmin: boolean("isAdmin").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

/**
 * Albums table - Photo album management
 */
export const albums = mysqlTable("albums", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  eventId: varchar("eventId", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isPrivate: boolean("isPrivate").default(false),
  coverPhotoUrl: varchar("coverPhotoUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Album = typeof albums.$inferSelect;
export type InsertAlbum = typeof albums.$inferInsert;

/**
 * Photos table - Photo management
 */
export const photos = mysqlTable("photos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  eventId: varchar("eventId", { length: 64 }),
  albumId: varchar("albumId", { length: 64 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  s3Key: varchar("s3Key", { length: 512 }).notNull(),
  s3Url: varchar("s3Url", { length: 1024 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

