import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ContentCreatorMeetupTemplate() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Creator Meetup</h1>
          <p className="text-muted-foreground mt-2">Content creator meetup template</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Use This Template</CardTitle>
            <CardDescription>Create a new event using this Creator Meetup template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This template includes pre-configured settings, checklists, and workflows optimized for Creator Meetup events.
            </p>
            <Button onClick={() => navigate("/events/create?template=ContentCreatorMeetupTemplate")}>
              Create Event from Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
