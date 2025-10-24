import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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


/**
 * Polls table - Surveys and polls for events
 */
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

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = typeof polls.$inferInsert;

export const pollOptions = mysqlTable("poll_options", {
  id: int("id").primaryKey(),
  pollId: int("pollId").notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  order: int("order").default(0),
});

export type PollOption = typeof pollOptions.$inferSelect;
export type InsertPollOption = typeof pollOptions.$inferInsert;

export const pollVotes = mysqlTable("poll_votes", {
  id: int("id").primaryKey(),
  pollId: int("pollId").notNull(),
  optionId: int("optionId").notNull(),
  userId: varchar("userId", { length: 64 }),
  voterName: varchar("voterName", { length: 255 }),
  votedAt: timestamp("votedAt").defaultNow(),
});

export type PollVote = typeof pollVotes.$inferSelect;
export type InsertPollVote = typeof pollVotes.$inferInsert;

/**
 * Event payments table - Track ticket sales and registration fees
 */
export const eventPayments = mysqlTable("event_payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }),
  attendeeName: varchar("attendeeName", { length: 255 }),
  attendeeEmail: varchar("attendeeEmail", { length: 320 }),
  amount: int("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("usd"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).default("pending"),
  ticketType: varchar("ticketType", { length: 64 }),
  quantity: int("quantity").default(1),
  createdAt: timestamp("createdAt").defaultNow(),
  paidAt: timestamp("paidAt"),
});

export type EventPayment = typeof eventPayments.$inferSelect;
export type InsertEventPayment = typeof eventPayments.$inferInsert;


/**
 * Organizations table - For multi-admin accounts
 */
export const organizations = mysqlTable("organizations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["basic", "premium", "pro", "business", "enterprise"]).default("basic"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * Organization members table - Track team members
 */
export const organizationMembers = mysqlTable("organization_members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member"),
  permissions: text("permissions"), // JSON array
  invitedBy: varchar("invitedBy", { length: 64 }),
  joinedAt: timestamp("joinedAt").defaultNow(),
});

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = typeof organizationMembers.$inferInsert;

/**
 * Team invitations table
 */
export const teamInvitations = mysqlTable("team_invitations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member"),
  invitedBy: varchar("invitedBy", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending"),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertTeamInvitation = typeof teamInvitations.$inferInsert;

/**
 * Tasks table - Advanced task management for Pro tier
 */
export const tasks = mysqlTable("tasks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "done"]).default("todo").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  assignedTo: varchar("assignedTo", { length: 64 }),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Financial Reports
export const expenses = mysqlTable("expenses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  receipt: text("receipt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const budgets = mysqlTable("budgets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  allocatedAmount: decimal("allocatedAmount", { precision: 10, scale: 2 }).notNull(),
  spentAmount: decimal("spentAmount", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});



/**
 * Message Channels - Group chat channels for events
 */
export const messageChannels = mysqlTable("messageChannels", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPrivate: boolean("isPrivate").default(false),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type MessageChannel = typeof messageChannels.$inferSelect;
export type InsertMessageChannel = typeof messageChannels.$inferInsert;

/**
 * Messages - Chat messages in channels
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  channelId: varchar("channelId", { length: 64 }).notNull(),
  senderId: varchar("senderId", { length: 64 }).notNull(),
  senderName: varchar("senderName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  attachmentUrl: varchar("attachmentUrl", { length: 1024 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;




/**
 * Event Packages - Multi-event bundles for itinerary and ticketing
 */
export const eventPackages = mysqlTable("eventPackages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: varchar("imageUrl", { length: 1024 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type EventPackage = typeof eventPackages.$inferSelect;
export type InsertEventPackage = typeof eventPackages.$inferInsert;

/**
 * Package Events - Junction table for events in packages
 */
export const packageEvents = mysqlTable("packageEvents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  packageId: varchar("packageId", { length: 64 }).notNull(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  orderIndex: int("orderIndex").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PackageEvent = typeof packageEvents.$inferSelect;
export type InsertPackageEvent = typeof packageEvents.$inferInsert;

/**
 * Package Purchases - Track package ticket sales
 */
export const packagePurchases = mysqlTable("packagePurchases", {
  id: varchar("id", { length: 64 }).primaryKey(),
  packageId: varchar("packageId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  userName: varchar("userName", { length: 255 }),
  userEmail: varchar("userEmail", { length: 320 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "refunded"]).default("pending"),
  qrCode: text("qrCode"), // QR code data for ticket
  purchasedAt: timestamp("purchasedAt").defaultNow(),
});

export type PackagePurchase = typeof packagePurchases.$inferSelect;
export type InsertPackagePurchase = typeof packagePurchases.$inferInsert;




/**
 * Branding Settings - Custom subdomain and white-label configuration
 */
export const brandingSettings = mysqlTable("brandingSettings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().unique(),
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  customDomain: varchar("customDomain", { length: 255 }),
  logoUrl: varchar("logoUrl", { length: 1024 }),
  faviconUrl: varchar("faviconUrl", { length: 1024 }),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#00AEEF"),
  secondaryColor: varchar("secondaryColor", { length: 7 }),
  brandName: varchar("brandName", { length: 255 }),
  tagline: text("tagline"),
  customCss: text("customCss"),
  isWhiteLabel: boolean("isWhiteLabel").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type BrandingSettings = typeof brandingSettings.$inferSelect;
export type InsertBrandingSettings = typeof brandingSettings.$inferInsert;




/**
 * Custom Forms - Customizable registration forms for events (Business tier)
 */
export const customForms = mysqlTable("customForms", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type CustomForm = typeof customForms.$inferSelect;
export type InsertCustomForm = typeof customForms.$inferInsert;

/**
 * Form Fields - Individual fields in custom forms
 */
export const formFields = mysqlTable("formFields", {
  id: varchar("id", { length: 64 }).primaryKey(),
  formId: varchar("formId", { length: 64 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  fieldType: mysqlEnum("fieldType", ["text", "email", "number", "textarea", "select", "checkbox", "radio", "date"]).notNull(),
  options: text("options"), // JSON array for select/radio options
  isRequired: boolean("isRequired").default(false),
  orderIndex: int("orderIndex").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type FormField = typeof formFields.$inferSelect;
export type InsertFormField = typeof formFields.$inferInsert;

/**
 * Form Responses - User submissions to custom forms
 */
export const formResponses = mysqlTable("formResponses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  formId: varchar("formId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }),
  userName: varchar("userName", { length: 255 }),
  userEmail: varchar("userEmail", { length: 320 }),
  responseData: text("responseData").notNull(), // JSON object with field responses
  submittedAt: timestamp("submittedAt").defaultNow(),
});

export type FormResponse = typeof formResponses.$inferSelect;
export type InsertFormResponse = typeof formResponses.$inferInsert;

/**
 * Sponsors - Sponsor management for events (Business tier)
 */
export const sponsors = mysqlTable("sponsors", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  tier: mysqlEnum("tier", ["platinum", "gold", "silver", "bronze"]).default("bronze"),
  logoUrl: varchar("logoUrl", { length: 1024 }),
  website: varchar("website", { length: 1024 }),
  description: text("description"),
  contributionAmount: decimal("contributionAmount", { precision: 10, scale: 2 }),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = typeof sponsors.$inferInsert;

/**
 * Donations - Fundraising and donation tracking (Business tier)
 */
export const donations = mysqlTable("donations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  donorName: varchar("donorName", { length: 255 }),
  donorEmail: varchar("donorEmail", { length: 320 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  isAnonymous: boolean("isAnonymous").default(false),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "refunded"]).default("pending"),
  donatedAt: timestamp("donatedAt").defaultNow(),
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

