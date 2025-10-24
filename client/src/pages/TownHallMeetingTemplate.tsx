import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function TownHallMeetingTemplate() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Town Hall Meeting</h1>
          <p className="text-muted-foreground mt-2">Community town hall template</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Use This Template</CardTitle>
            <CardDescription>Create a new event using this Town Hall Meeting template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This template includes pre-configured settings, checklists, and workflows optimized for Town Hall Meeting events.
            </p>
            <Button onClick={() => navigate("/events/create?template=TownHallMeetingTemplate")}>
              Create Event from Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
