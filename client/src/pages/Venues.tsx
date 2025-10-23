import { trpc } from "@/lib/trpc";
import { MapPin, Plus, Users, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function Venues() {
  const { data: venues, isLoading } = trpc.venues.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Venues</h1>
            <p className="text-muted-foreground mt-2">
              Manage your event venues and locations
            </p>
          </div>
          <Link href="/venues/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Venue
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
        ) : venues && venues.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`}>
                <Card className="hover:shadow-lg transition-apple cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-2">{venue.name}</CardTitle>
                      {venue.capacity && (
                        <Badge variant="secondary" className="ml-2">
                          {venue.capacity}
                        </Badge>
                      )}
                    </div>
                    {(venue.city || venue.state) && (
                      <CardDescription>
                        {[venue.city, venue.state].filter(Boolean).join(", ")}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {venue.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {venue.description}
                      </p>
                    )}
                    {venue.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </div>
                    )}
                    {venue.capacity && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {venue.capacity}</span>
                      </div>
                    )}
                    {venue.contactName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="truncate">{venue.contactName}</span>
                      </div>
                    )}
                    {venue.contactEmail && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{venue.contactEmail}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No venues yet</h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Add your first venue to start tracking locations for your events.
              </p>
              <Link href="/venues/new">
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Venue
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

