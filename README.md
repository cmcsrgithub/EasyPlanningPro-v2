# EasyPlanningPro v2

Modern event planning and management platform rebuilt from scratch with Apple-inspired design.

## 🎯 Project Status

**Current Progress:** 50% Complete (MVP + Premium Features)

**Production Ready:** ✅ Core features functional and tested

**Repository:** https://github.com/Simply-U-Promotions/EasyPlanningPro-v2

---

## ✨ Features Implemented

### Phase 1: Subscription System (100% Complete)

- **Stripe Integration**
  - Checkout flow for Premium, Pro, and Business plans
  - Billing portal for subscription management
  - Webhook handler for subscription events
  - Automatic subscription status updates

- **Event Limits**
  - Basic (Free): 1 concurrent event
  - Premium ($19.99/mo): 2 concurrent events
  - Pro ($59.99/mo): 5 concurrent events
  - Business ($129.99/mo): 10 concurrent events
  - Enterprise: Unlimited (contact sales)

- **Settings Page**
  - View current subscription plan
  - Usage tracking and limits
  - Upgrade/downgrade flows
  - Manage billing

### Phase 2: Polls & Surveys (100% Complete)

- **Poll Management**
  - Create polls with multiple options
  - Single or multiple choice polls
  - Poll expiration dates
  - Toggle active/inactive status
  - Delete polls

- **Voting System**
  - Anonymous voting support
  - Logged-in user voting
  - Prevent duplicate votes
  - Real-time results with percentages
  - Vote count tracking

- **UI Pages**
  - Polls list page
  - Poll creation form
  - Voting and results page
  - Integrated into sidebar navigation

### Core Application Features (100% Complete)

- **Authentication**
  - Manus OAuth integration
  - Protected routes
  - User session management

- **Events Management**
  - Full CRUD operations
  - Event details with RSVP tracking
  - Event list (upcoming/past views)
  - Subscription limit enforcement

- **Venues Management**
  - Full CRUD operations
  - Venue capacity and amenities
  - Associate venues with events

- **Member Directory**
  - Full CRUD operations
  - Member profiles with contact info
  - Member list and search

- **Photo Gallery**
  - Album creation and management
  - S3 storage integration ready
  - Event-associated albums

- **Dashboard**
  - Statistics overview
  - Quick actions
  - Upcoming events
  - Subscription status

- **Landing Page**
  - Marketing hero section
  - Feature sections (Free, Premium, Pro, Business)
  - Complete pricing table (5 plans)
  - Testimonials section
  - Professional footer

---

## 🎨 Design System

### Apple-Inspired Aesthetic

- **Colors**
  - Primary: Brand Cyan (#00AEEF)
  - Secondary: Brand Orange
  - Accent: Brand Green, Purple
  - Neutrals: Clean grays

- **Typography**
  - Font: Inter
  - Clear hierarchy (Display → H1-H5 → Body → Caption)
  - Weights: Bold (700), Semibold (600), Regular (400)

- **Spacing**
  - Base: 4px (8pt grid system)
  - Scale: 4, 8, 12, 16, 24, 32, 48, 64px

- **Components**
  - Rounded corners (8px, 12px, 16px)
  - Soft shadows
  - Smooth transitions (150ms, 250ms, 400ms)
  - Hover states

---

## 🚀 Tech Stack

### Backend
- **Framework:** Express.js
- **API:** tRPC (type-safe end-to-end)
- **Database:** MySQL/TiDB with Drizzle ORM
- **Authentication:** Manus OAuth
- **Payments:** Stripe
- **Storage:** S3

### Frontend
- **Framework:** React 19
- **Routing:** Wouter
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **State Management:** tRPC React Query
- **Forms:** React Hook Form + Zod

### Database Tables (11)
1. `users` - User accounts with subscription data
2. `events` - Event management
3. `venues` - Venue information
4. `members` - Member directory
5. `rsvps` - Event responses
6. `albums` - Photo albums
7. `photos` - Photo metadata
8. `polls` - Surveys and polls
9. `poll_options` - Poll choices
10. `poll_votes` - Vote tracking
11. `event_payments` - Payment tracking (in progress)

---

## 📦 Installation

### Prerequisites
- Node.js 22+
- pnpm
- MySQL/TiDB database

### Setup

```bash
# Clone repository
git clone https://github.com/Simply-U-Promotions/EasyPlanningPro-v2.git
cd EasyPlanningPro-v2

# Install dependencies
pnpm install

# Configure environment variables (see .env.example)
cp .env.example .env

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Manus OAuth (auto-configured in Manus platform)
JWT_SECRET=
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=
VITE_APP_ID=
OWNER_OPEN_ID=
OWNER_NAME=

# App Configuration
VITE_APP_TITLE=EasyPlanningPro
VITE_APP_LOGO=/logo.svg

# Stripe
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

---

## 🔧 Development

### Build Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Database migrations
pnpm db:push

# Type checking
pnpm check
```

### Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and tRPC client
│   │   └── App.tsx        # Routes and layout
├── server/                # Backend Express + tRPC
│   ├── _core/             # Core framework (auth, context, etc.)
│   ├── routers/           # tRPC API routers
│   ├── db.ts              # Database query helpers
│   └── stripe.ts          # Stripe integration
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Table definitions
├── shared/                # Shared constants and types
└── storage/               # S3 storage helpers
```

---

## 📋 Remaining Features

### Phase 2: Premium Features (Remaining)

- [ ] **Payment Collection** - Stripe integration for event tickets
- [ ] **Calendar Integration** - Google Calendar, Outlook sync
- [ ] **Multi-Admin Accounts** - Role-based access control

### Phase 3: Pro Features (0% Complete)

- [ ] **Private Group Messaging** - Real-time chat
- [ ] **Multi-Event Itinerary & Ticketing** - Event packages
- [ ] **Advanced Task Management** - Task assignment and tracking
- [ ] **Custom Subdomain Branding** - White-label options
- [ ] **Detailed Financial Reporting** - Revenue and expense tracking

### Phase 4: Business Features (0% Complete)

- [ ] **Custom Registration Forms** - Form builder
- [ ] **Attendee Data Export (CSV)** - Data export tools
- [ ] **Sponsor Management** - Sponsor showcase
- [ ] **Donation & Fundraising Tools** - Fundraising campaigns
- [ ] **Advanced Event Analytics** - Analytics dashboard

**Estimated Time:** 8-11 weeks for complete implementation

---

## 🚢 Deployment

### Stripe Setup

1. Create products in Stripe Dashboard:
   - Premium: $19.99/month
   - Pro: $59.99/month
   - Business: $129.99/month

2. Get price IDs for each product

3. Add price IDs to environment variables

4. Configure webhook endpoint: `/api/webhooks/stripe`

5. Add webhook secret to environment

### Database Setup

1. Create MySQL/TiDB database

2. Update `DATABASE_URL` in environment

3. Run migrations: `pnpm db:push`

### Production Deployment

The application is ready to deploy to any Node.js hosting platform:

- Vercel
- Railway
- Render
- AWS
- DigitalOcean

---

## 📚 Documentation

### API Documentation

All API endpoints are type-safe through tRPC. See `server/routers/` for available procedures.

### Component Documentation

UI components use shadcn/ui. See https://ui.shadcn.com for component API.

---

## 🤝 Contributing

This is a private repository for Simply-U Promotions. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - All rights reserved by Simply-U Promotions

---

## 📞 Support

For technical support or questions:
- Repository: https://github.com/Simply-U-Promotions/EasyPlanningPro-v2
- Issues: Create an issue in the repository

---

## 🎯 Roadmap

### Q1 2025
- ✅ Core MVP (Basic tier)
- ✅ Subscription system
- ✅ Polls & Surveys
- 🔄 Payment collection
- 🔄 Calendar integration

### Q2 2025
- Private messaging
- Task management
- Custom subdomain
- Financial reporting

### Q3 2025
- Custom forms
- Sponsor management
- Fundraising tools
- Advanced analytics

### Q4 2025
- Enterprise features
- API for integrations
- Mobile app (future)

---

**Built with ❤️ by Simply-U Promotions**

