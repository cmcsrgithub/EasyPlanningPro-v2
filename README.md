# EasyPlanningPro v2

**Complete Event Planning Platform** with 90 pages, 4 pricing tiers, and full feature parity with the original EasyPlanningPro.

## 🎯 Features

### All Pricing Tiers (100% Complete)

#### Basic (Free)
- ✅ Event creation and management
- ✅ Venue management
- ✅ Member directory
- ✅ Photo gallery
- ✅ Polls and voting
- ✅ Task management (Kanban board)
- ✅ Team collaboration
- ✅ Basic RSVP tracking
- ✅ Event checkout and payments

#### Premium ($19.99/mo)
- ✅ All Basic features
- ✅ Unlimited events
- ✅ Advanced RSVP management
- ✅ Email notifications
- ✅ Custom event branding
- ✅ Priority support
- ✅ Event templates
- ✅ Waitlist management

#### Pro ($49.99/mo)
- ✅ All Premium features
- ✅ **Financial Reporting** - Dashboard with charts, expense tracking, budgets, CSV export
- ✅ **Private Group Messaging** - Real-time chat, channels, direct messages
- ✅ **Multi-Event Itinerary & Ticketing** - Event packages, QR codes, bundled checkout
- ✅ **Custom Subdomain Branding** - White-label mode, custom CSS, domain support
- ✅ Advanced analytics
- ✅ API access
- ✅ Dedicated account manager

#### Business ($129.99/mo)
- ✅ All Pro features
- ✅ **Customizable Registration Forms** - Form builder with 8 field types, response viewer
- ✅ **Attendee Data Export** - CSV export functionality
- ✅ **Sponsor Management Portal** - Tier system, logos, contact management
- ✅ **Fundraising & Donation Tracking** - Goal tracking, stats, anonymous donations
- ✅ **Advanced Analytics Dashboard** - 4 chart types with Recharts
- ✅ Up to 10 administrator accounts
- ✅ White-label options
- ✅ Custom integrations

### Additional Features (Complete Feature Parity)

#### Authentication System
- Login, Signup, Password Reset, Profile management
- OAuth integration with Manus auth system

#### Activity Management
- Activities listing with filters
- Activity detail with registration/capacity tracking
- Activity form for create/edit
- My Registrations dashboard

#### Templates & Waitlist
- Template library (public/personal templates)
- Waitlist management with position tracking

#### Calendar & Travel
- Interactive calendar view
- Travel planner (flights, trains, accommodations)

#### Forum & Support
- Discussion forum with topics and replies
- Support ticketing system with priority levels

#### Admin & Marketing
- Admin dashboard with stats overview
- Email marketing campaign builder

#### Legal & Documentation
- Privacy Policy, Terms of Service
- About Us, Contact, FAQ
- Help Center, User Guide, Video Tutorials
- API Documentation

#### Marketing Pages
- Features showcase, Testimonials, Case Studies
- Blog, Resources, Downloads
- Integrations marketplace
- Pricing, Compare Plans, Enterprise
- Partners, Affiliates, Careers

## 📊 Technical Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, tRPC
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** OAuth (Manus built-in)
- **Payments:** Stripe integration
- **Charts:** Recharts
- **File Storage:** S3-compatible storage
- **Build Tool:** Vite

## 📈 Statistics

- **Total Pages:** 90
- **Database Tables:** 38
- **API Routers:** 21 with 150+ endpoints
- **TypeScript Errors:** 0
- **Build Status:** Production-ready

## 🚀 Deployment

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret
OAUTH_SERVER_URL=your-oauth-server-url
VITE_OAUTH_PORTAL_URL=your-oauth-portal-url

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App Configuration
VITE_APP_ID=your-app-id
VITE_APP_TITLE=EasyPlanningPro
VITE_APP_LOGO=/logo.png

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Owner Information
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id
```

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Deploy to Vercel

1. Push this repository to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For support, email support@easyplanningpro.com or visit our Help Center.

---

**Built with ❤️ using modern web technologies**
