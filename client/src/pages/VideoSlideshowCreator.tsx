import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoSlideshowCreator() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Video Slideshow Creator</h1>
          <p className="text-muted-foreground mt-2">Create video slideshows</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Video Slideshow Creator</CardTitle>
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
