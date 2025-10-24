import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function Affiliates() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Affiliates</h1>
          <p className="text-muted-foreground mt-2">
            Affiliates page content
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              This page is under development. Content coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
