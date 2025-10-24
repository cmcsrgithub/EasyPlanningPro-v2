import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, TrendingUp, Activity, Ticket } from "lucide-react";

export default function AdminDashboard() {
  const { data: events } = trpc.events.list.useQuery();
  const { data: members } = trpc.members.list.useQuery();
  const { data: activities } = trpc.activities.list.useQuery();
  const { data: tickets } = trpc.tickets.listTickets.useQuery();

  const stats = [
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: Calendar,
      description: "Active events",
      trend: "+12% from last month",
    },
    {
      title: "Total Members",
      value: members?.length || 0,
      icon: Users,
      description: "Registered members",
      trend: "+8% from last month",
    },
    {
      title: "Activities",
      value: activities?.length || 0,
      icon: Activity,
      description: "Scheduled activities",
      trend: "+15% from last month",
    },
    {
      title: "Open Tickets",
      value: tickets?.filter((t) => t.status === "open" || t.status === "in_progress").length || 0,
      icon: Ticket,
      description: "Support tickets",
      trend: "-5% from last month",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of platform activity and key metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events?.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.startDate &&
                          new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {event.eventType}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members?.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {member.createdAt &&
                        new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

