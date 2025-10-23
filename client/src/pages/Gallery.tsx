import { Image, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

export default function Gallery() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Gallery</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your event photos and albums
            </p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Upload Photos
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Image className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Upload photos from your events to create beautiful galleries.
            </p>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Upload Your First Photos
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

