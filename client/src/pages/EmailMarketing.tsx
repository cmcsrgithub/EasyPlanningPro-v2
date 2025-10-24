import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function EmailMarketing() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("all");

  const handleSendCampaign = () => {
    if (!subject || !content) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Campaign sent successfully!");
    setSubject("");
    setContent("");
  };

  const campaigns = [
    { id: 1, name: "Welcome Email", sent: 150, opened: 120, clicked: 45, date: "2025-01-15" },
    { id: 2, name: "Event Reminder", sent: 200, opened: 180, clicked: 90, date: "2025-01-10" },
    { id: 3, name: "Monthly Newsletter", sent: 300, opened: 240, clicked: 100, date: "2025-01-01" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground mt-2">
            Create and send email campaigns to your members
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">Active subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Campaigns Sent
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Open Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Campaign */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="audience">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="active">Active Members</SelectItem>
                  <SelectItem value="event">Event Attendees</SelectItem>
                  <SelectItem value="premium">Premium Members</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                placeholder="Write your email content here..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSendCampaign}>
                <Send className="mr-2 h-4 w-4" />
                Send Campaign
              </Button>
              <Button variant="outline">Save Draft</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent on {new Date(campaign.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{campaign.sent}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{campaign.opened}</p>
                      <p className="text-xs text-muted-foreground">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{campaign.clicked}</p>
                      <p className="text-xs text-muted-foreground">Clicked</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">
                        {Math.round((campaign.opened / campaign.sent) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

