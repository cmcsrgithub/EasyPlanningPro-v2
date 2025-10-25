import { lazy } from 'react';

// Lazy load all page components for code splitting
export const routes = [
  // Public routes
  { path: '/', component: lazy(() => import('./pages/Home')) },
  { path: '/login', component: lazy(() => import('./pages/Login')) },
  { path: '/signup', component: lazy(() => import('./pages/Signup')) },
  { path: '/forgot-password', component: lazy(() => import('./pages/ForgotPassword')) },
  { path: '/reset-password', component: lazy(() => import('./pages/ResetPassword')) },
  
  // Dashboard routes
  { path: '/dashboard', component: lazy(() => import('./pages/Dashboard')) },
  { path: '/profile', component: lazy(() => import('./pages/Profile')) },
  { path: '/settings', component: lazy(() => import('./pages/Settings')) },
  
  // Events
  { path: '/events', component: lazy(() => import('./pages/Events')) },
  { path: '/events/new', component: lazy(() => import('./pages/EventForm')) },
  { path: '/events/:id', component: lazy(() => import('./pages/EventDetail')) },
  { path: '/events/:id/edit', component: lazy(() => import('./pages/EventForm')) },
  { path: '/events/:id/checkout', component: lazy(() => import('./pages/EventCheckout')) },
  
  // Venues
  { path: '/venues', component: lazy(() => import('./pages/Venues')) },
  { path: '/venues/new', component: lazy(() => import('./pages/VenueForm')) },
  { path: '/venues/:id', component: lazy(() => import('./pages/VenueDetail')) },
  { path: '/venues/:id/edit', component: lazy(() => import('./pages/VenueForm')) },
  
  // Directory/Members
  { path: '/directory', component: lazy(() => import('./pages/Directory')) },
  { path: '/directory/new', component: lazy(() => import('./pages/MemberForm')) },
  { path: '/directory/:id', component: lazy(() => import('./pages/MemberDetail')) },
  { path: '/directory/:id/edit', component: lazy(() => import('./pages/MemberForm')) },
  
  // Activities
  { path: '/activities', component: lazy(() => import('./pages/Activities')) },
  { path: '/activities/new', component: lazy(() => import('./pages/ActivityForm')) },
  { path: '/activities/:id', component: lazy(() => import('./pages/ActivityDetail')) },
  { path: '/activities/:id/edit', component: lazy(() => import('./pages/ActivityForm')) },
  
  // Gallery
  { path: '/gallery', component: lazy(() => import('./pages/Gallery')) },
  
  // Polls
  { path: '/polls', component: lazy(() => import('./pages/Polls')) },
  { path: '/polls/new', component: lazy(() => import('./pages/PollForm')) },
  { path: '/polls/:id', component: lazy(() => import('./pages/PollDetail')) },
  { path: '/polls/:id/edit', component: lazy(() => import('./pages/PollForm')) },
  
  // Tasks/Checklist
  { path: '/tasks', component: lazy(() => import('./pages/Tasks')) },
  
  // Financial
  { path: '/financial', component: lazy(() => import('./pages/Financial')) },
  { path: '/payment/success', component: lazy(() => import('./pages/PaymentSuccess')) },
  
  // Messaging
  { path: '/messaging', component: lazy(() => import('./pages/Messaging')) },
  
  // Packages
  { path: '/packages', component: lazy(() => import('./pages/EventPackages')) },
  { path: '/packages/:id', component: lazy(() => import('./pages/PackageDetail')) },
  
  // Team
  { path: '/team', component: lazy(() => import('./pages/Team')) },
  
  // Branding
  { path: '/branding', component: lazy(() => import('./pages/Branding')) },
  
  // Sponsors
  { path: '/sponsors', component: lazy(() => import('./pages/Sponsors')) },
  
  // Fundraising
  { path: '/fundraising', component: lazy(() => import('./pages/Fundraising')) },
  
  // Custom Forms
  { path: '/custom-forms', component: lazy(() => import('./pages/CustomForms')) },
  
  // Analytics
  { path: '/analytics', component: lazy(() => import('./pages/Analytics')) },
  
  // Registrations
  { path: '/my-registrations', component: lazy(() => import('./pages/MyRegistrations')) },
  
  // Templates
  { path: '/templates', component: lazy(() => import('./pages/Templates')) },
  { path: '/templates/gallery', component: lazy(() => import('./pages/TemplateGallery')) },
  { path: '/templates/gallery/:id', component: lazy(() => import('./pages/TemplateViewer')) },
  { path: '/templates/gallery/:id/customize', component: lazy(() => import('./pages/TemplateCustomize')) },
  { path: '/templates/shared/:id', component: lazy(() => import('./pages/SharedTemplate')) },
  
  // Waitlist
  { path: '/waitlist', component: lazy(() => import('./pages/WaitlistManagement')) },
  
  // Help & Support
  { path: '/help-center', component: lazy(() => import('./pages/HelpCenter')) },
  { path: '/help/:slug', component: lazy(() => import('./pages/HelpArticle')) },
  { path: '/support', component: lazy(() => import('./pages/Support')) },
  { path: '/forum', component: lazy(() => import('./pages/Forum')) },
  { path: '/affiliates', component: lazy(() => import('./pages/Affiliates')) },
  
  // Admin routes
  { path: '/admin', component: lazy(() => import('./pages/Admin')) },
  { path: '/admin/users', component: lazy(() => import('./pages/AdminUsers')) },
  { path: '/admin/events', component: lazy(() => import('./pages/AdminEvents')) },
  { path: '/admin/venues', component: lazy(() => import('./pages/AdminVenues')) },
  { path: '/admin/activities', component: lazy(() => import('./pages/AdminActivities')) },
  { path: '/admin/subscriptions', component: lazy(() => import('./pages/AdminSubscriptions')) },
  { path: '/admin/invitations', component: lazy(() => import('./pages/AdminInvitations')) },
  { path: '/admin/management', component: lazy(() => import('./pages/AdminManagement')) },
  { path: '/admin/user-management', component: lazy(() => import('./pages/UserManagement')) },
  { path: '/admin/financial-management', component: lazy(() => import('./pages/FinancialManagement')) },
  { path: '/admin/analytics-reporting', component: lazy(() => import('./pages/AnalyticsReporting')) },
  { path: '/admin/support-tickets', component: lazy(() => import('./pages/SupportTickets')) },
  { path: '/admin/content-management', component: lazy(() => import('./pages/ContentManagement')) },
  { path: '/admin/system-configuration', component: lazy(() => import('./pages/SystemConfiguration')) },
  { path: '/admin/monitoring', component: lazy(() => import('./pages/SystemMonitoring')) },
  { path: '/admin/moderation', component: lazy(() => import('./pages/ContentModeration')) },
  { path: '/admin/configuration', component: lazy(() => import('./pages/SystemConfiguration')) },
];

