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

export default function VenueForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/venues/:id");
  const isEdit = params?.id && params.id !== "new";

  const { data: venue } = trpc.venues.get.useQuery(
    { id: params?.id || "" },
    { enabled: !!isEdit }
  );

  const [formData, setFormData] = useState({
    name: venue?.name || "",
    address: venue?.address || "",
    city: venue?.city || "",
    state: venue?.state || "",
    zipCode: venue?.zipCode || "",
    capacity: venue?.capacity || "",
    description: venue?.description || "",
    amenities: venue?.amenities || "",
    contactName: venue?.contactName || "",
    contactEmail: venue?.contactEmail || "",
    contactPhone: venue?.contactPhone || "",
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.venues.create.useMutation({
    onSuccess: () => {
      toast.success("Venue created successfully!");
      utils.venues.list.invalidate();
      setLocation("/venues");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create venue");
    },
  });

  const updateMutation = trpc.venues.update.useMutation({
    onSuccess: () => {
      toast.success("Venue updated successfully!");
      utils.venues.list.invalidate();
      setLocation("/venues");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update venue");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zipCode: formData.zipCode || undefined,
      capacity: formData.capacity ? Number(formData.capacity) : undefined,
      description: formData.description || undefined,
      amenities: formData.amenities || undefined,
      contactName: formData.contactName || undefined,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
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
            onClick={() => setLocation("/venues")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Button>
          <h1 className="text-4xl font-semibold tracking-tight">
            {isEdit ? "Edit Venue" : "Add Venue"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? "Update venue details" : "Add a new venue to your list"}
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Venue Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter venue name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the venue"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="Zip"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Max capacity"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Input
                    id="amenities"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="e.g., WiFi, Parking"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Contact person"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
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
                    ? "Update Venue"
                    : "Add Venue"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/venues")}
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

