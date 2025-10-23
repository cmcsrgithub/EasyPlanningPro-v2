import { trpc } from "@/lib/trpc";
import { Calendar, Plus, MapPin, Users } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function Events() {
  const { data: events, isLoading } = trpc.events.list.useQuery();

  const upcomingEvents = events?.filter(
    (e) => e.startDate && new Date(e.startDate) > new Date()
  );
  const pastEvents = events?.filter(
    (e) => e.startDate && new Date(e.startDate) <= new Date()
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Events</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your events in one place
            </p>
          </div>
          <Link href="/events/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <>
            {/* Upcoming Events */}
            {upcomingEvents && upcomingEvents.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Card className="hover:shadow-lg transition-apple cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                            {event.isPublic && (
                              <Badge variant="secondary" className="ml-2">
                                Public
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {event.startDate
                              ? new Date(event.startDate).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Date TBD"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                          {event.maxAttendees && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Max {event.maxAttendees} attendees</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents && pastEvents.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Past Events</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Card className="hover:shadow-lg transition-apple cursor-pointer h-full opacity-75">
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                          <CardDescription>
                            {event.startDate
                              ? new Date(event.startDate).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Date TBD"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Create your first event to start planning amazing gatherings, reunions, and
                celebrations.
              </p>
              <Link href="/events/new">
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

