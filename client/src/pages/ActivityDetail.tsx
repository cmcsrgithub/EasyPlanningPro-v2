import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, DollarSign, Edit, Trash2, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";

export default function ActivityDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: activity, isLoading } = trpc.activities.getById.useQuery(
    { id: id || "" },
    { enabled: !!id }
  );

  const { data: registrations } = trpc.activities.getRegistrations.useQuery(
    { activityId: id || "" },
    { enabled: !!id }
  );

  const { data: myRegistrations } = trpc.activities.getMyRegistrations.useQuery();

  const registerMutation = trpc.activities.register.useMutation({
    onSuccess: () => {
      toast.success("Successfully registered for activity!");
      utils.activities.getRegistrations.invalidate();
      utils.activities.getMyRegistrations.invalidate();
    },
    onError: () => {
      toast.error("Failed to register for activity");
    },
  });

  const cancelMutation = trpc.activities.cancelRegistration.useMutation({
    onSuccess: () => {
      toast.success("Registration cancelled");
      utils.activities.getRegistrations.invalidate();
      utils.activities.getMyRegistrations.invalidate();
    },
    onError: () => {
      toast.error("Failed to cancel registration");
    },
  });

  const deleteMutation = trpc.activities.delete.useMutation({
    onSuccess: () => {
      toast.success("Activity deleted");
      setLocation("/activities");
    },
    onError: () => {
      toast.error("Failed to delete activity");
    },
  });

  const isRegistered = myRegistrations?.some(
    (reg) => reg.activityId === id && reg.status === "confirmed"
  );

  const myRegistration = myRegistrations?.find(
    (reg) => reg.activityId === id && reg.status === "confirmed"
  );

  const confirmedRegistrations = registrations?.filter((r) => r.status === "confirmed") || [];
  const spotsLeft = activity?.capacity ? activity.capacity - confirmedRegistrations.length : null;

  const handleRegister = () => {
    if (!id) return;
    registerMutation.mutate({ activityId: id });
  };

  const handleCancel = () => {
    if (!myRegistration) return;
    cancelMutation.mutate({ id: myRegistration.id });
  };

  const handleDelete = () => {
    if (!id || !confirm("Are you sure you want to delete this activity?")) return;
    deleteMutation.mutate({ id });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!activity) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-2">Activity Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The activity you're looking for doesn't exist.
            </p>
            <Link href="/activities">
              <Button>Back to Activities</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-semibold tracking-tight">{activity.title}</h1>
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
              {activity.activityType && (
                <Badge variant="outline">{activity.activityType}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isRegistered ? (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Cancel Registration
              </Button>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={
                  registerMutation.isPending ||
                  activity.status !== "active" ||
                  (spotsLeft !== null && spotsLeft <= 0)
                }
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {spotsLeft !== null && spotsLeft <= 0 ? "Full" : "Register"}
              </Button>
            )}
            <Link href={`/activities/${id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {activity.description || "No description provided"}
                </p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">{formatDate(activity.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">
                      {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                    </p>
                  </div>
                </div>

                {activity.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{activity.location}</p>
                    </div>
                  </div>
                )}

                {activity.capacity && (
                  <div className="flex items-center text-sm">
                    <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-muted-foreground">
                        {confirmedRegistrations.length} / {activity.capacity} registered
                        {spotsLeft !== null && spotsLeft > 0 && (
                          <span className="text-green-600 ml-2">
                            ({spotsLeft} spots left)
                          </span>
                        )}
                        {spotsLeft !== null && spotsLeft <= 0 && (
                          <span className="text-red-600 ml-2">(Full)</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {activity.price && parseFloat(activity.price) > 0 && (
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-muted-foreground">${activity.price}</p>
                    </div>
                  </div>
                )}

                {activity.organizerName && (
                  <div className="flex items-center text-sm">
                    <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Organizer</p>
                      <p className="text-muted-foreground">{activity.organizerName}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            {(activity.materials || activity.equipment || activity.notes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activity.materials && (
                    <div>
                      <p className="font-medium mb-1">Required Materials</p>
                      <p className="text-sm text-muted-foreground">{activity.materials}</p>
                    </div>
                  )}
                  {activity.equipment && (
                    <div>
                      <p className="font-medium mb-1">Equipment Provided</p>
                      <p className="text-sm text-muted-foreground">{activity.equipment}</p>
                    </div>
                  )}
                  {activity.notes && (
                    <div>
                      <p className="font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {activity.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Status */}
            {isRegistered && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900">You're Registered!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-800">
                    You're all set for this activity. We'll send you a reminder before it starts.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Attendees */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Attendees ({confirmedRegistrations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {confirmedRegistrations.length > 0 ? (
                  <div className="space-y-3">
                    {confirmedRegistrations.slice(0, 10).map((reg) => (
                      <div key={reg.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {reg.userId?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            User {reg.userId?.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(reg.registeredAt || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {confirmedRegistrations.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        +{confirmedRegistrations.length - 10} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No registrations yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

