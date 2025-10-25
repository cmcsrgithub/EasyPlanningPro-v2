import { mysqlTable, varchar, text, int, timestamp, boolean, json } from "drizzle-orm/mysql-core";

// User Roles and Permissions
export const userRoles = mysqlTable("user_roles", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // 'admin', 'moderator', 'user', 'guest'
  assignedBy: int("assigned_by"),
  assignedAt: timestamp("assigned_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const permissions = mysqlTable("permissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // 'users', 'events', 'content', 'system'
  createdAt: timestamp("created_at").defaultNow(),
});

export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").primaryKey().autoincrement(),
  role: varchar("role", { length: 50 }).notNull(),
  permissionId: int("permission_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Logs
export const systemLogs = mysqlTable("system_logs", {
  id: int("id").primaryKey().autoincrement(),
  level: varchar("level", { length: 20 }).notNull(), // 'info', 'warning', 'error', 'critical'
  category: varchar("category", { length: 50 }).notNull(), // 'auth', 'api', 'database', 'payment'
  message: text("message").notNull(),
  details: json("details"),
  userId: int("user_id"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // 'create', 'update', 'delete', 'login', 'logout'
  entityType: varchar("entity_type", { length: 50 }), // 'event', 'user', 'venue', 'post'
  entityId: int("entity_id"),
  details: json("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Moderation
export const flaggedContent = mysqlTable("flagged_content", {
  id: int("id").primaryKey().autoincrement(),
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'comment', 'post', 'photo', 'message'
  contentId: int("content_id").notNull(),
  reportedBy: int("reported_by").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(), // 'spam', 'inappropriate', 'harassment', 'other'
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'reviewed', 'approved', 'removed'
  reviewedBy: int("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moderationActions = mysqlTable("moderation_actions", {
  id: int("id").primaryKey().autoincrement(),
  moderatorId: int("moderator_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(), // 'approve', 'remove', 'warn', 'ban'
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'user', 'content'
  targetId: int("target_id").notNull(),
  reason: text("reason"),
  duration: int("duration"), // in days, for temporary bans
  createdAt: timestamp("created_at").defaultNow(),
});

// System Configuration
export const systemConfig = mysqlTable("system_config", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'general', 'email', 'payment', 'security'
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  updatedBy: int("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance Metrics
export const performanceMetrics = mysqlTable("performance_metrics", {
  id: int("id").primaryKey().autoincrement(),
  metric: varchar("metric", { length: 100 }).notNull(), // 'api_response_time', 'database_query_time', 'page_load_time'
  value: int("value").notNull(), // in milliseconds
  endpoint: varchar("endpoint", { length: 255 }),
  method: varchar("method", { length: 10 }),
  statusCode: int("status_code"),
  userId: int("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Suspensions
export const userSuspensions = mysqlTable("user_suspensions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  suspendedBy: int("suspended_by").notNull(),
  reason: text("reason").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isPermanent: boolean("is_permanent").default(false),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

