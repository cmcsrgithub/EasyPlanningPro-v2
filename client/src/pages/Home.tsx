import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Calendar, MapPin, Users, Image, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to dashboard if logged in
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

  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create and manage events, reunions, and gatherings with ease",
    },
    {
      icon: MapPin,
      title: "Venue Tracking",
      description: "Keep track of all your venues and locations in one place",
    },
    {
      icon: Users,
      title: "Member Directory",
      description: "Organize and manage your member database effortlessly",
    },
    {
      icon: Image,
      title: "Photo Gallery",
      description: "Share and organize event photos with beautiful galleries",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <span className="font-semibold text-lg">{APP_TITLE}</span>
          </div>
          <Button onClick={() => (window.location.href = getLoginUrl())}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Plan Amazing Events with Ease
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              The all-in-one platform for managing events, reunions, and gatherings.
              Beautiful, intuitive, and powerful.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">
              Powerful features to make event planning effortless
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-apple"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-primary/5 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of event planners who trust {APP_TITLE}
            </p>
            <Button
              size="lg"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Start Planning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_TITLE}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
