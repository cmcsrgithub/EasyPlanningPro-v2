import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormBuilder() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Form Builder</h1>
          <p className="text-muted-foreground mt-2">Build custom registration forms</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Form Builder</CardTitle>
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
