import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Palette, Globe, Image as ImageIcon, Save, Check, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface BrandingFormData {
  subdomain: string;
  customDomain: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  brandName: string;
  tagline: string;
  customCss: string;
  isWhiteLabel: boolean;
}

export default function Branding() {
  const { user } = useAuth();
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const utils = trpc.useUtils();

  const { register, handleSubmit, setValue, watch } = useForm<BrandingFormData>();

  const { data: brandingSettings, isLoading } = trpc.branding.get.useQuery();

  const upsertBranding = trpc.branding.upsert.useMutation({
    onSuccess: () => {
      utils.branding.get.invalidate();
      toast.success("Branding settings saved");
    },
  });

  const checkSubdomain = trpc.branding.checkSubdomain.useQuery(
    { subdomain: watch("subdomain") || "" },
    { enabled: false }
  );

  // Load existing settings
  useEffect(() => {
    if (brandingSettings) {
      setValue("subdomain", brandingSettings.subdomain || "");
      setValue("customDomain", brandingSettings.customDomain || "");
      setValue("logoUrl", brandingSettings.logoUrl || "");
      setValue("faviconUrl", brandingSettings.faviconUrl || "");
      setValue("primaryColor", brandingSettings.primaryColor || "#00AEEF");
      setValue("secondaryColor", brandingSettings.secondaryColor || "");
      setValue("brandName", brandingSettings.brandName || "");
      setValue("tagline", brandingSettings.tagline || "");
      setValue("customCss", brandingSettings.customCss || "");
      setValue("isWhiteLabel", brandingSettings.isWhiteLabel || false);
    }
  }, [brandingSettings, setValue]);

  const handleCheckSubdomain = async () => {
    const subdomain = watch("subdomain");
    if (!subdomain) {
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);
    const result = await checkSubdomain.refetch();
    setSubdomainAvailable(result.data?.available || false);
    setCheckingSubdomain(false);
  };

  const onSubmit = (data: BrandingFormData) => {
    upsertBranding.mutate({
      subdomain: data.subdomain || undefined,
      customDomain: data.customDomain || undefined,
      logoUrl: data.logoUrl || undefined,
      faviconUrl: data.faviconUrl || undefined,
      primaryColor: data.primaryColor || undefined,
      secondaryColor: data.secondaryColor || undefined,
      brandName: data.brandName || undefined,
      tagline: data.tagline || undefined,
      customCss: data.customCss || undefined,
      isWhiteLabel: data.isWhiteLabel,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Branding & White Label</h1>
          <p className="text-muted-foreground mt-1">Customize your subdomain and brand appearance</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subdomain Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Subdomain Configuration</CardTitle>
              </div>
              <CardDescription>
                Set up your custom subdomain (e.g., yourname.easyplanningpro.com)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Subdomain</Label>
                <div className="flex gap-2">
                  <Input
                    {...register("subdomain")}
                    placeholder="yourname"
                    onChange={() => setSubdomainAvailable(null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckSubdomain}
                    disabled={checkingSubdomain}
                  >
                    Check
                  </Button>
                </div>
                {subdomainAvailable !== null && (
                  <div className="flex items-center gap-2 mt-2">
                    {subdomainAvailable ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Available</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Not available</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label>Custom Domain (Optional)</Label>
                <Input {...register("customDomain")} placeholder="events.yourcompany.com" />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support to configure DNS settings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Brand Identity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <CardTitle>Brand Identity</CardTitle>
              </div>
              <CardDescription>Customize your logo and brand name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Brand Name</Label>
                <Input {...register("brandName")} placeholder="Your Company Name" />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input {...register("tagline")} placeholder="Your company tagline" />
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input {...register("logoUrl")} placeholder="https://example.com/logo.png" />
              </div>
              <div>
                <Label>Favicon URL</Label>
                <Input {...register("faviconUrl")} placeholder="https://example.com/favicon.ico" />
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Color Scheme</CardTitle>
              </div>
              <CardDescription>Customize your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" {...register("primaryColor")} className="w-20" />
                    <Input {...register("primaryColor")} placeholder="#00AEEF" />
                  </div>
                </div>
                <div>
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" {...register("secondaryColor")} className="w-20" />
                    <Input {...register("secondaryColor")} placeholder="#FF8042" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Custom CSS and white-label mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Custom CSS</Label>
                <Textarea
                  {...register("customCss")}
                  rows={6}
                  placeholder="/* Add your custom CSS here */"
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isWhiteLabel")} id="isWhiteLabel" />
                <Label htmlFor="isWhiteLabel">Enable White Label Mode</Label>
                <Badge variant="outline">Pro Feature</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                White label mode removes all EasyPlanningPro branding from your pages
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={upsertBranding.isPending}>
              <Save className="mr-2 h-4 w-4" />
              Save Branding Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

