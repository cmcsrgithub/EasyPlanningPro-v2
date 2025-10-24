import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhiteLabel() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">White Label</h1>
          <p className="text-muted-foreground mt-2">White label branding</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>White Label</CardTitle>
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
