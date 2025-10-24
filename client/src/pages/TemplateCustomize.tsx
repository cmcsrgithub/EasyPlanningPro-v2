import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import TemplateBuilder from "@/components/TemplateBuilder";
import TemplateCustomizationPanel from "@/components/TemplateCustomizationPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Eye, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getColorScheme, getFontFamily } from "@/lib/colorSchemes";

export default function TemplateCustomize() {
  const params = useParams<{ templateId: string }>();
  const [, setLocation] = useLocation();
  const templateId = params.templateId || "";

  const [activeTab, setActiveTab] = useState("preview");
  const [customization, setCustomization] = useState<any>(null);

  // Fetch existing customization
  const { data: existingCustomization, refetch } = trpc.templateCustomization.get.useQuery(
    { templateId },
    { enabled: !!templateId }
  );

  const saveCustomizationMutation = trpc.templateCustomization.save.useMutation();

  useEffect(() => {
    if (existingCustomization) {
      setCustomization(existingCustomization);
    }
  }, [existingCustomization]);

  const handleSaveCustomization = async (newCustomization: any) => {
    try {
      await saveCustomizationMutation.mutateAsync({
        templateId,
        ...newCustomization,
      });
      setCustomization(newCustomization);
      refetch();
    } catch (error) {
      console.error("Error saving customization:", error);
      alert("Failed to save customization");
    }
  };

  // Apply customization styles
  const applyCustomStyles = () => {
    if (!customization) return {};

    const colorScheme = getColorScheme(customization.colorScheme);
    const fontFamily = getFontFamily(customization.fontFamily);

    const styles: any = {};

    // Apply font family
    if (fontFamily) {
      styles.fontFamily = fontFamily.fontFamily;
    }

    // For paid users, apply custom colors
    if (customization.customBackgroundColor) {
      styles.backgroundColor = customization.customBackgroundColor;
    } else if (colorScheme) {
      styles.backgroundColor = colorScheme.background;
    }

    if (customization.customFontColor) {
      styles.color = customization.customFontColor;
    } else if (colorScheme) {
      styles.color = colorScheme.text;
    }

    return styles;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/templates/gallery")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Customize Template</h1>
              <p className="text-muted-foreground">
                Personalize your template with colors, fonts, and share it with attendees
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="customize">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <Card className="p-6" style={applyCustomStyles()}>
              <TemplateBuilder templateId={templateId} isPreview={true} />
            </Card>
          </TabsContent>

          <TabsContent value="customize" className="mt-6">
            <TemplateCustomizationPanel
              templateId={templateId}
              currentCustomization={customization}
              onSave={handleSaveCustomization}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

