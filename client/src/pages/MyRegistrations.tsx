import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, XCircle } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function MyRegistrations() {
  const { data: registrations, isLoading } = trpc.activities.getMyRegistrations.useQuery();
  const utils = trpc.useUtils();

  const cancelMutation = trpc.activities.cancelRegistration.useMutation({
    onSuccess: () => {
      toast.success("Registration cancelled");
      utils.activities.getMyRegistrations.invalidate();
    },
    onError: () => {
      toast.error("Failed to cancel registration");
    },
  });

  // Get activity details for each registration
  const activityQueries = registrations?.map((reg) =>
    trpc.activities.getById.useQuery({ id: reg.activityId })
  ) || [];

  const now = new Date();
  const upcomingRegistrations = registrations?.filter((reg, index) => {
    const activity = activityQueries[index]?.data;
    return activity && new Date(activity.startTime) >= now && reg.status === "confirmed";
  }) || [];

  const pastRegistrations = registrations?.filter((reg, index) => {
    const activity = activityQueries[index]?.data;
    return activity && new Date(activity.startTime) < now && reg.status === "confirmed";
  }) || [];

  const cancelledRegistrations = registrations?.filter(
    (reg) => reg.status === "cancelled"
  ) || [];

  const handleCancel = (id: string) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;
    cancelMutation.mutate({ id });
  };

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

  const RegistrationCard = ({ registration, activity, showCancel = true }: any) => {
    if (!activity) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link href={`/activities/${activity.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                  {activity.title}
                </h3>
              </Link>
              {activity.activityType && (
                <Badge variant="secondary" className="mt-2">
                  {activity.activityType}
                </Badge>
              )}
            </div>
            {showCancel && registration.status === "confirmed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancel(registration.id)}
                disabled={cancelMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(activity.startTime)}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
            </div>
            {activity.location && (
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {activity.location}
              </div>
            )}
          </div>

          {registration.notes && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm">{registration.notes}</p>
            </div>
          )}

          <div className="mt-4 text-xs text-muted-foreground">
            Registered on {formatDate(registration.registeredAt)}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">My Registrations</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your activity registrations
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledRegistrations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingRegistrations.length > 0 ? (
              upcomingRegistrations.map((reg, index) => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  activity={activityQueries[registrations?.indexOf(reg) || 0]?.data}
                  showCancel={true}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Activities</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    You haven't registered for any upcoming activities yet.
                  </p>
                  <Link href="/activities">
                    <Button>Browse Activities</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastRegistrations.length > 0 ? (
              pastRegistrations.map((reg, index) => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  activity={activityQueries[registrations?.indexOf(reg) || 0]?.data}
                  showCancel={false}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Past Activities</h3>
                  <p className="text-muted-foreground text-center">
                    You haven't attended any activities yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledRegistrations.length > 0 ? (
              cancelledRegistrations.map((reg, index) => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  activity={activityQueries[registrations?.indexOf(reg) || 0]?.data}
                  showCancel={false}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Cancelled Registrations</h3>
                  <p className="text-muted-foreground text-center">
                    You haven't cancelled any registrations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

