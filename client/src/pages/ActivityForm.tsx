import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ActivityForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const isEditing = !!id;

  const { data: activity } = trpc.activities.getById.useQuery(
    { id: id || "" },
    { enabled: isEditing }
  );

  const { data: events } = trpc.events.list.useQuery();
  const { data: venues} = trpc.venues.list.useQuery();

  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    description: "",
    activityType: "",
    startTime: "",
    endTime: "",
    venueId: "",
    location: "",
    capacity: "",
    registrationRequired: false,
    registrationDeadline: "",
    price: "0",
    organizerName: "",
    materials: "",
    equipment: "",
    notes: "",
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        eventId: activity.eventId || "",
        title: activity.title || "",
        description: activity.description || "",
        activityType: activity.activityType || "",
        startTime: activity.startTime
          ? new Date(activity.startTime).toISOString().slice(0, 16)
          : "",
        endTime: activity.endTime
          ? new Date(activity.endTime).toISOString().slice(0, 16)
          : "",
        venueId: activity.venueId || "",
        location: activity.location || "",
        capacity: activity.capacity?.toString() || "",
        registrationRequired: activity.registrationRequired || false,
        registrationDeadline: activity.registrationDeadline
          ? new Date(activity.registrationDeadline).toISOString().slice(0, 16)
          : "",
        price: activity.price || "0",
        organizerName: activity.organizerName || "",
        materials: activity.materials || "",
        equipment: activity.equipment || "",
        notes: activity.notes || "",
      });
    }
  }, [activity]);

  const createMutation = trpc.activities.create.useMutation({
    onSuccess: () => {
      toast.success("Activity created successfully!");
      setLocation("/activities");
    },
    onError: () => {
      toast.error("Failed to create activity");
    },
  });

  const updateMutation = trpc.activities.update.useMutation({
    onSuccess: () => {
      toast.success("Activity updated successfully!");
      setLocation(`/activities/${id}`);
    },
    onError: () => {
      toast.error("Failed to update activity");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = {
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      registrationDeadline: formData.registrationDeadline
        ? new Date(formData.registrationDeadline)
        : undefined,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    };

    if (isEditing) {
      updateMutation.mutate({ id: id!, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            {isEditing ? "Edit Activity" : "Create Activity"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing
              ? "Update activity details"
              : "Create a new activity or session for your event"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Activity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Selection */}
              <div className="space-y-2">
                <Label htmlFor="eventId">Event *</Label>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, eventId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events?.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Activity Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Morning Yoga Session"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the activity..."
                  rows={4}
                />
              </div>

              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select
                  value={formData.activityType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, activityType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="session">Session</SelectItem>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="meal">Meal</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="venueId">Venue (Optional)</Label>
                <Select
                  value={formData.venueId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, venueId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues?.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location Details</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Room 101, Main Building"
                />
              </div>

              {/* Capacity and Registration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Max attendees"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                  />
                </div>
              </div>

              {/* Registration Settings */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  name="registrationRequired"
                  checked={formData.registrationRequired}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="registrationRequired" className="cursor-pointer">
                  Registration Required
                </Label>
              </div>

              {formData.registrationRequired && (
                <div className="space-y-2">
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    id="registrationDeadline"
                    name="registrationDeadline"
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Organizer */}
              <div className="space-y-2">
                <Label htmlFor="organizerName">Organizer Name</Label>
                <Input
                  id="organizerName"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleChange}
                  placeholder="Who's organizing this activity?"
                />
              </div>

              {/* Materials and Equipment */}
              <div className="space-y-2">
                <Label htmlFor="materials">Required Materials</Label>
                <Textarea
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  placeholder="What should attendees bring?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Provided</Label>
                <Textarea
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  placeholder="What equipment will be provided?"
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isEditing
                    ? "Update Activity"
                    : "Create Activity"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation(isEditing ? `/activities/${id}` : "/activities")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}

