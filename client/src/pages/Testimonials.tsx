import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-2">
            Testimonials page content
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
