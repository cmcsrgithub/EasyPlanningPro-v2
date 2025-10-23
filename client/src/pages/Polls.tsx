import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { BarChart3, Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Polls() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: polls, isLoading, refetch } = trpc.polls.list.useQuery();

  const deleteMutation = trpc.polls.delete.useMutation({
    onSuccess: () => {
      toast.success("Poll deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete poll: ${error.message}`);
    },
  });

  const toggleMutation = trpc.polls.toggleActive.useMutation({
    onSuccess: () => {
      toast.success("Poll status updated");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update poll: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this poll?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggle = (id: number, isActive: boolean) => {
    toggleMutation.mutate({ id, isActive: !isActive });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Polls & Surveys</h1>
            <p className="text-muted-foreground">Create and manage polls for your events</p>
          </div>
          <Button onClick={() => setLocation("/polls/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Poll
          </Button>
        </div>

        {/* Polls List */}
        {polls && polls.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <Card key={poll.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{poll.title}</CardTitle>
                      {poll.description && (
                        <CardDescription className="mt-1">{poll.description}</CardDescription>
                      )}
                    </div>
                    <Badge variant={poll.isActive ? "default" : "secondary"}>
                      {poll.isActive ? "Active" : "Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>
                      Created {new Date(poll.createdAt!).toLocaleDateString()}
                    </span>
                  </div>

                  {poll.closesAt && (
                    <div className="text-sm text-muted-foreground">
                      Closes: {new Date(poll.closesAt).toLocaleDateString()}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setLocation(`/polls/${poll.id}`)}
                    >
                      View Results
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(poll.id, poll.isActive!)}
                      disabled={toggleMutation.isPending}
                    >
                      {poll.isActive ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(poll.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No polls yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Create your first poll to gather feedback and opinions from your event attendees
              </p>
              <Button onClick={() => setLocation("/polls/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Poll
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

