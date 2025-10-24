import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LodgingTravel() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Lodging & Travel</h1>
          <p className="text-muted-foreground mt-2">Manage lodging and travel</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lodging & Travel</CardTitle>
            <CardDescription>Feature under development</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Full functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
