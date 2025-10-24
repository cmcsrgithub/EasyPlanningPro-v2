import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  Calendar, MapPin, Users, DollarSign, 
  FileText, BarChart3, Mail, CreditCard,
  Shield, Building2, FileCheck, UserCog,
  Zap, Globe, Clock, CheckCircle2
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      setLocation("/dashboard");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const freeFeatures = [
    {
      icon: Calendar,
      title: "Events",
      description: "Create and manage events with detailed scheduling and organization tools.",
    },
    {
      icon: Mail,
      title: "Event Management",
      description: "Send invitations and manage event logistics with a powerful suite of tools.",
    },
    {
      icon: MapPin,
      title: "Venue Management",
      description: "Find and coordinate venues, accommodations, and location details.",
    },
    {
      icon: Users,
      title: "Guest Management",
      description: "Invite guests, track RSVPs, and manage attendee information effortlessly.",
    },
    {
      icon: FileText,
      title: "Event Attendee / Day",
      description: "Track attendance with a detailed list of who attended each day of your event.",
    },
  ];

  const premiumFeatures = [
    {
      icon: Calendar,
      title: "Everything in Basic",
      description: "All features from the Basic plan plus advanced capabilities.",
      badge: "PREMIUM",
    },
    {
      icon: FileCheck,
      title: "Forms",
      description: "Create custom forms for registration, surveys, and data collection.",
      badge: "PREMIUM",
    },
    {
      icon: Globe,
      title: "Online Galleries",
      description: "Share event photos and memories with beautiful online galleries.",
      badge: "PREMIUM",
    },
    {
      icon: Mail,
      title: "Email Automation",
      description: "Automate email communications and reminders for your events.",
      badge: "PREMIUM",
    },
    {
      icon: CreditCard,
      title: "Custom Integration",
      description: "Integrate with your favorite tools and services seamlessly.",
      badge: "PREMIUM",
    },
    {
      icon: BarChart3,
      title: "Track & Automate Accounts",
      description: "Automate account management and track user engagement.",
      badge: "PREMIUM",
    },
  ];

  const proFeatures = [
    {
      icon: Zap,
      title: "Everything in Premium",
      description: "All Premium features plus professional-grade tools.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: Mail,
      title: "5 Emails",
      description: "Send up to 5 custom branded emails per month.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: Globe,
      title: "Easy Networking",
      description: "Connect attendees with built-in networking features.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: Shield,
      title: "Advanced User Management",
      description: "Manage users with advanced permissions and roles.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: FileText,
      title: "Custom Forms",
      description: "Create unlimited custom forms with advanced logic.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: BarChart3,
      title: "Custom Content & Activities",
      description: "Build custom content and activities for your events.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: Building2,
      title: "Detailed Reports (Non-CPA)",
      description: "Generate comprehensive reports and analytics.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: Clock,
      title: "Sync to 3 Attendance Accounts",
      description: "Sync attendance data across multiple accounts.",
      badge: "PRO",
      color: "cyan",
    },
    {
      icon: UserCog,
      title: "Event Coordinator Accounts",
      description: "Add dedicated coordinator accounts for team management.",
      badge: "PRO",
      color: "cyan",
    },
  ];

  const businessFeatures = [
    {
      icon: Zap,
      title: "Everything in Pro",
      description: "All Pro features plus enterprise capabilities.",
      badge: "BUSINESS",
      color: "purple",
    },
    {
      icon: Mail,
      title: "10+ Emails",
      description: "Send unlimited branded emails to your attendees.",
      badge: "BUSINESS",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Advanced User Management",
      description: "Enterprise-grade user management and security.",
      badge: "BUSINESS",
      color: "purple",
    },
    {
      icon: FileText,
      title: "Unlimited Forms & Surveys",
      description: "Create unlimited forms with advanced features.",
      badge: "BUSINESS",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Advanced Event Analytics",
      description: "Deep insights into event performance and engagement.",
      badge: "BUSINESS",
      color: "purple",
    },
    {
      icon: Building2,
      title: "API for Automation",
      description: "Full API access for custom integrations and automation.",
      badge: "BUSINESS",
      color: "purple",
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Perfect for small events",
      features: [
        "Events",
        "Venues",
        "Galleries",
        "Email Support",
        "Mobile Access",
        "Event Templates",
        "RSVP Tracking",
        "Basic Reporting",
        "Member Directory",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/month",
      description: "For growing organizations",
      features: [
        "Everything in Basic",
        "Custom Forms",
        "Online Galleries",
        "Email Automation",
        "Custom Integration",
        "Track & Automate Accounts",
        "Priority Support",
        "Advanced Reporting",
        "Custom Branding",
        "Up to 200 attendees",
        "Photo Albums",
        "Event Analytics",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$59.99",
      period: "/month",
      description: "For professional planners",
      features: [
        "Everything in Premium",
        "5 Emails",
        "Easy Networking",
        "Advanced User Management",
        "Custom Forms",
        "Custom Content & Activities",
        "Detailed Reports (Non-CPA)",
        "Sync to 3 Attendance Accounts",
        "Event Coordinator Accounts",
        "Up to 500 attendees",
        "Dedicated Support",
        "API Access (Limited)",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Business",
      price: "$129.99",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "10+ Emails",
        "Advanced User Management",
        "Unlimited Forms & Surveys",
        "Advanced Event Analytics",
        "API for Automation",
        "Unlimited attendees",
        "White-label Options",
        "Custom Integrations",
        "Dedicated Account Manager",
        "SLA Guarantee",
        "Priority Phone Support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      period: "",
      description: "Custom solutions",
      features: [
        "Custom Pricing",
        "Dedicated Account Manager",
        "Custom Development",
        "On-premise Options",
        "Training & Onboarding",
        "24/7 Phone Support",
        "Custom SLA",
        "Security Review",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-auto" />}
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact Us
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => (window.location.href = getLoginUrl())}>
              Sign In
            </Button>
            <Button onClick={() => (window.location.href = getLoginUrl())}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative py-32 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/hero-event-planning.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Event Planning, Made Easy
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Less stress. More Success. Start Planning Today!
          </p>
          <Button 
            size="lg"
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-lg px-8 py-6"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Free Features */}
      <section id="features" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Free Features</h2>
            <p className="text-xl text-muted-foreground">
              These core features are available for free to help you get started with event planning
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {freeFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-2 hover:border-primary/50 hover:shadow-xl transition-apple">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              <span className="inline-flex items-center gap-2">
                <span className="px-3 py-1 bg-[#FF6B35] text-white text-sm font-semibold rounded">PREMIUM</span>
                Premium Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Unlock these powerful features with our Premium plan to take your events to the next level
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {premiumFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-2 hover:border-[#FF6B35]/50 hover:shadow-xl transition-apple">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-[#FF6B35] text-white text-xs font-semibold rounded">
                        {feature.badge}
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-[#FF6B35]" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pro Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              <span className="inline-flex items-center gap-2">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded">PRO</span>
                Pro Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Unlock the full potential of event planning with our Pro subscription where you'll have access
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {proFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-2 hover:border-primary/50 hover:shadow-xl transition-apple">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                        {feature.badge}
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              <span className="inline-flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded">BUSINESS</span>
                Business Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Enterprise-grade features for large organizations and professional event planners
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {businessFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-2 hover:border-purple-600/50 hover:shadow-xl transition-apple">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                        {feature.badge}
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-purple-600/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground mb-8">
              We offer flexible pricing to fit your event needs and budget
            </p>
            <Button 
              size="lg"
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Get Started With a Free 30-Day Trial
            </Button>
          </div>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-5 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`border-2 ${
                  plan.highlighted 
                    ? 'border-primary shadow-2xl scale-105' 
                    : 'border-border hover:border-primary/50'
                } transition-apple`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-primary hover:bg-primary/90' 
                        : plan.name === 'Enterprise'
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-[#FF6B35] hover:bg-[#FF6B35]/90'
                    }`}
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Get Started With a Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="relative py-32 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/hero-event-planning.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to Plan Your Perfect Gathering?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Join thousands of successful event planners. Start your free trial today!
          </p>
          <Button 
            size="lg"
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-lg px-8 py-6"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4">EasyPlanningPro</h3>
              <p className="text-sm opacity-90">
                The modern way to plan and manage events.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#features" className="hover:opacity-100 transition-opacity">Features</a></li>
                <li><a href="#pricing" className="hover:opacity-100 transition-opacity">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#about" className="hover:opacity-100 transition-opacity">About</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
            <p>© {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

