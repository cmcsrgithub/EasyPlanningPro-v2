import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PageLoader from "./components/PageLoader";
import SkipToMain from "./components/SkipToMain";

// Lazy load all page components for optimal code splitting
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Events = lazy(() => import("./pages/Events"));
const Venues = lazy(() => import("./pages/Venues"));
const Directory = lazy(() => import("./pages/Directory"));
const Gallery = lazy(() => import("./pages/Gallery"));
const EventForm = lazy(() => import("./pages/EventForm"));
const VenueForm = lazy(() => import("./pages/VenueForm"));
const MemberForm = lazy(() => import("./pages/MemberForm"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const VenueDetail = lazy(() => import("./pages/VenueDetail"));
const MemberDetail = lazy(() => import("./pages/MemberDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const Polls = lazy(() => import("./pages/Polls"));
const PollForm = lazy(() => import("./pages/PollForm"));
const PollDetail = lazy(() => import("./pages/PollDetail"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Financial = lazy(() => import("@/pages/Financial"));
const Messaging = lazy(() => import("@/pages/Messaging"));
const EventPackages = lazy(() => import("@/pages/EventPackages"));
const PackageDetail = lazy(() => import("@/pages/PackageDetail"));
const Branding = lazy(() => import("@/pages/Branding"));
const Sponsors = lazy(() => import("@/pages/Sponsors"));
const Fundraising = lazy(() => import("@/pages/Fundraising"));
const CustomForms = lazy(() => import("@/pages/CustomForms"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const EventCheckout = lazy(() => import("./pages/EventCheckout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Team = lazy(() => import("./pages/Team"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Activities = lazy(() => import("./pages/Activities"));
const ActivityDetail = lazy(() => import("./pages/ActivityDetail"));
const ActivityForm = lazy(() => import("./pages/ActivityForm"));
const MyRegistrations = lazy(() => import("./pages/MyRegistrations"));
const Templates = lazy(() => import("./pages/Templates"));
const TemplateGallery = lazy(() => import("./pages/TemplateGallery"));
const TemplateViewer = lazy(() => import("./pages/TemplateViewer"));
const TemplateCustomize = lazy(() => import("./pages/TemplateCustomize"));
const SharedTemplate = lazy(() => import("./pages/SharedTemplate"));
const WaitlistManagement = lazy(() => import("./pages/WaitlistManagement"));
const CalendarView = lazy(() => import("./pages/CalendarView"));
const TravelPlanner = lazy(() => import("./pages/TravelPlanner"));
const Forum = lazy(() => import("./pages/Forum"));
const SupportTickets = lazy(() => import("./pages/SupportTickets"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const SystemMonitoring = lazy(() => import("./pages/SystemMonitoring"));
const ContentModeration = lazy(() => import("./pages/ContentModeration"));
const SystemConfiguration = lazy(() => import("./pages/SystemConfiguration"));
const EmailMarketing = lazy(() => import("./pages/EmailMarketing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const HelpArticle = lazy(() => import("./pages/HelpArticle"));
const ForumTopic = lazy(() => import("./pages/ForumTopic"));
const TicketDetail = lazy(() => import("./pages/TicketDetail"));
const Volunteers = lazy(() => import("./pages/Volunteers"));
const TemplateDetail = lazy(() => import("./pages/TemplateDetail"));
const SponsorDetail = lazy(() => import("./pages/SponsorDetail"));
const DonationDetail = lazy(() => import("./pages/DonationDetail"));
const PackageForm = lazy(() => import("./pages/PackageForm"));
const TemplateForm = lazy(() => import("./pages/TemplateForm"));
const AlbumDetail = lazy(() => import("./pages/AlbumDetail"));
const PhotoDetail = lazy(() => import("./pages/PhotoDetail"));
const MessageChannel = lazy(() => import("./pages/MessageChannel"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const BillingSettings = lazy(() => import("./pages/BillingSettings"));
const IntegrationSettings = lazy(() => import("./pages/IntegrationSettings"));
const APIDocumentation = lazy(() => import("./pages/APIDocumentation"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const VideoTutorials = lazy(() => import("./pages/VideoTutorials"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Features = lazy(() => import("./pages/Features"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Resources = lazy(() => import("./pages/Resources"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Compare = lazy(() => import("./pages/Compare"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Partners = lazy(() => import("./pages/Partners"));
const Affiliates = lazy(() => import("./pages/Affiliates"));
const Careers = lazy(() => import("./pages/Careers"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Router() {
  return (
    <>
      <SkipToMain />
      <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/events"} component={Events} />
        <Route path={"/events/new"} component={EventForm} />
        <Route path={"/events/:id/edit"} component={EventForm} />
        <Route path={"/events/:id/checkout"} component={EventCheckout} />
        <Route path={"/events/:id/payment-success"} component={PaymentSuccess} />
        <Route path={"/events/:id"} component={EventDetail} />
        <Route path={"/venues"} component={Venues} />
        <Route path={"/venues/new"} component={VenueForm} />
        <Route path={"/venues/:id/edit"} component={VenueForm} />
        <Route path={"/venues/:id"} component={VenueDetail} />
        <Route path={"/directory"} component={Directory} />
        <Route path={"/directory/new"} component={MemberForm} />
        <Route path={"/directory/:id/edit"} component={MemberForm} />
        <Route path={"/directory/:id"} component={MemberDetail} />
        <Route path={"/gallery"} component={Gallery} />
        <Route path={"/settings"} component={Settings} />
        <Route path={"/login"} component={Login} />
        <Route path={"/signup"} component={Signup} />
        <Route path={"/forgot-password"} component={ForgotPassword} />
        <Route path={"/reset-password"} component={ResetPassword} />
        <Route path={"/profile"} component={Profile} />
        <Route path={"/activities"} component={Activities} />
        <Route path={"/activities/new"} component={ActivityForm} />
        <Route path={"/activities/:id"} component={ActivityDetail} />
        <Route path={"/activities/:id/edit"} component={ActivityForm} />
        <Route path={"/my-registrations"} component={MyRegistrations} />
        <Route path={"/templates/gallery"} component={TemplateGallery} />
        <Route path={"/templates/gallery/:id"} component={TemplateViewer} />
        <Route path={"/templates/customize/:templateId"} component={TemplateCustomize} />
        <Route path={"/shared/:slug"} component={SharedTemplate} />
        <Route path={"/templates"} component={Templates} />
        <Route path={"/events/:eventId/waitlist"} component={WaitlistManagement} />
        <Route path={"/calendar"} component={CalendarView} />
        <Route path={"/travel"} component={TravelPlanner} />
        <Route path={"/forum"} component={Forum} />
        <Route path={"/tickets"} component={SupportTickets} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/users"} component={AdminUsers} />
        <Route path={"/admin/monitoring"} component={SystemMonitoring} />
        <Route path={"/admin/moderation"} component={ContentModeration} />
        <Route path={"/admin/configuration"} component={SystemConfiguration} />
        <Route path={"/email-marketing"} component={EmailMarketing} />
        <Route path={"/privacy"} component={PrivacyPolicy} />
        <Route path={"/terms"} component={TermsOfService} />
        <Route path={"/about"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/faq"} component={FAQ} />
        <Route path={"/team"} component={Team} />
        <Route path={"/polls"} component={Polls} />
        <Route path={"/polls/new"} component={PollForm} />
        <Route path={"/polls/:id"} component={PollDetail} />
        <Route path="/events/:eventId/tasks" component={Tasks} />
        <Route path="/events/:eventId/financial" component={Financial} />
        <Route path="/events/:eventId/messaging" component={Messaging} />
        <Route path="/packages" component={EventPackages} />
        <Route path="/packages/:id" component={PackageDetail} />
        <Route path="/branding" component={Branding} />
        <Route path="/events/:eventId/sponsors" component={Sponsors} />
        <Route path="/events/:eventId/fundraising" component={Fundraising} />
        <Route path="/events/:eventId/forms" component={CustomForms} />
        <Route path="/events/:eventId/analytics" component={Analytics} />
        <Route path="/help-center" component={HelpCenter} />
        <Route path="/help/:slug" component={HelpArticle} />
        <Route path="/forum/:id" component={ForumTopic} />
        <Route path="/tickets/:id" component={TicketDetail} />
        <Route path="/volunteers" component={Volunteers} />
        <Route path="/templates/:id" component={TemplateDetail} />
        <Route path="/templates/new" component={TemplateForm} />
        <Route path="/sponsors/:id" component={SponsorDetail} />
        <Route path="/donations/:id" component={DonationDetail} />
        <Route path="/packages/new" component={PackageForm} />
        <Route path="/albums/:id" component={AlbumDetail} />
        <Route path="/photos/:id" component={PhotoDetail} />
        <Route path="/messages/:id" component={MessageChannel} />
        <Route path="/user/:id" component={UserProfile} />
        <Route path="/account" component={AccountSettings} />
        <Route path="/security" component={SecuritySettings} />
        <Route path="/notifications" component={NotificationSettings} />
        <Route path="/billing" component={BillingSettings} />
        <Route path="/integrations-settings" component={IntegrationSettings} />
        <Route path="/api-docs" component={APIDocumentation} />
        <Route path="/guide" component={UserGuide} />
        <Route path="/tutorials" component={VideoTutorials} />
        <Route path="/changelog" component={Changelog} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/features" component={Features} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/resources" component={Resources} />
        <Route path="/downloads" component={Downloads} />
        <Route path="/integrations" component={Integrations} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/compare" component={Compare} />
        <Route path="/enterprise" component={Enterprise} />
        <Route path="/partners" component={Partners} />
        <Route path="/affiliates" component={Affiliates} />
        <Route path="/careers" component={Careers} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

