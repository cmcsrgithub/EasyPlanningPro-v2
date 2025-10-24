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
import WaitlistManagement from "./pages/WaitlistManagement";
import CalendarView from "./pages/CalendarView";
import TravelPlanner from "./pages/TravelPlanner";
import Forum from "./pages/Forum";
import SupportTickets from "./pages/SupportTickets";
import AdminDashboard from "./pages/AdminDashboard";
import EmailMarketing from "./pages/EmailMarketing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

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
      <Route path={"/templates"} component={Templates} />
      <Route path={"/events/:eventId/waitlist"} component={WaitlistManagement} />
      <Route path={"/calendar"} component={CalendarView} />
      <Route path={"/travel"} component={TravelPlanner} />
      <Route path={"/forum"} component={Forum} />
      <Route path={"/tickets"} component={SupportTickets} />
      <Route path={"/admin"} component={AdminDashboard} />
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
