# EasyPlanningPro v2 - Implementation Guide for Remaining Features

This document provides detailed implementation instructions for all remaining features (50% of the application).

---

## Current Status: 50% Complete

### ✅ Completed Features
- Stripe subscription system with event limits
- Polls & surveys (full CRUD + voting)
- Events, venues, members, gallery (full CRUD)
- Dashboard with statistics
- Settings and account management
- Professional landing page with pricing
- Apple-inspired design system
- Payment backend API (created, not yet integrated into UI)

### 🚧 Remaining Features (This Guide)
- Payment collection UI for event tickets
- Calendar integration (Google/Outlook)
- Multi-admin accounts
- Private group messaging
- Multi-event itinerary & ticketing
- Advanced task management
- Custom subdomain branding
- Financial reporting
- Custom registration forms
- CSV export
- Sponsor management
- Fundraising tools
- Advanced analytics

---

## Phase 2: Premium Features (Remaining)

### 1. Payment Collection for Events ⏱️ 2-3 days

**Backend:** ✅ Already implemented (`server/routers/payments.ts`)

**Frontend Implementation:**

#### A. Add Ticket Pricing to Event Form

**File:** `client/src/pages/EventForm.tsx`

Add fields:
```tsx
const [ticketingEnabled, setTicketingEnabled] = useState(false);
const [ticketTypes, setTicketTypes] = useState([
  { name: "General Admission", price: 0, quantity: 100 }
]);

// In form JSX:
<div className="space-y-4">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={ticketingEnabled}
      onChange={(e) => setTicketingEnabled(e.target.checked)}
    />
    <span>Enable Ticket Sales</span>
  </label>

  {ticketingEnabled && (
    <div className="space-y-2">
      {ticketTypes.map((ticket, index) => (
        <div key={index} className="flex gap-2">
          <input
            placeholder="Ticket Name"
            value={ticket.name}
            onChange={(e) => {
              const updated = [...ticketTypes];
              updated[index].name = e.target.value;
              setTicketTypes(updated);
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={ticket.price}
            onChange={(e) => {
              const updated = [...ticketTypes];
              updated[index].price = parseFloat(e.target.value);
              setTicketTypes(updated);
            }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={ticket.quantity}
            onChange={(e) => {
              const updated = [...ticketTypes];
              updated[index].quantity = parseInt(e.target.value);
              setTicketTypes(updated);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setTicketTypes([...ticketTypes, { name: "", price: 0, quantity: 0 }])}
      >
        Add Ticket Type
      </button>
    </div>
  )}
</div>
```

#### B. Create Payment Checkout Page

**File:** `client/src/pages/EventCheckout.tsx`

```tsx
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "@/lib/trpc";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ eventId, ticketType, amount }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");

  const createPayment = trpc.payments.createPaymentIntent.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Create payment intent
    const { clientSecret } = await createPayment.mutateAsync({
      eventId,
      amount: amount * 100, // Convert to cents
      ticketType,
      quantity: 1,
      attendeeName,
      attendeeEmail,
    });

    // Confirm payment
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/events/${eventId}/payment-success`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Your Name"
        value={attendeeName}
        onChange={(e) => setAttendeeName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={attendeeEmail}
        onChange={(e) => setAttendeeEmail(e.target.value)}
        required
      />
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
}

export default function EventCheckout() {
  const { eventId } = useParams();
  // ... implementation
}
```

#### C. Add Payment Management to Event Detail Page

**File:** `client/src/pages/EventDetail.tsx`

Add tab for "Payments" showing:
- Total revenue
- Number of tickets sold
- List of payments with refund option
- Payment statistics

```tsx
const { data: stats } = trpc.payments.getEventPaymentStats.useQuery({ eventId });
const { data: payments } = trpc.payments.listEventPayments.useQuery({ eventId });

// In JSX:
<div className="grid grid-cols-3 gap-4">
  <Card>
    <h3>Total Revenue</h3>
    <p className="text-2xl">${(stats?.totalRevenue || 0) / 100}</p>
  </Card>
  <Card>
    <h3>Tickets Sold</h3>
    <p className="text-2xl">{stats?.totalTickets || 0}</p>
  </Card>
  <Card>
    <h3>Successful Payments</h3>
    <p className="text-2xl">{stats?.successfulPayments || 0}</p>
  </Card>
</div>
```

---

### 2. Calendar Integration ⏱️ 3-4 days

**Goal:** Sync events to Google Calendar and Outlook

#### A. Add Calendar Schema

**File:** `drizzle/schema.ts`

```typescript
export const calendarConnections = mysqlTable("calendar_connections", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  provider: mysqlEnum("provider", ["google", "outlook"]).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Implement OAuth Flow

**Backend:** `server/routers/calendar.ts`

```typescript
import { google } from "googleapis";
import { Client } from "@microsoft/microsoft-graph-client";

export const calendarRouter = router({
  // Get OAuth URL
  getAuthUrl: protectedProcedure
    .input(z.object({ provider: z.enum(["google", "outlook"]) }))
    .query(({ input }) => {
      if (input.provider === "google") {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          `${process.env.APP_URL}/api/calendar/callback/google`
        );
        return oauth2Client.generateAuthUrl({
          access_type: "offline",
          scope: ["https://www.googleapis.com/auth/calendar"],
        });
      }
      // Outlook implementation...
    }),

  // Sync event to calendar
  syncEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Get event and calendar connection
      // Create calendar event via API
      // Store calendar event ID for future updates
    }),
});
```

#### C. Add Calendar Settings UI

**File:** `client/src/pages/Settings.tsx`

Add section:
```tsx
<div className="space-y-4">
  <h3>Calendar Integration</h3>
  <button onClick={() => connectCalendar("google")}>
    Connect Google Calendar
  </button>
  <button onClick={() => connectCalendar("outlook")}>
    Connect Outlook Calendar
  </button>
  {connectedCalendars.map(cal => (
    <div key={cal.id}>
      {cal.provider} - Connected
      <button onClick={() => disconnect(cal.id)}>Disconnect</button>
    </div>
  ))}
</div>
```

---

### 3. Multi-Admin Accounts ⏱️ 2-3 days

#### A. Update User Schema

**File:** `drizzle/schema.ts`

```typescript
export const organizationMembers = mysqlTable("organization_members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  organizationId: varchar("organizationId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).default("member"),
  permissions: text("permissions"), // JSON array of permissions
  invitedBy: varchar("invitedBy", { length: 64 }),
  joinedAt: timestamp("joinedAt").defaultNow(),
});

export const organizations = mysqlTable("organizations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", [
    "basic",
    "premium",
    "pro",
    "business",
    "enterprise",
  ]).default("basic"),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Implement Invitation System

**Backend:** `server/routers/organizations.ts`

```typescript
export const organizationsRouter = router({
  inviteAdmin: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["admin", "member"]),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check subscription limit
      const tier = ctx.user.subscriptionTier;
      const limits = {
        premium: 2,
        pro: 5,
        business: 10,
        enterprise: 999,
      };

      // Send invitation email
      // Create pending invitation record
    }),

  acceptInvitation: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Add user to organization
      // Grant permissions based on role
    }),
});
```

#### C. Add Team Management UI

**File:** `client/src/pages/Team.tsx`

```tsx
export default function Team() {
  const { data: members } = trpc.organizations.listMembers.useQuery();
  const inviteAdmin = trpc.organizations.inviteAdmin.useMutation();

  return (
    <DashboardLayout>
      <h1>Team Management</h1>

      <button onClick={() => setShowInviteModal(true)}>
        Invite Team Member
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members?.map(member => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => removeMember(member.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
```

---

## Phase 3: Pro Features

### 4. Private Group Messaging ⏱️ 5-7 days

**Tech Stack:** WebSockets (Socket.io) or Pusher

#### A. Add Messaging Schema

```typescript
export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }),
  name: varchar("name", { length: 255 }),
  type: mysqlEnum("type", ["direct", "group", "event"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const conversationMembers = mysqlTable("conversation_members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  conversationId: varchar("conversationId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  joinedAt: timestamp("joinedAt").defaultNow(),
  lastReadAt: timestamp("lastReadAt"),
});

export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  conversationId: varchar("conversationId", { length: 64 }).notNull(),
  senderId: varchar("senderId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Implement Real-time Backend

**Install:** `pnpm add socket.io`

**File:** `server/_core/socket.ts`

```typescript
import { Server } from "socket.io";

export function setupSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("send-message", async (data) => {
      // Save message to database
      // Broadcast to conversation room
      io.to(`conversation:${data.conversationId}`).emit("new-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}
```

#### C. Create Messaging UI

**File:** `client/src/pages/Messages.tsx`

```tsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Messages() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL);
    setSocket(socketInstance);

    socketInstance.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socketInstance.disconnect();
  }, []);

  const sendMessage = () => {
    socket?.emit("send-message", {
      conversationId: currentConversation,
      content: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Conversations sidebar */}
      <div className="w-64 border-r">
        {conversations.map(conv => (
          <div key={conv.id} onClick={() => setCurrentConversation(conv.id)}>
            {conv.name}
          </div>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(msg => (
            <div key={msg.id} className="mb-4">
              <strong>{msg.senderName}:</strong> {msg.content}
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
```

---

### 5. Multi-Event Itinerary & Ticketing ⏱️ 3-4 days

#### A. Add Event Packages Schema

```typescript
export const eventPackages = mysqlTable("event_packages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(),
  eventIds: text("eventIds"), // JSON array of event IDs
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Create Package Management UI

Similar to event management but allows selecting multiple events and bundling them together.

---

### 6. Advanced Task Management ⏱️ 4-5 days

#### A. Add Tasks Schema

```typescript
export const tasks = mysqlTable("tasks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assignedTo: varchar("assignedTo", { length: 64 }),
  status: mysqlEnum("status", ["todo", "in_progress", "completed"]).default("todo"),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
  dueDate: timestamp("dueDate"),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Create Kanban Board UI

Use `@dnd-kit/core` for drag-and-drop functionality.

---

### 7. Custom Subdomain Branding ⏱️ 3-4 days

#### A. DNS Configuration

- Set up wildcard DNS: `*.easyplanningpro.com → your-server-ip`
- Configure SSL certificates (Let's Encrypt wildcard cert)

#### B. Subdomain Router

**File:** `server/_core/subdomain.ts`

```typescript
export function getOrganizationFromSubdomain(req: Request) {
  const host = req.headers.host;
  const subdomain = host?.split(".")[0];

  if (subdomain && subdomain !== "www" && subdomain !== "app") {
    // Look up organization by subdomain
    return subdomain;
  }

  return null;
}
```

#### C. Custom Branding Settings

Allow users to:
- Choose subdomain (e.g., `myorg.easyplanningpro.com`)
- Upload custom logo
- Set brand colors
- Customize email templates

---

### 8. Detailed Financial Reporting ⏱️ 3-4 days

#### A. Create Reports Router

```typescript
export const reportsRouter = router({
  getRevenueSummary: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ input, ctx }) => {
      // Aggregate payment data
      // Calculate revenue, expenses, profit
      // Group by event, time period, ticket type
    }),

  exportFinancialReport: protectedProcedure
    .input(z.object({
      format: z.enum(["pdf", "csv", "xlsx"]),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .mutation(async ({ input }) => {
      // Generate report file
      // Return download URL
    }),
});
```

#### B. Create Reports Dashboard

**File:** `client/src/pages/Reports.tsx`

- Revenue charts (line, bar, pie)
- Expense tracking
- Profit margins
- Event performance comparison
- Export buttons

Use `recharts` or `chart.js` for visualizations.

---

## Phase 4: Business Features

### 9. Custom Registration Forms ⏱️ 5-6 days

#### A. Form Builder Schema

```typescript
export const customForms = mysqlTable("custom_forms", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }),
  name: varchar("name", { length: 255 }).notNull(),
  fields: text("fields"), // JSON array of field definitions
  createdAt: timestamp("createdAt").defaultNow(),
});

export const formSubmissions = mysqlTable("form_submissions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  formId: varchar("formId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }),
  data: text("data"), // JSON object with answers
  submittedAt: timestamp("submittedAt").defaultNow(),
});
```

#### B. Drag-and-Drop Form Builder

Use `react-beautiful-dnd` or `@dnd-kit/core`

Field types:
- Text input
- Email
- Phone
- Dropdown
- Checkbox
- Radio
- File upload
- Date picker

#### C. Form Rendering Engine

Dynamic form component that renders based on field definitions.

---

### 10. Attendee Data Export (CSV) ⏱️ 1-2 days

#### A. Export Router

```typescript
export const exportRouter = router({
  exportAttendees: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const attendees = await getEventAttendees(input.eventId);

      const csv = [
        ["Name", "Email", "Phone", "RSVP Status", "Payment Status"],
        ...attendees.map(a => [a.name, a.email, a.phone, a.rsvpStatus, a.paymentStatus]),
      ].map(row => row.join(",")).join("\n");

      // Upload to S3
      const { url } = await storagePut(`exports/${Date.now()}.csv`, csv, "text/csv");
      return { downloadUrl: url };
    }),
});
```

---

### 11. Sponsor Management ⏱️ 3-4 days

#### A. Sponsors Schema

```typescript
export const sponsors = mysqlTable("sponsors", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }),
  name: varchar("name", { length: 255 }).notNull(),
  tier: mysqlEnum("tier", ["platinum", "gold", "silver", "bronze"]),
  logoUrl: varchar("logoUrl", { length: 512 }),
  websiteUrl: varchar("websiteUrl", { length: 512 }),
  description: text("description"),
  amount: int("amount"),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Sponsor Showcase Page

Public-facing page showing all sponsors with logos and links.

---

### 12. Donation & Fundraising Tools ⏱️ 4-5 days

#### A. Campaigns Schema

```typescript
export const fundraisingCampaigns = mysqlTable("fundraising_campaigns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }),
  name: varchar("name", { length: 255 }).notNull(),
  goal: int("goal").notNull(),
  raised: int("raised").default(0),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const donations = mysqlTable("donations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  campaignId: varchar("campaignId", { length: 64 }).notNull(),
  donorName: varchar("donorName", { length: 255 }),
  donorEmail: varchar("donorEmail", { length: 320 }),
  amount: int("amount").notNull(),
  anonymous: boolean("anonymous").default(false),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

#### B. Donation Page

- Progress bar showing goal vs. raised
- Donation amount selector
- Stripe payment integration
- Donor wall (public list of donors)
- Share buttons for social media

---

### 13. Advanced Event Analytics ⏱️ 4-5 days

#### A. Analytics Schema

```typescript
export const eventAnalytics = mysqlTable("event_analytics", {
  id: varchar("id", { length: 64 }).primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  metric: varchar("metric", { length: 64 }).notNull(),
  value: int("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});
```

Track metrics:
- Page views
- Registration conversions
- Ticket sales over time
- Email open rates
- Social media engagement
- Attendee demographics

#### B. Analytics Dashboard

**File:** `client/src/pages/Analytics.tsx`

- Real-time visitor tracking
- Conversion funnels
- Revenue forecasting
- Attendee insights
- Comparative analysis (event vs. event)

Use `recharts` for visualizations.

---

## Testing Strategy

### Unit Tests
- Use Vitest for unit testing
- Test all tRPC procedures
- Test utility functions

### Integration Tests
- Test complete user flows
- Test payment processing
- Test subscription upgrades

### E2E Tests
- Use Playwright or Cypress
- Test critical user journeys
- Test across browsers

---

## Deployment Checklist

### Pre-Deployment
- [ ] All features tested
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Stripe products created
- [ ] Webhook endpoints configured
- [ ] SSL certificates installed
- [ ] DNS records configured

### Post-Deployment
- [ ] Monitor error logs
- [ ] Test payment flow in production
- [ ] Verify webhook delivery
- [ ] Check email delivery
- [ ] Test subscription upgrades
- [ ] Monitor performance metrics

---

## Estimated Timeline

**Phase 2 Remaining:** 7-10 days
- Payment collection UI: 2-3 days
- Calendar integration: 3-4 days
- Multi-admin accounts: 2-3 days

**Phase 3 (Pro Features):** 15-20 days
- Private messaging: 5-7 days
- Multi-event itinerary: 3-4 days
- Task management: 4-5 days
- Custom subdomain: 3-4 days
- Financial reporting: 3-4 days

**Phase 4 (Business Features):** 17-22 days
- Custom forms: 5-6 days
- CSV export: 1-2 days
- Sponsor management: 3-4 days
- Fundraising tools: 4-5 days
- Advanced analytics: 4-5 days

**Total Estimated Time:** 39-52 days (8-11 weeks)

---

## Priority Recommendations

### High Priority (Do First)
1. Payment collection UI (complete Premium tier)
2. Multi-admin accounts (unlock Pro tier)
3. Task management (high user value)
4. Financial reporting (critical for business users)

### Medium Priority
1. Calendar integration
2. Custom forms
3. Sponsor management
4. Fundraising tools

### Lower Priority (Can Wait)
1. Private messaging (complex, high maintenance)
2. Custom subdomain (infrastructure heavy)
3. Advanced analytics (nice-to-have)

---

## Support & Resources

- **Stripe Documentation:** https://stripe.com/docs
- **tRPC Documentation:** https://trpc.io
- **Drizzle ORM:** https://orm.drizzle.team
- **shadcn/ui:** https://ui.shadcn.com
- **Socket.io:** https://socket.io/docs

---

**Questions or Issues?**

Create an issue in the GitHub repository or contact the development team.

---

*Last Updated: [Date]*
*Version: 1.0*

