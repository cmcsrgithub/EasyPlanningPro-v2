import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Copy, Star } from "lucide-react";
import { toast } from "sonner";

export default function TemplateDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: template, isLoading } = trpc.templates.getById.useQuery({ id: id! });

  const handleUseTemplate = () => {
    toast.success("Event created from template!");
    setLocation("/events");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Template Not Found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">{template.name}</h1>
            <p className="text-muted-foreground mt-2">{template.description}</p>
          </div>
          <Button onClick={handleUseTemplate}>
            <Copy className="mr-2 h-4 w-4" />
            Use Template
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant={template.isPublic ? "default" : "secondary"}>
            {template.isPublic ? "Public" : "Private"}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>{template.usageCount || 0} uses</span>
          </div>

        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Template Details</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">Category:</span>
                <p className="text-muted-foreground">{template.category || "General"}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-muted-foreground">
                  {template.createdAt && new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

