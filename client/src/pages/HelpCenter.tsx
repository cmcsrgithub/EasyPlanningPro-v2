import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Book, Video, MessageCircle, FileText, Search } from "lucide-react";
import { useState } from "react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of EasyPlanningPro",
      articles: [
        "Creating your first event",
        "Setting up your profile",
        "Inviting team members",
        "Understanding pricing tiers",
      ],
    },
    {
      icon: FileText,
      title: "Event Management",
      description: "Manage events like a pro",
      articles: [
        "Creating and editing events",
        "Managing registrations",
        "Setting up ticketing",
        "Using event templates",
      ],
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      articles: [
        "Platform overview (5 min)",
        "Creating your first event (10 min)",
        "Advanced features tour (15 min)",
        "Tips and tricks (8 min)",
      ],
    },
    {
      icon: MessageCircle,
      title: "Support",
      description: "Get help from our team",
      articles: [
        "Contact support",
        "Submit a ticket",
        "Live chat (Business plan)",
        "Community forum",
      ],
    },
  ];

  const popularArticles = [
    { title: "How to create an event", views: 1250 },
    { title: "Setting up payment processing", views: 980 },
    { title: "Managing team members", views: 875 },
    { title: "Customizing your event page", views: 720 },
    { title: "Understanding analytics", views: 650 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers, guides, and support resources
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline"
                      >
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <div
                  key={article.title}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <a href="#" className="text-primary hover:underline">
                      {article.title}
                    </a>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {article.views} views
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help from our support team
              </p>
              <Link href="/contact">
                <a className="text-primary hover:underline">Contact Us →</a>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed guides and API docs
              </p>
              <a href="#" className="text-primary hover:underline">
                View Docs →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Book className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">FAQ</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Frequently asked questions
              </p>
              <Link href="/faq">
                <a className="text-primary hover:underline">View FAQ →</a>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

