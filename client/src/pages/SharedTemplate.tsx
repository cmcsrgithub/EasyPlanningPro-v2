import { useEffect, useState } from "react";
import { useParams } from "wouter";
import TemplateBuilder from "@/components/TemplateBuilder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getColorScheme, getFontFamily } from "@/lib/colorSchemes";

export default function SharedTemplate() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: customization, isLoading, error } = trpc.templateCustomization.getShared.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Apply customization styles
  const applyCustomStyles = () => {
    if (!customization) return {};

    const colorScheme = customization.colorScheme ? getColorScheme(customization.colorScheme) : null;
    const fontFamily = customization.fontFamily ? getFontFamily(customization.fontFamily) : null;

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

  // Load Google Fonts if needed
  useEffect(() => {
    if (customization?.fontFamily) {
      const fontFamily = getFontFamily(customization.fontFamily);
      if (fontFamily && fontFamily.googleFont) {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.googleFont}&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);

        return () => {
          document.head.removeChild(link);
        };
      }
    }
  }, [customization]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !customization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Template Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This template link may be invalid or has been removed.
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={applyCustomStyles()}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="EasyPlanningPro"
                className="h-8"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <h1 className="text-xl font-semibold">Event Template</h1>
                <p className="text-sm text-muted-foreground">Shared via EasyPlanningPro</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Share"}
              </Button>
              <Button size="sm" onClick={() => window.location.href = "/"}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Create Your Own
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <TemplateBuilder templateId={customization.templateId} isPreview={true} />
      </div>

      {/* Footer */}
      <div className="border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by <strong>EasyPlanningPro</strong>
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Create Your Event Template
          </Button>
        </div>
      </div>
    </div>
  );
}

