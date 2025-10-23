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

export default function EventForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/events/:id");
  const isEdit = params?.id && params.id !== "new";

  const { data: event } = trpc.events.get.useQuery(
    { id: params?.id || "" },
    { enabled: !!isEdit }
  );

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    eventType: event?.eventType || "",
    startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
    endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    maxAttendees: event?.maxAttendees || "",
    isPublic: event?.isPublic ?? true,
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Event created successfully!");
      utils.events.list.invalidate();
      setLocation("/events");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Event updated successfully!");
      utils.events.list.invalidate();
      setLocation("/events");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update event");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      description: formData.description || undefined,
      eventType: formData.eventType || undefined,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      location: formData.location || undefined,
      maxAttendees: formData.maxAttendees ? Number(formData.maxAttendees) : undefined,
      isPublic: formData.isPublic,
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
            onClick={() => setLocation("/events")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <h1 className="text-4xl font-semibold tracking-tight">
            {isEdit ? "Edit Event" : "Create Event"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit ? "Update event details" : "Add a new event to your calendar"}
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input
                    id="eventType"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    placeholder="e.g., Reunion, Meeting"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    placeholder="Optional"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Event location or venue"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  Make this event public
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
                    ? "Update Event"
                    : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/events")}
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

