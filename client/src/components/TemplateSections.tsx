import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Users, Clock, CheckCircle2, DollarSign, 
  Camera, Music, Utensils, Gift, Heart, Award, MessageSquare,
  FileText, BarChart, ListTodo, Ticket, Trophy, Target, Briefcase,
  GraduationCap, Plane, Home, Book, Sparkles, Star, Zap
} from "lucide-react";

interface SectionProps {
  color?: string;
  gradient?: string;
}

export function HeroSection({ title, description, icon: Icon, badges, color, gradient }: any) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${gradient || 'from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950'} p-8 md:p-12`}>
      <div className="relative z-10 text-center space-y-4">
        {Icon && (
          <div className="flex justify-center">
            <Icon className={`h-16 w-16 text-${color}-500 fill-${color}-500`} />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
        {badges && (
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {badges.map((badge: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-sm">{badge}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DateTimeSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <Calendar className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Date & Time</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Set event date, start time, end time, and timezone
        </p>
      </CardContent>
    </Card>
  );
}

export function LocationSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <MapPin className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Location</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Venue address, directions, parking info, and maps
        </p>
      </CardContent>
    </Card>
  );
}

export function GuestListSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <Users className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Guest List</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Manage invitations, RSVPs, and attendee information
        </p>
      </CardContent>
    </Card>
  );
}

export function RSVPSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <CheckCircle2 className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">RSVP Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Track responses, dietary restrictions, and plus-ones
        </p>
      </CardContent>
    </Card>
  );
}

export function ActivitiesSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <ListTodo className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Activities & Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Plan activities, sessions, and event timeline
        </p>
      </CardContent>
    </Card>
  );
}

export function TicketingSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <Ticket className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Ticketing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Sell tickets, manage pricing tiers, and track sales
        </p>
      </CardContent>
    </Card>
  );
}

export function VenueDetailsSection({ color }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className={`h-5 w-5 text-${color}-500`} />
          Venue Details
        </CardTitle>
        <CardDescription>Event location information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Venue Address</p>
            <p className="text-sm text-muted-foreground">Full address with directions</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Capacity</p>
            <p className="text-sm text-muted-foreground">Maximum attendee capacity</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Venue Hours</p>
            <p className="text-sm text-muted-foreground">Opening and closing times</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CateringSection({ color }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className={`h-5 w-5 text-${color}-500`} />
          Catering & Menu
        </CardTitle>
        <CardDescription>Food and beverage planning</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <Utensils className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Menu Options</p>
            <p className="text-sm text-muted-foreground">Appetizers, main courses, desserts</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Dietary Restrictions</p>
            <p className="text-sm text-muted-foreground">Vegetarian, vegan, allergies, etc.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EntertainmentSection({ color }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className={`h-5 w-5 text-${color}-500`} />
          Entertainment
        </CardTitle>
        <CardDescription>Music, performances, and activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <Music className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Music & DJ</p>
            <p className="text-sm text-muted-foreground">Live band, DJ, or playlist</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Performances</p>
            <p className="text-sm text-muted-foreground">Special acts and entertainment</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChecklistSection({ title, items, color }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className={`h-5 w-5 text-${color}-500`} />
          {title || "Event Checklist"}
        </CardTitle>
        <CardDescription>Essential tasks and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function BudgetSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <DollarSign className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Budget & Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Track costs, payments, and financial reporting
        </p>
      </CardContent>
    </Card>
  );
}

export function PhotoGallerySection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <Camera className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Photo Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Share and collect event photos from attendees
        </p>
      </CardContent>
    </Card>
  );
}

export function SponsorsSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <Award className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Sponsors</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Manage event sponsors and partnership details
        </p>
      </CardContent>
    </Card>
  );
}

export function FundraisingSection({ color }: SectionProps) {
  return (
    <Card className={`border-${color}-200 dark:border-${color}-800`}>
      <CardHeader className="pb-3">
        <Heart className={`h-8 w-8 text-${color}-500 mb-2`} />
        <CardTitle className="text-lg">Fundraising</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Set goals, track donations, and manage campaigns
        </p>
      </CardContent>
    </Card>
  );
}

export function CTASection({ title, description, buttonText, color, gradient, onAction }: any) {
  return (
    <Card className={`bg-gradient-to-r ${gradient} border-${color}-200 dark:border-${color}-800`}>
      <CardContent className="pt-6 text-center space-y-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
        <Button size="lg" onClick={onAction} className={`bg-${color}-500 hover:bg-${color}-600`}>
          <Sparkles className="mr-2 h-5 w-5" />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

