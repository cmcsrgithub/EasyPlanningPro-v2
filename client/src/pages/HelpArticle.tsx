import { useRoute, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Eye } from "lucide-react";

interface HelpArticleContent {
  title: string;
  category: string;
  readTime: string;
  views: number;
  lastUpdated: string;
  content: {
    section: string;
    text: string;
  }[];
}

const helpArticles: Record<string, HelpArticleContent> = {
  "creating-first-event": {
    title: "Creating Your First Event",
    category: "Getting Started",
    readTime: "5 min read",
    views: 1250,
    lastUpdated: "October 20, 2025",
    content: [
      {
        section: "Introduction",
        text: "Welcome to EasyPlanningPro! This guide will walk you through creating your first event in just a few simple steps.",
      },
      {
        section: "Step 1: Navigate to Events",
        text: "From your dashboard, click on 'Events' in the sidebar navigation. Then click the 'Create Event' button in the top right corner.",
      },
      {
        section: "Step 2: Choose a Template",
        text: "Select from our 53+ pre-built templates or start from scratch. Templates include Wedding, Birthday, Conference, and many more occasion-specific designs.",
      },
      {
        section: "Step 3: Fill in Event Details",
        text: "Enter your event name, date, time, location, and description. You can also add a cover image and set the event visibility (public or private).",
      },
      {
        section: "Step 4: Configure Settings",
        text: "Set up RSVP options, ticket pricing, capacity limits, and registration deadlines. Enable features like waitlist management and guest list tracking.",
      },
      {
        section: "Step 5: Publish Your Event",
        text: "Review all details and click 'Publish' to make your event live. You can share the event link with guests or send invitations directly through the platform.",
      },
    ],
  },
  "setting-up-profile": {
    title: "Setting Up Your Profile",
    category: "Getting Started",
    readTime: "3 min read",
    views: 875,
    lastUpdated: "October 18, 2025",
    content: [
      {
        section: "Profile Basics",
        text: "Your profile is the foundation of your EasyPlanningPro account. It contains your personal information, preferences, and account settings.",
      },
      {
        section: "Personal Information",
        text: "Navigate to Settings > Profile to update your name, email, phone number, and profile picture. This information will be visible to event attendees and team members.",
      },
      {
        section: "Notification Preferences",
        text: "Configure how you want to receive notifications - email, in-app, or both. You can customize notifications for RSVPs, comments, and event updates.",
      },
      {
        section: "Security Settings",
        text: "Enable two-factor authentication (2FA) for added security. You can also manage your password and connected social accounts from the Security tab.",
      },
    ],
  },
  "inviting-team-members": {
    title: "Inviting Team Members",
    category: "Getting Started",
    readTime: "4 min read",
    views: 875,
    lastUpdated: "October 19, 2025",
    content: [
      {
        section: "Team Collaboration",
        text: "EasyPlanningPro allows you to invite team members to collaborate on events. Different subscription tiers support different numbers of administrators.",
      },
      {
        section: "Sending Invitations",
        text: "Go to Team Management in the sidebar. Click 'Invite Member' and enter their email address. You can assign roles like Admin, Editor, or Viewer.",
      },
      {
        section: "Role Permissions",
        text: "Admins have full access to all features. Editors can create and modify events but cannot manage billing. Viewers can only see event details and reports.",
      },
      {
        section: "Managing Team Members",
        text: "You can view all team members, edit their roles, or remove them from your organization at any time from the Team Management page.",
      },
    ],
  },
  "pricing-tiers": {
    title: "Understanding Pricing Tiers",
    category: "Getting Started",
    readTime: "6 min read",
    views: 720,
    lastUpdated: "October 21, 2025",
    content: [
      {
        section: "Basic Plan (Free)",
        text: "Perfect for individuals planning small events. Includes 1 event, basic RSVP management, photo galleries, and polls. Supports up to 2 administrators.",
      },
      {
        section: "Premium Plan ($19.99/month)",
        text: "Ideal for regular event planners. Includes unlimited events, custom themes, email notifications, priority support, and advanced RSVP options. Supports up to 3 administrators.",
      },
      {
        section: "Pro Plan ($59.99/month)",
        text: "For professional event organizers. Includes everything in Premium plus task management, financial reporting, private messaging, multi-event packages, and custom branding. Supports up to 5 administrators.",
      },
      {
        section: "Business Plan ($129.99/month)",
        text: "For organizations and enterprises. Includes everything in Pro plus custom forms, CSV export, sponsor management, fundraising tools, and advanced analytics. Supports up to 10 administrators.",
      },
      {
        section: "Upgrading Your Plan",
        text: "You can upgrade or downgrade your plan at any time from Settings > Subscription. Changes take effect immediately, and billing is prorated.",
      },
    ],
  },
  "creating-editing-events": {
    title: "Creating and Editing Events",
    category: "Event Management",
    readTime: "7 min read",
    views: 1250,
    lastUpdated: "October 22, 2025",
    content: [
      {
        section: "Event Creation Process",
        text: "Creating an event in EasyPlanningPro is straightforward. You can start from scratch or use one of our 53+ pre-built templates designed for specific occasions.",
      },
      {
        section: "Basic Information",
        text: "Every event requires a title, date, time, and location. You can add multiple dates for recurring events or multi-day conferences.",
      },
      {
        section: "Event Description",
        text: "Write a compelling description that tells attendees what to expect. You can use rich text formatting, add images, and include links to external resources.",
      },
      {
        section: "Advanced Settings",
        text: "Configure RSVP options, set capacity limits, enable waitlists, create ticket tiers, and set registration deadlines. You can also add custom questions to the registration form.",
      },
      {
        section: "Editing Events",
        text: "To edit an event, navigate to Events, find your event, and click the edit icon. All changes are saved automatically. Attendees will be notified of major changes.",
      },
    ],
  },
  "managing-registrations": {
    title: "Managing Registrations",
    category: "Event Management",
    readTime: "5 min read",
    views: 980,
    lastUpdated: "October 20, 2025",
    content: [
      {
        section: "Registration Overview",
        text: "The registration system allows you to track who's attending your event, collect payment, and manage capacity limits.",
      },
      {
        section: "Viewing Registrations",
        text: "Access all registrations from the Event Detail page. You can see attendee names, email addresses, ticket types, payment status, and registration dates.",
      },
      {
        section: "Exporting Data",
        text: "Export registration data to CSV format for use in other tools. Available on Business plan and above.",
      },
      {
        section: "Managing Waitlists",
        text: "When your event reaches capacity, new registrations are automatically added to the waitlist. You can offer spots to waitlisted attendees when space becomes available.",
      },
    ],
  },
  "setting-up-ticketing": {
    title: "Setting Up Ticketing",
    category: "Event Management",
    readTime: "6 min read",
    views: 650,
    lastUpdated: "October 19, 2025",
    content: [
      {
        section: "Ticket Types",
        text: "Create multiple ticket types for your event - General Admission, VIP, Early Bird, Student, etc. Each ticket type can have its own price and availability.",
      },
      {
        section: "Pricing Strategy",
        text: "Set different prices for different ticket tiers. You can also offer free tickets, donation-based tickets, or 'pay what you want' options.",
      },
      {
        section: "Payment Processing",
        text: "EasyPlanningPro integrates with Stripe for secure payment processing. Connect your Stripe account from Settings > Payments to start collecting payments.",
      },
      {
        section: "QR Code Tickets",
        text: "Every ticket includes a unique QR code for easy check-in at your event. Use the mobile app to scan tickets at the door.",
      },
    ],
  },
  "using-event-templates": {
    title: "Using Event Templates",
    category: "Event Management",
    readTime: "4 min read",
    views: 720,
    lastUpdated: "October 21, 2025",
    content: [
      {
        section: "Template Library",
        text: "Browse our library of 53+ professionally designed templates for weddings, birthdays, conferences, fundraisers, and more.",
      },
      {
        section: "Choosing a Template",
        text: "When creating a new event, click 'Use Template' and select from categories like Social, Professional, Sports, Entertainment, and more.",
      },
      {
        section: "Customizing Templates",
        text: "All templates are fully customizable. Change colors, fonts, layouts, and content to match your brand and event theme.",
      },
      {
        section: "Creating Your Own Templates",
        text: "Save any event as a template for future use. This is perfect for recurring events or if you have a specific style you want to reuse.",
      },
    ],
  },
  "payment-processing": {
    title: "Setting Up Payment Processing",
    category: "Event Management",
    readTime: "8 min read",
    views: 980,
    lastUpdated: "October 23, 2025",
    content: [
      {
        section: "Stripe Integration",
        text: "EasyPlanningPro uses Stripe for secure, reliable payment processing. Stripe supports credit cards, debit cards, and digital wallets.",
      },
      {
        section: "Connecting Your Account",
        text: "Go to Settings > Payments and click 'Connect Stripe Account'. You'll be redirected to Stripe to complete the setup process.",
      },
      {
        section: "Payment Settings",
        text: "Configure payment options including currency, payment methods accepted, and whether to allow partial payments or payment plans.",
      },
      {
        section: "Fees and Payouts",
        text: "Stripe charges a standard processing fee of 2.9% + $0.30 per transaction. Payouts are typically processed within 2-7 business days.",
      },
      {
        section: "Refunds",
        text: "Process full or partial refunds directly from the platform. Refunds are returned to the original payment method within 5-10 business days.",
      },
    ],
  },
  "customizing-event-page": {
    title: "Customizing Your Event Page",
    category: "Event Management",
    readTime: "6 min read",
    views: 720,
    lastUpdated: "October 22, 2025",
    content: [
      {
        section: "Page Builder",
        text: "Use our drag-and-drop page builder to create beautiful event pages. Add sections for agenda, speakers, sponsors, FAQs, and more.",
      },
      {
        section: "Branding",
        text: "Upload your logo, choose brand colors, and select fonts that match your organization's identity. Pro and Business plans support custom CSS.",
      },
      {
        section: "Media Gallery",
        text: "Add photos and videos to showcase your event. You can create multiple galleries and organize media by category.",
      },
      {
        section: "Custom Domain",
        text: "Business plan users can connect a custom domain to their event pages for a fully branded experience.",
      },
    ],
  },
  "understanding-analytics": {
    title: "Understanding Analytics",
    category: "Event Management",
    readTime: "7 min read",
    views: 650,
    lastUpdated: "October 24, 2025",
    content: [
      {
        section: "Analytics Dashboard",
        text: "The analytics dashboard provides insights into your event performance, including registration trends, revenue, and attendee demographics.",
      },
      {
        section: "Key Metrics",
        text: "Track important metrics like total registrations, conversion rate, revenue by ticket type, and RSVP response rates.",
      },
      {
        section: "Charts and Graphs",
        text: "Visualize your data with interactive charts showing registration over time, revenue trends, and demographic breakdowns.",
      },
      {
        section: "Exporting Reports",
        text: "Export analytics data to CSV or PDF format for presentations and record-keeping. Available on Pro and Business plans.",
      },
    ],
  },
  "platform-overview": {
    title: "Platform Overview",
    category: "Video Tutorials",
    readTime: "5 min video",
    views: 450,
    lastUpdated: "October 15, 2025",
    content: [
      {
        section: "Video Tutorial",
        text: "This 5-minute video provides a comprehensive overview of the EasyPlanningPro platform, including navigation, key features, and getting started tips.",
      },
      {
        section: "What You'll Learn",
        text: "Dashboard navigation, creating your first event, managing registrations, accessing reports, and customizing your account settings.",
      },
      {
        section: "Watch the Video",
        text: "Video content coming soon. In the meantime, check out our written guides in the Getting Started section.",
      },
    ],
  },
  "first-event-tutorial": {
    title: "Creating Your First Event Tutorial",
    category: "Video Tutorials",
    readTime: "10 min video",
    views: 380,
    lastUpdated: "October 16, 2025",
    content: [
      {
        section: "Step-by-Step Video Guide",
        text: "Follow along as we create a complete event from start to finish, including all settings, customization options, and best practices.",
      },
      {
        section: "Topics Covered",
        text: "Event creation, template selection, RSVP setup, ticketing configuration, payment processing, and publishing your event.",
      },
      {
        section: "Watch the Video",
        text: "Video content coming soon. Refer to our 'Creating Your First Event' written guide for detailed instructions.",
      },
    ],
  },
  "advanced-features": {
    title: "Advanced Features Tour",
    category: "Video Tutorials",
    readTime: "15 min video",
    views: 320,
    lastUpdated: "October 17, 2025",
    content: [
      {
        section: "Pro and Business Features",
        text: "Explore advanced features available in Pro and Business plans, including task management, financial reporting, custom branding, and more.",
      },
      {
        section: "What's Included",
        text: "Kanban boards, expense tracking, fundraising tools, sponsor management, custom forms, analytics dashboards, and white-label options.",
      },
      {
        section: "Watch the Video",
        text: "Video content coming soon. Visit our feature-specific help articles for detailed information.",
      },
    ],
  },
  "tips-and-tricks": {
    title: "Tips and Tricks",
    category: "Video Tutorials",
    readTime: "8 min video",
    views: 290,
    lastUpdated: "October 18, 2025",
    content: [
      {
        section: "Pro Tips",
        text: "Learn time-saving shortcuts, hidden features, and best practices from experienced event planners using EasyPlanningPro.",
      },
      {
        section: "Topics",
        text: "Keyboard shortcuts, bulk actions, automation features, integration tips, and workflow optimization strategies.",
      },
      {
        section: "Watch the Video",
        text: "Video content coming soon. Check back regularly for new tips and tricks.",
      },
    ],
  },
  "contact-support": {
    title: "Contact Support",
    category: "Support",
    readTime: "2 min read",
    views: 550,
    lastUpdated: "October 24, 2025",
    content: [
      {
        section: "How to Reach Us",
        text: "Our support team is here to help! You can reach us through multiple channels depending on your subscription tier.",
      },
      {
        section: "Email Support",
        text: "Send us an email at support@easyplanningpro.com. We typically respond within 24 hours (12 hours for Premium+ plans).",
      },
      {
        section: "Support Tickets",
        text: "Submit a support ticket through the platform for tracked, prioritized assistance. Navigate to Support > Submit Ticket.",
      },
      {
        section: "Live Chat",
        text: "Business plan subscribers have access to live chat support during business hours (9 AM - 5 PM EST, Monday-Friday).",
      },
    ],
  },
  "submit-ticket": {
    title: "Submit a Support Ticket",
    category: "Support",
    readTime: "3 min read",
    views: 420,
    lastUpdated: "October 23, 2025",
    content: [
      {
        section: "Ticket System",
        text: "Our ticket system ensures your issues are tracked, prioritized, and resolved efficiently by our support team.",
      },
      {
        section: "Creating a Ticket",
        text: "Navigate to Support in the sidebar and click 'Submit Ticket'. Provide a clear title, detailed description, and relevant screenshots.",
      },
      {
        section: "Priority Levels",
        text: "Select the appropriate priority: Low (general questions), Medium (feature requests), High (issues affecting functionality), Urgent (critical bugs).",
      },
      {
        section: "Tracking Your Ticket",
        text: "View all your tickets and their status from the Support page. You'll receive email notifications when your ticket is updated.",
      },
    ],
  },
  "live-chat": {
    title: "Live Chat Support",
    category: "Support",
    readTime: "2 min read",
    views: 180,
    lastUpdated: "October 22, 2025",
    content: [
      {
        section: "Business Plan Feature",
        text: "Live chat support is available exclusively for Business plan subscribers as part of our premium support offering.",
      },
      {
        section: "Availability",
        text: "Our live chat team is available Monday through Friday, 9 AM to 5 PM Eastern Standard Time (EST).",
      },
      {
        section: "Accessing Live Chat",
        text: "Click the chat icon in the bottom right corner of any page when logged in. A support agent will typically respond within 2-3 minutes.",
      },
      {
        section: "Upgrade for Live Chat",
        text: "Not on the Business plan? Upgrade from Settings > Subscription to get instant access to live chat support.",
      },
    ],
  },
  "community-forum": {
    title: "Community Forum",
    category: "Support",
    readTime: "3 min read",
    views: 340,
    lastUpdated: "October 21, 2025",
    content: [
      {
        section: "Join the Community",
        text: "Our community forum is a place to connect with other event planners, share tips, ask questions, and get inspired.",
      },
      {
        section: "Forum Categories",
        text: "Browse topics including Getting Started, Event Ideas, Technical Help, Feature Requests, and Success Stories.",
      },
      {
        section: "Posting Guidelines",
        text: "Be respectful, stay on topic, search before posting, and provide details when asking for help. Our moderators keep the forum friendly and helpful.",
      },
      {
        section: "Access the Forum",
        text: "Click Forum in the sidebar or visit forum.easyplanningpro.com to join the conversation.",
      },
    ],
  },
};

export default function HelpArticle() {
  const [, params] = useRoute("/help/:slug");
  const slug = params?.slug || "";
  const article = helpArticles[slug];

  if (!article) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/help-center">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-semibold mb-4">Article Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The help article you're looking for doesn't exist or has been moved.
              </p>
              <Link href="/help-center">
                <Button>Return to Help Center</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/help-center">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8 space-y-6">
            {/* Article Header */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-cyan-600 font-medium">{article.category}</span>
                <span>•</span>
                <span>Last updated {article.lastUpdated}</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              {article.content.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {section.section}
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Helpful Section */}
            <div className="border-t pt-6 mt-8">
              <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
                <p className="font-semibold">Was this article helpful?</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline">👍 Yes</Button>
                  <Button variant="outline">👎 No</Button>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="border-t pt-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
              <div className="grid gap-3">
                <Link href="/help/creating-first-event">
                  <a className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="font-medium text-primary hover:underline">Creating Your First Event</p>
                    <p className="text-sm text-muted-foreground">Learn how to create events in minutes</p>
                  </a>
                </Link>
                <Link href="/help/managing-registrations">
                  <a className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="font-medium text-primary hover:underline">Managing Registrations</p>
                    <p className="text-sm text-muted-foreground">Track and manage event attendees</p>
                  </a>
                </Link>
                <Link href="/help/setting-up-ticketing">
                  <a className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="font-medium text-primary hover:underline">Setting Up Ticketing</p>
                    <p className="text-sm text-muted-foreground">Configure tickets and payment processing</p>
                  </a>
                </Link>
              </div>
            </div>

            {/* Contact Support CTA */}
            <div className="border-t pt-6 mt-8">
              <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-cyan-200 dark:border-cyan-800">
                <CardContent className="p-6 text-center space-y-3">
                  <p className="font-semibold">Still need help?</p>
                  <p className="text-sm text-muted-foreground">
                    Our support team is here to assist you with any questions.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/contact">
                      <Button>Contact Support</Button>
                    </Link>
                    <Link href="/support">
                      <Button variant="outline">Submit a Ticket</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

