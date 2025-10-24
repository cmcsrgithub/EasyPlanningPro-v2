import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Zap } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in bringing people together through memorable events and experiences.",
    },
    {
      icon: Target,
      title: "Simplicity",
      description: "Event planning should be easy and accessible to everyone, not just professionals.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about helping you create events that people will remember.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly improving our platform with cutting-edge features and technology.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">About EasyPlanningPro</h1>
          <p className="text-muted-foreground mt-2">
            Empowering event organizers worldwide
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2024, EasyPlanningPro was born from a simple observation: event planning
            was too complicated. We saw organizers struggling with multiple tools, confusing
            interfaces, and expensive solutions that didn't meet their needs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to make professional event planning accessible to everyone. Whether
            you're organizing a small community gathering or a large conference, EasyPlanningPro
            provides the tools you need to succeed.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What We Offer</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>✓ Comprehensive event management tools</p>
            <p>✓ Easy registration and ticketing</p>
            <p>✓ Real-time communication features</p>
            <p>✓ Financial tracking and reporting</p>
            <p>✓ Mobile-friendly interface</p>
            <p>✓ 24/7 customer support</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Join Our Community</h2>
          <p className="text-muted-foreground leading-relaxed">
            Join thousands of event organizers who trust EasyPlanningPro to bring their visions
            to life. Whether you're planning your first event or your hundredth, we're here to
            help you succeed.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}

