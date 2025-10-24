import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AffiliateAdmin() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Affiliate Administration</h1>
          <p className="text-muted-foreground mt-2">Manage affiliate program</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Administration</CardTitle>
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
