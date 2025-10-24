import { boolean, json, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const templateCustomizations = mysqlTable("template_customizations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("event_id", { length: 64 }),
  userId: varchar("user_id", { length: 64 }).notNull(),
  
  // Template info
  templateId: varchar("template_id", { length: 64 }).notNull(),
  
  // Free user customizations
  colorScheme: varchar("color_scheme", { length: 64 }).default("default"), // predefined scheme name
  fontFamily: varchar("font_family", { length: 64 }).default("inter"), // inter, roboto, poppins, playfair
  
  // Paid user customizations
  customBackgroundColor: varchar("custom_background_color", { length: 16 }), // hex color
  customFontColor: varchar("custom_font_color", { length: 16 }), // hex color
  customAccentColor: varchar("custom_accent_color", { length: 16 }), // hex color
  
  // Shareable link
  shareableSlug: varchar("shareable_slug", { length: 128 }),
  isPubliclyAccessible: boolean("is_publicly_accessible").default(true),
  
  // Additional settings
  customSettings: json("custom_settings"), // for future extensibility
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TemplateCustomization = typeof templateCustomizations.$inferSelect;
export type NewTemplateCustomization = typeof templateCustomizations.$inferInsert;

