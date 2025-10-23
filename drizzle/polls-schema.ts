import { mysqlTable, varchar, text, int, timestamp, boolean } from "drizzle-orm/mysql-core";

export const polls = mysqlTable("polls", {
  id: int("id").primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  eventId: varchar("eventId", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true),
  allowMultiple: boolean("allowMultiple").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  closesAt: timestamp("closesAt"),
});

export const pollOptions = mysqlTable("poll_options", {
  id: int("id").primaryKey(),
  pollId: int("pollId").notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  order: int("order").default(0),
});

export const pollVotes = mysqlTable("poll_votes", {
  id: int("id").primaryKey(),
  pollId: int("pollId").notNull(),
  optionId: int("optionId").notNull(),
  userId: varchar("userId", { length: 64 }),
  voterName: varchar("voterName", { length: 255 }),
  votedAt: timestamp("votedAt").defaultNow(),
});

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = typeof polls.$inferInsert;
export type PollOption = typeof pollOptions.$inferSelect;
export type InsertPollOption = typeof pollOptions.$inferInsert;
export type PollVote = typeof pollVotes.$inferSelect;
export type InsertPollVote = typeof pollVotes.$inferInsert;

