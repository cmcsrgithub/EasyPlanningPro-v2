import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ComedyShowTemplate() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Comedy Show</h1>
          <p className="text-muted-foreground mt-2">Comedy show and entertainment template</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Use This Template</CardTitle>
            <CardDescription>Create a new event using this Comedy Show template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This template includes pre-configured settings, checklists, and workflows optimized for Comedy Show events.
            </p>
            <Button onClick={() => navigate("/events/create?template=ComedyShowTemplate")}>
              Create Event from Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
