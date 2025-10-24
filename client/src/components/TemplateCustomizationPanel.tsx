import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { colorSchemes, fontFamilies, type ColorScheme } from "@/lib/colorSchemes";
import { Check, Crown, Copy, Share2, Palette, Type } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface TemplateCustomizationPanelProps {
  templateId: string;
  currentCustomization?: {
    colorScheme: string;
    fontFamily: string;
    customBackgroundColor?: string;
    customFontColor?: string;
    customAccentColor?: string;
    shareableSlug?: string;
  };
  onSave: (customization: any) => void;
}

export default function TemplateCustomizationPanel({
  templateId,
  currentCustomization,
  onSave,
}: TemplateCustomizationPanelProps) {
  const { user } = useAuth();
  
  const showToast = (title: string, description: string) => {
    // Simple alert for now - can be enhanced with a toast library
    alert(`${title}: ${description}`);
  };
  const isPaidUser = user?.subscriptionTier && ["premium", "pro", "business", "enterprise"].includes(user.subscriptionTier);

  const [selectedColorScheme, setSelectedColorScheme] = useState(currentCustomization?.colorScheme || "default");
  const [selectedFont, setSelectedFont] = useState(currentCustomization?.fontFamily || "inter");
  const [customBgColor, setCustomBgColor] = useState(currentCustomization?.customBackgroundColor || "#ffffff");
  const [customTextColor, setCustomTextColor] = useState(currentCustomization?.customFontColor || "#1f2937");
  const [customAccentColor, setCustomAccentColor] = useState(currentCustomization?.customAccentColor || "#3b82f6");
  const [shareableSlug, setShareableSlug] = useState(currentCustomization?.shareableSlug || "");

  const handleSave = () => {
    const customization = {
      colorScheme: selectedColorScheme,
      fontFamily: selectedFont,
      ...(isPaidUser && {
        customBackgroundColor: customBgColor,
        customFontColor: customTextColor,
        customAccentColor: customAccentColor,
      }),
      shareableSlug: shareableSlug || generateSlug(),
    };

    onSave(customization);
    showToast("Customization Saved", "Your template customization has been saved successfully.");
  };

  const generateSlug = () => {
    return `${templateId}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const copyShareableLink = () => {
    const slug = shareableSlug || generateSlug();
    const link = `${window.location.origin}/shared/${slug}`;
    navigator.clipboard.writeText(link);
    showToast("Link Copied", "Shareable link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Color Schemes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Color Scheme</CardTitle>
          </div>
          <CardDescription>Choose a predefined color palette for your template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedColorScheme(scheme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedColorScheme === scheme.id
                    ? "border-primary shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {selectedColorScheme === scheme.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="flex gap-1 mb-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: scheme.secondary }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: scheme.accent }}
                  />
                </div>
                <p className="font-medium text-sm">{scheme.name}</p>
                <p className="text-xs text-muted-foreground">{scheme.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            <CardTitle>Font Family</CardTitle>
          </div>
          <CardDescription>Select a font style for your template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fontFamilies.map((font) => (
              <button
                key={font.id}
                onClick={() => setSelectedFont(font.id)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                  selectedFont === font.id
                    ? "border-primary shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ fontFamily: font.fontFamily }}
              >
                {selectedFont === font.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <p className="font-semibold text-lg mb-1">{font.name}</p>
                <p className="text-sm text-muted-foreground">{font.description}</p>
                <p className="text-xs mt-2" style={{ fontFamily: font.fontFamily }}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Customization (Paid Users Only) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <CardTitle>Advanced Customization</CardTitle>
            </div>
            {!isPaidUser && (
              <Badge variant="secondary">Premium Feature</Badge>
            )}
          </div>
          <CardDescription>
            {isPaidUser
              ? "Customize colors exactly to your brand"
              : "Upgrade to premium to unlock custom color selection"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    disabled={!isPaidUser}
                    className="h-10 w-20"
                  />
                  <Input
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    disabled={!isPaidUser}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    disabled={!isPaidUser}
                    className="h-10 w-20"
                  />
                  <Input
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    disabled={!isPaidUser}
                    placeholder="#1f2937"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={customAccentColor}
                    onChange={(e) => setCustomAccentColor(e.target.value)}
                    disabled={!isPaidUser}
                    className="h-10 w-20"
                  />
                  <Input
                    value={customAccentColor}
                    onChange={(e) => setCustomAccentColor(e.target.value)}
                    disabled={!isPaidUser}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>

            {!isPaidUser && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to premium to unlock:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Custom background colors</li>
                  <li>• Custom text colors</li>
                  <li>• Custom accent colors</li>
                  <li>• Full brand customization</li>
                </ul>
                <Button className="mt-4" size="sm">
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shareable Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            <CardTitle>Shareable Link</CardTitle>
          </div>
          <CardDescription>Generate a link to share this template with attendees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="slug">Custom Slug (Optional)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="slug"
                  value={shareableSlug}
                  onChange={(e) => setShareableSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-event-2024"
                />
                <Button onClick={copyShareableLink} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {window.location.origin}/shared/{shareableSlug || generateSlug()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Customization
        </Button>
      </div>
    </div>
  );
}

