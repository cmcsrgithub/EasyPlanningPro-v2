import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Calendar, DollarSign, Trash2, Edit, QrCode } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

interface PackageFormData {
  title: string;
  description: string;
  price: number;
  eventIds: string[];
}

export default function EventPackages() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const utils = trpc.useUtils();

  const { register, handleSubmit, reset, setValue } = useForm<PackageFormData>();

  const { data: packages = [] } = trpc.packages.list.useQuery();
  const { data: events = [] } = trpc.events.list.useQuery();
  const { data: myPurchases = [] } = trpc.packages.myPurchases.useQuery();

  const createPackage = trpc.packages.create.useMutation({
    onSuccess: () => {
      utils.packages.list.invalidate();
      toast.success("Package created");
      setPackageDialogOpen(false);
      reset();
      setSelectedEvents([]);
    },
  });

  const deletePackage = trpc.packages.delete.useMutation({
    onSuccess: () => {
      utils.packages.list.invalidate();
      toast.success("Package deleted");
    },
  });

  const onSubmitPackage = (data: PackageFormData) => {
    if (selectedEvents.length === 0) {
      toast.error("Please select at least one event");
      return;
    }

    createPackage.mutate({
      title: data.title,
      description: data.description,
      price: data.price,
      eventIds: selectedEvents,
    });
  };

  const handleDeletePackage = (id: string, title: string) => {
    if (confirm(`Delete package "${title}"?`)) {
      deletePackage.mutate({ id });
    }
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Packages</h1>
            <p className="text-muted-foreground mt-1">Multi-event bundles and itineraries</p>
          </div>
          <Dialog open={packageDialogOpen} onOpenChange={setPackageDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Event Package</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitPackage)} className="space-y-4">
                <div>
                  <Label>Package Title *</Label>
                  <Input {...register("title", { required: true })} placeholder="e.g., Weekend Conference Pass" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register("description")} rows={3} />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true, valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Select Events *</Label>
                  <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                    {events.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events available</p>
                    ) : (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                          onClick={() => toggleEventSelection(event.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEventSelection(event.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.startDate ? new Date(event.startDate).toLocaleDateString() : "Date TBD"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedEvents.length} event(s) selected
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setPackageDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Package</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Available Packages */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Packages</h2>
          {packages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No packages available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{pkg.title}</CardTitle>
                        {pkg.description && (
                          <CardDescription className="mt-2">{pkg.description}</CardDescription>
                        )}
                      </div>
                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-2xl font-bold text-primary">
                          ${parseFloat(pkg.price || "0").toFixed(2)}
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => setLocation(`/packages/${pkg.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Purchases */}
        {user && myPurchases.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPurchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardHeader>
                    <CardTitle className="text-base">Package Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount Paid</span>
                      <span className="font-semibold">${parseFloat(purchase.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                        {purchase.status}
                      </Badge>
                    </div>
                    {purchase.qrCode && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <QrCode className="h-4 w-4" />
                          <span className="font-mono text-xs">{purchase.qrCode}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Purchased {purchase.purchasedAt ? new Date(purchase.purchasedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

