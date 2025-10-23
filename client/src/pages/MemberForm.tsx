import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function MemberForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/directory/:id");
  const isEdit = params?.id && params.id !== "new";

  const { data: member } = trpc.members.get.useQuery(
    { id: params?.id || "" },
    { enabled: !!isEdit }
  );

  const [formData, setFormData] = useState({
    name: member?.name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    branch: member?.branch || "",
    interests: member?.interests || "",
    bio: member?.bio || "",
    isAdmin: member?.isAdmin ?? false,
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.members.create.useMutation({
    onSuccess: () => {
      toast.success("Member added successfully!");
      utils.members.list.invalidate();
      setLocation("/directory");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add member");
    },
  });

  const updateMutation = trpc.members.update.useMutation({
    onSuccess: () => {
      toast.success("Member updated successfully!");
      utils.members.list.invalidate();
      setLocation("/directory");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update member");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      branch: formData.branch || undefined,
      interests: formData.interests || undefined,
      bio: formData.bio || undefined,
      isAdmin: formData.isAdmin,
    };

    if (isEdit && params?.id) {
      updateMutation.mutate({ id: params.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setLocation("/directory")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>
          <h1 className="text-4xl font-semibold tracking-tight">
            {isEdit ? "Edit Member" : "Add Member"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? "Update member details" : "Add a new member to your directory"}
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter member name"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch/Chapter</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g., West Coast"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Interests</Label>
                  <Input
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="e.g., Golf, Photography"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief bio or notes about this member"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isAdmin" className="cursor-pointer">
                  Administrator privileges
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isEdit
                    ? "Update Member"
                    : "Add Member"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/directory")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

