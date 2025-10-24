import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{user?.name || "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                          placeholder="City, State"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="pl-10"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joined">Member Since</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="joined"
                          value={new Date().toLocaleDateString()}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your events
                      </p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive news and updates about EasyPlanningPro
                      </p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming events
                      </p>
                    </div>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>

                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

