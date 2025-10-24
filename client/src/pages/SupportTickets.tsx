import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Ticket } from "lucide-react";

export default function SupportTickets() {
  const { data: tickets, isLoading } = trpc.tickets.listTickets.useQuery();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "destructive",
      in_progress: "default",
      resolved: "secondary",
      closed: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status.replace("_", " ")}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low: "outline",
      medium: "secondary",
      high: "default",
      urgent: "destructive",
    };
    return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const openTickets = tickets?.filter((t) => t.status === "open" || t.status === "in_progress") || [];
  const closedTickets = tickets?.filter((t) => t.status === "resolved" || t.status === "closed") || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground mt-2">
              Get help and track your support requests
            </p>
          </div>
          <Link href="/tickets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </Link>
        </div>

        {/* Open Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Open Tickets ({openTickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {openTickets.length > 0 ? (
              <div className="space-y-3">
                {openTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <div className="flex gap-2">
                          {getPriorityBadge(ticket.priority || "medium")}
                          {getStatusBadge(ticket.status || "open")}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {ticket.category && (
                          <Badge variant="outline">{ticket.category}</Badge>
                        )}
                        <span>
                          Created {ticket.createdAt && new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Updated {ticket.updatedAt && new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No open tickets
              </p>
            )}
          </CardContent>
        </Card>

        {/* Closed Tickets */}
        {closedTickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Closed Tickets ({closedTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {closedTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer opacity-60">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <div className="flex gap-2">
                          {getPriorityBadge(ticket.priority || "medium")}
                          {getStatusBadge(ticket.status || "closed")}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {ticket.category && (
                          <Badge variant="outline">{ticket.category}</Badge>
                        )}
                        {ticket.resolvedAt && (
                          <span>
                            Resolved {new Date(ticket.resolvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {tickets && tickets.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tickets Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Need help? Create a support ticket and we'll assist you
              </p>
              <Link href="/tickets/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Ticket
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

