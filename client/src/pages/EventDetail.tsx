import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Users, Clock, Edit, Trash2, ArrowLeft, ListTodo, DollarSign, MessageSquare, Award, Heart, FileText, BarChart } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function EventDetail() {
  const { user, loading: authLoading } = useAuth();
  const [, params] = useRoute("/events/:id");
  const [, setLocation] = useLocation();
  const eventId = params?.id || "";

  const { data: event, isLoading } = trpc.events.getById.useQuery(
    { id: eventId },
    { enabled: !!eventId }
  );

  const { data: rsvps } = trpc.rsvps.getByEvent.useQuery(
    { eventId },
    { enabled: !!eventId }
  );

  const deleteMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Event deleted successfully");
      setLocation("/events");
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading event...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Event not found</p>
          <Button onClick={() => setLocation("/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      deleteMutation.mutate({ id: eventId });
    }
  };

  const attendingCount = rsvps?.filter((r: any) => r.status === "attending").length || 0;
  const declinedCount = rsvps?.filter((r: any) => r.status === "declined").length || 0;
  const pendingCount = rsvps?.filter((r: any) => r.status === "pending").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/events")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
              <p className="text-muted-foreground">Event Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/tasks`)}>
              <ListTodo className="mr-2 h-4 w-4" />
              Tasks
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/financial`)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Financial
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/messaging`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/sponsors`)}>
              <Award className="mr-2 h-4 w-4" />
              Sponsors
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/fundraising`)}>
              <Heart className="mr-2 h-4 w-4" />
              Fundraising
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/forms`)}>
              <FileText className="mr-2 h-4 w-4" />
              Forms
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/analytics`)}>
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/events/${eventId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Event Info Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {event.startDate ? new Date(event.startDate).toLocaleDateString() : "TBD"}
              </div>
              {event.endDate && (
                <p className="text-xs text-muted-foreground">
                  to {new Date(event.endDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {event.startDate ? new Date(event.startDate).toLocaleTimeString() : "TBD"}
              </div>
              {event.endDate && (
                <p className="text-xs text-muted-foreground">to {new Date(event.endDate).toLocaleTimeString()}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{event.location || "TBD"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RSVPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendingCount}</div>
              <p className="text-xs text-muted-foreground">
                {pendingCount} pending, {declinedCount} declined
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs ({rsvps?.length || 0})</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {event.description || "No description provided."}
                </p>
              </CardContent>
            </Card>


          </TabsContent>

          <TabsContent value="rsvps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RSVP List</CardTitle>
                <CardDescription>Manage event attendees and responses</CardDescription>
              </CardHeader>
              <CardContent>
                {rsvps && rsvps.length > 0 ? (
                  <div className="space-y-4">
                    {rsvps.map((rsvp: any) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Member #{rsvp.memberId}</p>
                            <p className="text-sm text-muted-foreground">
                              Responded: {rsvp.respondedAt ? new Date(rsvp.respondedAt).toLocaleDateString() : "Pending"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            rsvp.status === "attending"
                              ? "default"
                              : rsvp.status === "declined"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {rsvp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No RSVPs yet</h3>
                    <p className="text-muted-foreground">
                      Invite members to start tracking responses
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Photos</CardTitle>
                <CardDescription>Photo gallery for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Photo gallery coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

