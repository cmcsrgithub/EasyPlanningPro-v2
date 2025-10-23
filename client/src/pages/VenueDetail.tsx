import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { MapPin, Phone, Globe, Edit, Trash2, ArrowLeft, Calendar } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function VenueDetail() {
  const { user, loading: authLoading } = useAuth();
  const [, params] = useRoute("/venues/:id");
  const [, setLocation] = useLocation();
  const venueId = params?.id || "";

  const { data: venue, isLoading } = trpc.venues.getById.useQuery(
    { id: venueId },
    { enabled: !!venueId }
  );

  const { data: events } = trpc.events.list.useQuery();

  const deleteMutation = trpc.venues.delete.useMutation({
    onSuccess: () => {
      toast.success("Venue deleted successfully");
      setLocation("/venues");
    },
    onError: (error) => {
      toast.error(`Failed to delete venue: ${error.message}`);
    },
  });

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading venue...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!venue) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Venue not found</p>
          <Button onClick={() => setLocation("/venues")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this venue? This action cannot be undone.")) {
      deleteMutation.mutate({ id: venueId });
    }
  };

  const venueEvents = events?.filter(e => e.location === venue.name) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/venues")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{venue.name}</h1>
              <p className="text-muted-foreground">Venue Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setLocation(`/venues/${venueId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Venue Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{venue.address || "Not provided"}</p>
                  {venue.city && venue.state && (
                    <p className="text-muted-foreground">
                      {venue.city}, {venue.state} {venue.zipCode}
                    </p>
                  )}
                </div>
              </div>

              {venue.contactPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{venue.contactPhone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Venue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {venue.capacity && (
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-2xl font-bold text-primary">{venue.capacity} people</p>
                </div>
              )}

              {venue.description && (
                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{venue.description}</p>
                </div>
              )}

              {venue.amenities && (
                <div>
                  <p className="font-medium mb-2">Amenities</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{venue.amenities}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Events at this Venue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events at this Venue ({venueEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {venueEvents.length > 0 ? (
              <div className="space-y-3">
                {venueEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setLocation(`/events/${event.id}`)}
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.startDate ? new Date(event.startDate).toLocaleDateString() : "Date TBD"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No events scheduled</h3>
                <p className="text-muted-foreground mb-4">
                  This venue hasn't been used for any events yet
                </p>
                <Button onClick={() => setLocation("/events/new")}>
                  Create Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

