import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Mail, Phone, Calendar, Edit, Trash2, ArrowLeft, User } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function MemberDetail() {
  const { user, loading: authLoading } = useAuth();
  const [, params] = useRoute("/directory/:id");
  const [, setLocation] = useLocation();
  const memberId = params?.id || "";

  const { data: member, isLoading } = trpc.members.getById.useQuery(
    { id: memberId },
    { enabled: !!memberId }
  );

  const { data: rsvps } = trpc.rsvps.getByMember.useQuery(
    { memberId },
    { enabled: !!memberId }
  );

  const deleteMutation = trpc.members.delete.useMutation({
    onSuccess: () => {
      toast.success("Member deleted successfully");
      setLocation("/directory");
    },
    onError: (error) => {
      toast.error(`Failed to delete member: ${error.message}`);
    },
  });

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading member...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!member) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground">Member not found</p>
          <Button onClick={() => setLocation("/directory")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
      deleteMutation.mutate({ id: memberId });
    }
  };

  const attendedEvents = rsvps?.filter((r: any) => r.status === "attending").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/directory")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {member.name}
                </h1>
                <p className="text-muted-foreground">Member Profile</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setLocation(`/directory/${memberId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Member Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {member.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-primary hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              )}

              {member.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-primary hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                </div>
              )}

              {member.branch && (
                <div>
                  <p className="font-medium mb-1">Branch</p>
                  <p className="text-muted-foreground">{member.branch}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Events Attended</p>
                <p className="text-2xl font-bold text-primary">{attendedEvents}</p>
              </div>

              {member.createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {member.bio && (
                <div>
                  <p className="font-medium mb-2">Bio</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
                </div>
              )}

              {member.interests && (
                <div>
                  <p className="font-medium mb-2">Interests</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{member.interests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event History ({rsvps?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rsvps && rsvps.length > 0 ? (
              <div className="space-y-3">
                {rsvps.map((rsvp: any) => (
                  <div
                    key={rsvp.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Event #{rsvp.eventId}</p>
                      <p className="text-sm text-muted-foreground">
                        {rsvp.respondedAt
                          ? `Responded: ${new Date(rsvp.respondedAt).toLocaleDateString()}`
                          : "Pending response"}
                      </p>
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
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No event history</h3>
                <p className="text-muted-foreground">
                  This member hasn't been invited to any events yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

