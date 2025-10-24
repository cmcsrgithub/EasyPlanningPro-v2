import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

export default function WaitlistManagement() {
  const { eventId } = useParams();
  const utils = trpc.useUtils();

  const { data: waitlist, isLoading } = trpc.waitlist.listByEvent.useQuery(
    { eventId: eventId || "" },
    { enabled: !!eventId }
  );

  const offerSpotMutation = trpc.waitlist.offerSpot.useMutation({
    onSuccess: () => {
      toast.success("Spot offered to next person");
      utils.waitlist.listByEvent.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to offer spot");
    },
  });

  const removeMutation = trpc.waitlist.leave.useMutation({
    onSuccess: () => {
      toast.success("Removed from waitlist");
      utils.waitlist.listByEvent.invalidate();
    },
    onError: () => {
      toast.error("Failed to remove from waitlist");
    },
  });

  const handleOfferSpot = () => {
    if (!eventId) return;
    offerSpotMutation.mutate({ eventId, expiresIn: 24 });
  };

  const handleRemove = (id: string) => {
    if (!confirm("Remove this person from the waitlist?")) return;
    removeMutation.mutate({ id });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      waiting: "secondary",
      offered: "default",
      accepted: "default",
      declined: "destructive",
      expired: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
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

  const waitingList = waitlist?.filter((w) => w.status === "waiting") || [];
  const offeredList = waitlist?.filter((w) => w.status === "offered") || [];
  const otherList = waitlist?.filter(
    (w) => w.status !== "waiting" && w.status !== "offered"
  ) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Waitlist Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage event waitlist and offer spots to waiting attendees
            </p>
          </div>
          <Button
            onClick={handleOfferSpot}
            disabled={waitingList.length === 0 || offerSpotMutation.isPending}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Offer Next Spot
          </Button>
        </div>

        {/* Waiting */}
        <Card>
          <CardHeader>
            <CardTitle>Waiting ({waitingList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {waitingList.length > 0 ? (
              <div className="space-y-3">
                {waitingList.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {entry.position}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {entry.userId?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">User {entry.userId?.slice(0, 8)}</p>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Joined {formatDate(entry.joinedAt)}</span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(entry.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No one waiting
              </p>
            )}
          </CardContent>
        </Card>

        {/* Offered */}
        {offeredList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Offers ({offeredList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {offeredList.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {entry.userId?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">User {entry.userId?.slice(0, 8)}</p>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <span>Offered {formatDate(entry.offeredAt)}</span>
                          {entry.expiresAt && (
                            <span>• Expires {formatDate(entry.expiresAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(entry.status || "offered")}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        {otherList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>History ({otherList.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {otherList.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border rounded-lg opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {entry.userId?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">User {entry.userId?.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.respondedAt && `Responded ${formatDate(entry.respondedAt)}`}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(entry.status || "unknown")}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

