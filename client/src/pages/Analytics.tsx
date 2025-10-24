import { useParams } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, DollarSign, Calendar, TrendingUp, Award, Heart } from "lucide-react";

const COLORS = ["#00AEEF", "#FF8042", "#00C49F", "#FFBB28", "#8884D8"];

export default function Analytics() {
  const params = useParams();
  const eventId = params.eventId as string;

  const { data: event } = trpc.events.get.useQuery({ id: eventId });
  const { data: rsvps = [] } = trpc.rsvps.getByEvent.useQuery({ eventId });
  const { data: expenses = [] } = trpc.financial.listExpenses.useQuery({ eventId });
  const { data: donations = [] } = trpc.donations.list.useQuery({ eventId });
  const { data: sponsors = [] } = trpc.sponsors.list.useQuery({ eventId });
  const { data: donationStats } = trpc.donations.getStats.useQuery({ eventId });

  // RSVP Status Distribution
  const rsvpData = [
    { name: "Yes", value: rsvps.filter((r) => r.status === "yes").length },
    { name: "No", value: rsvps.filter((r) => r.status === "no").length },
    { name: "Maybe", value: rsvps.filter((r) => r.status === "maybe").length },
  ];

  // Expense by Category
  const expenseByCategory = expenses.reduce((acc: any, exp) => {
    const category = exp.category || "Other";
    acc[category] = (acc[category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const expenseData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    amount: value,
  }));

  // Donations Over Time (simplified - by month)
  const donationsByMonth = donations.reduce((acc: any, don) => {
    if (!don.donatedAt) return acc;
    const month = new Date(don.donatedAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + parseFloat(don.amount);
    return acc;
  }, {});

  const donationTimeData = Object.entries(donationsByMonth).map(([month, amount]) => ({
    month,
    amount,
  }));

  // Sponsor Contributions by Tier
  const sponsorByTier = sponsors.reduce((acc: any, sponsor) => {
    const tier = sponsor.tier || "bronze";
    acc[tier] = (acc[tier] || 0) + (sponsor.contributionAmount ? parseFloat(sponsor.contributionAmount) : 0);
    return acc;
  }, {});

  const sponsorData = Object.entries(sponsorByTier).map(([tier, amount]) => ({
    tier: tier.charAt(0).toUpperCase() + tier.slice(1),
    amount,
  }));

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const totalDonations = donationStats?.totalAmount || 0;
  const totalSponsors = sponsors.reduce(
    (sum, s) => sum + (s.contributionAmount ? parseFloat(s.contributionAmount) : 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights and data visualization</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rsvps.length}</div>
              <p className="text-xs text-muted-foreground">
                {rsvps.filter((r) => r.status === "yes").length} attending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDonations.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{donationStats?.donorCount || 0} donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sponsor Revenue</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSponsors.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{sponsors.length} sponsors</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="rsvps" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          </TabsList>

          {/* RSVP Analytics */}
          <TabsContent value="rsvps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Status Distribution</CardTitle>
                <CardDescription>Breakdown of attendee responses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rsvpData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rsvpData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Analytics */}
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Spending breakdown across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#00AEEF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donation Analytics */}
          <TabsContent value="donations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donations Over Time</CardTitle>
                <CardDescription>Fundraising trends by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={donationTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsor Analytics */}
          <TabsContent value="sponsors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sponsor Contributions by Tier</CardTitle>
                <CardDescription>Revenue breakdown by sponsorship level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sponsorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tier" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

