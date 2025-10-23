import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const { data: events, isLoading: eventsLoading } = trpc.events.list.useQuery();
  const { data: venues, isLoading: venuesLoading } = trpc.venues.list.useQuery();
  const { data: members, isLoading: membersLoading } = trpc.members.list.useQuery();

  const stats = [
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: Calendar,
      href: "/events",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Venues",
      value: venues?.length || 0,
      icon: MapPin,
      href: "/venues",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Members",
      value: members?.length || 0,
      icon: Users,
      href: "/directory",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const upcomingEvents = events
    ?.filter((e) => e.startDate && new Date(e.startDate) > new Date())
    ?.sort((a, b) => {
      if (!a.startDate || !b.startDate) return 0;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    })
    ?.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your events and activities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-apple cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/events/new">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>
              <Link href="/venues/new">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Add Venue
                </Button>
              </Link>
              <Link href="/directory/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Gallery
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-apple cursor-pointer">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.startDate
                            ? new Date(event.startDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Date TBD"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!eventsLoading && (!events || events.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Get started by creating your first event
              </p>
              <Link href="/events/new">
                <Button>Create Your First Event</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

