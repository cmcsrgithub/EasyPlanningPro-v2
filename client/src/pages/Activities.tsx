import { trpc } from "@/lib/trpc";
import { Calendar, Plus, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function Activities() {
  const { data: activities, isLoading } = trpc.activities.list.useQuery();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Activities</h1>
            <p className="text-muted-foreground mt-2">
              Manage event activities, sessions, and workshops
            </p>
          </div>
          <Link href="/activities/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Activity
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        ) : activities && activities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Link key={activity.id} href={`/activities/${activity.id}`}>
                <Card className="hover:shadow-lg transition-apple cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{activity.title}</CardTitle>
                        {activity.activityType && (
                          <Badge variant="secondary" className="mt-2">
                            {activity.activityType}
                          </Badge>
                        )}
                      </div>
                      {activity.status && (
                        <Badge
                          variant={
                            activity.status === "active"
                              ? "default"
                              : activity.status === "completed"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {activity.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(activity.startTime)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                    </div>
                    {activity.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="line-clamp-1">{activity.location}</span>
                      </div>
                    )}
                    {activity.capacity && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        Capacity: {activity.capacity}
                      </div>
                    )}
                    {activity.price && parseFloat(activity.price) > 0 && (
                      <div className="flex items-center text-sm font-medium">
                        <DollarSign className="mr-2 h-4 w-4" />
                        ${activity.price}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Create your first activity to get started
              </p>
              <Link href="/activities/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Activity
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

