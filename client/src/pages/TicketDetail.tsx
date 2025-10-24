import { useParams } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

export default function TicketDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();

  const { data: tickets } = trpc.tickets.listTickets.useQuery();
  const ticket = tickets?.find(t => t.id === id);
  const isLoading = false;

  const updateStatusMutation = trpc.tickets.updateTicket.useMutation({
    onSuccess: () => {
      toast.success("Ticket status updated");
      utils.tickets.listTickets.invalidate();
    },
  });

  const handleAddComment = () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    toast.success("Comment added");
    setComment("");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground">This ticket doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "default";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Ticket Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-semibold tracking-tight">{ticket.subject}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(ticket.priority || "low")}>
                {ticket.priority || "low"}
              </Badge>
              <Badge variant={getStatusColor(ticket.status || "open")}>
                {(ticket.status || "open").replace("_", " ")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                Created {ticket.createdAt && new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {ticket.description}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Update Status</h3>
                <Select
                  value={ticket.status || "open"}
                  onValueChange={(value) =>
                    updateStatusMutation.mutate({ id: ticket.id, status: value as "open" | "in_progress" | "resolved" | "closed" })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Comments</h2>

          {/* Add Comment Form */}
          <Card>
            <CardContent className="p-6">
              <Textarea
                placeholder="Add a comment..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleAddComment}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </CardContent>
          </Card>

          {/* Comments List - Placeholder */}
          <p className="text-center text-muted-foreground py-8">
            No comments yet.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

