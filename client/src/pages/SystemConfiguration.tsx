import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Mail,
  Shield,
  Database,
  Zap,
  Bell,
  DollarSign,
  Globe,
  Save,
} from "lucide-react";

export default function SystemConfiguration() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "EasyPlanningPro",
    siteDescription: "Professional event planning platform",
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Email Settings
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@easyplanningpro.com",
    smtpPassword: "••••••••",
    
    // Security Settings
    sessionTimeout: "24",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    requireEmailVerification: true,
    enable2FA: false,
    
    // Database Settings
    backupFrequency: "daily",
    backupRetention: "30",
    autoOptimize: true,
    
    // Performance Settings
    cacheEnabled: true,
    cacheTimeout: "3600",
    compressionEnabled: true,
    cdnEnabled: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    
    // Payment Settings
    stripePublicKey: "pk_test_••••••••",
    stripeSecretKey: "sk_test_••••••••",
    paymentCurrency: "USD",
    taxRate: "0",
    
    // API Settings
    apiRateLimit: "1000",
    apiTimeout: "30",
    webhookSecret: "whsec_••••••••",
  });

  const handleSaveSettings = (category: string) => {
    // TODO: Call API to save settings
    // Submit settings to API
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage global system settings and configurations
          </p>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="payment">
              <DollarSign className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="api">
              <Globe className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable site access for maintenance
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => handleChange("registrationEnabled", checked)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("general")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Provider</Label>
                  <Select value={settings.emailProvider} onValueChange={(value) => handleChange("emailProvider", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => handleChange("smtpHost", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => handleChange("smtpPort", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange("smtpUser", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleChange("smtpPassword", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("email")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleChange("maxLoginAttempts", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Password Minimum Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleChange("passwordMinLength", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must verify email before accessing platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleChange("requireEmailVerification", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable2FA}
                    onCheckedChange={(checked) => handleChange("enable2FA", checked)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("security")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>Configure database backup and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => handleChange("backupFrequency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    value={settings.backupRetention}
                    onChange={(e) => handleChange("backupRetention", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Optimize Database</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically optimize database tables
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoOptimize}
                    onCheckedChange={(checked) => handleChange("autoOptimize", checked)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("database")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Database Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>Configure caching and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Caching</Label>
                    <p className="text-sm text-muted-foreground">
                      Cache frequently accessed data
                    </p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => handleChange("cacheEnabled", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                  <Input
                    id="cacheTimeout"
                    type="number"
                    value={settings.cacheTimeout}
                    onChange={(e) => handleChange("cacheTimeout", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Compression</Label>
                    <p className="text-sm text-muted-foreground">
                      Compress responses to reduce bandwidth
                    </p>
                  </div>
                  <Switch
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => handleChange("compressionEnabled", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable CDN</Label>
                    <p className="text-sm text-muted-foreground">
                      Use CDN for static assets
                    </p>
                  </div>
                  <Switch
                    checked={settings.cdnEnabled}
                    onCheckedChange={(checked) => handleChange("cdnEnabled", checked)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("performance")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Performance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleChange("smsNotifications", checked)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("notifications")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                  <Input
                    id="stripePublicKey"
                    value={settings.stripePublicKey}
                    onChange={(e) => handleChange("stripePublicKey", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                  <Input
                    id="stripeSecretKey"
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => handleChange("stripeSecretKey", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentCurrency">Payment Currency</Label>
                  <Select value={settings.paymentCurrency} onValueChange={(value) => handleChange("paymentCurrency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleChange("taxRate", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("payment")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>Configure API rate limiting and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => handleChange("apiRateLimit", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                  <Input
                    id="apiTimeout"
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => handleChange("apiTimeout", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={settings.webhookSecret}
                    onChange={(e) => handleChange("webhookSecret", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSaveSettings("api")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

