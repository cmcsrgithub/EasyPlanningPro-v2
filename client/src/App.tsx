import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Directory from "./pages/Directory";
import Gallery from "./pages/Gallery";
import EventForm from "./pages/EventForm";
import VenueForm from "./pages/VenueForm";
import MemberForm from "./pages/MemberForm";
import EventDetail from "./pages/EventDetail";
import VenueDetail from "./pages/VenueDetail";
import MemberDetail from "./pages/MemberDetail";
import Settings from "./pages/Settings";
import Polls from "./pages/Polls";
import PollForm from "./pages/PollForm";
import PollDetail from "./pages/PollDetail";
import Tasks from "./pages/Tasks";
import Financial from "@/pages/Financial";
import Messaging from "@/pages/Messaging";
import EventPackages from "@/pages/EventPackages";
import PackageDetail from "@/pages/PackageDetail";
import Branding from "@/pages/Branding";
import Sponsors from "@/pages/Sponsors";
import Fundraising from "@/pages/Fundraising";
import CustomForms from "@/pages/CustomForms";
import Analytics from "@/pages/Analytics";
import EventCheckout from "./pages/EventCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Team from "./pages/Team";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityForm from "./pages/ActivityForm";
import MyRegistrations from "./pages/MyRegistrations";
import Templates from "./pages/Templates";
import TemplateGallery from "./pages/TemplateGallery";
import TemplateViewer from "./pages/TemplateViewer";
import TemplateCustomize from "./pages/TemplateCustomize";
import SharedTemplate from "./pages/SharedTemplate";
import WaitlistManagement from "./pages/WaitlistManagement";
import CalendarView from "./pages/CalendarView";
import TravelPlanner from "./pages/TravelPlanner";
import Forum from "./pages/Forum";
import SupportTickets from "./pages/SupportTickets";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import SystemMonitoring from "./pages/SystemMonitoring";
import ContentModeration from "./pages/ContentModeration";
import SystemConfiguration from "./pages/SystemConfiguration";
import EmailMarketing from "./pages/EmailMarketing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import HelpArticle from "./pages/HelpArticle";
import ForumTopic from "./pages/ForumTopic";
import TicketDetail from "./pages/TicketDetail";
import Volunteers from "./pages/Volunteers";
import TemplateDetail from "./pages/TemplateDetail";
import SponsorDetail from "./pages/SponsorDetail";
import DonationDetail from "./pages/DonationDetail";
import PackageForm from "./pages/PackageForm";
import TemplateForm from "./pages/TemplateForm";
import AlbumDetail from "./pages/AlbumDetail";
import PhotoDetail from "./pages/PhotoDetail";
import MessageChannel from "./pages/MessageChannel";
import UserProfile from "./pages/UserProfile";
import AccountSettings from "./pages/AccountSettings";
import SecuritySettings from "./pages/SecuritySettings";
import NotificationSettings from "./pages/NotificationSettings";
import BillingSettings from "./pages/BillingSettings";
import IntegrationSettings from "./pages/IntegrationSettings";
import APIDocumentation from "./pages/APIDocumentation";
import UserGuide from "./pages/UserGuide";
import VideoTutorials from "./pages/VideoTutorials";
import Changelog from "./pages/Changelog";
import Roadmap from "./pages/Roadmap";
import Features from "./pages/Features";
import Testimonials from "./pages/Testimonials";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Resources from "./pages/Resources";
import Downloads from "./pages/Downloads";
import Integrations from "./pages/Integrations";
import Pricing from "./pages/Pricing";
import Compare from "./pages/Compare";
import Enterprise from "./pages/Enterprise";
import Partners from "./pages/Partners";
import Affiliates from "./pages/Affiliates";
import Careers from "./pages/Careers";

function Router() {
  return (
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
