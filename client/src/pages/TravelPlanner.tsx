import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plane, Hotel, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TravelPlanner() {
  const [travelDialogOpen, setTravelDialogOpen] = useState(false);
  const [accommodationDialogOpen, setAccommodationDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: myTravel } = trpc.travel.getMyTravel.useQuery();
  const { data: myAccommodations } = trpc.travel.getMyAccommodations.useQuery();
  const { data: events } = trpc.events.list.useQuery();

  const createTravelMutation = trpc.travel.createTravel.useMutation({
    onSuccess: () => {
      toast.success("Travel arrangement added");
      utils.travel.getMyTravel.invalidate();
      setTravelDialogOpen(false);
    },
  });

  const deleteTravelMutation = trpc.travel.deleteTravel.useMutation({
    onSuccess: () => {
      toast.success("Travel arrangement deleted");
      utils.travel.getMyTravel.invalidate();
    },
  });

  const createAccommodationMutation = trpc.travel.createAccommodation.useMutation({
    onSuccess: () => {
      toast.success("Accommodation added");
      utils.travel.getMyAccommodations.invalidate();
      setAccommodationDialogOpen(false);
    },
  });

  const deleteAccommodationMutation = trpc.travel.deleteAccommodation.useMutation({
    onSuccess: () => {
      toast.success("Accommodation deleted");
      utils.travel.getMyAccommodations.invalidate();
    },
  });

  const handleTravelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createTravelMutation.mutate({
      eventId: formData.get("eventId") as string,
      travelType: formData.get("travelType") as any,
      departureLocation: formData.get("departureLocation") as string,
      arrivalLocation: formData.get("arrivalLocation") as string,
      carrier: formData.get("carrier") as string,
      confirmationNumber: formData.get("confirmationNumber") as string,
      cost: formData.get("cost") as string,
      notes: formData.get("notes") as string,
    });
  };

  const handleAccommodationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createAccommodationMutation.mutate({
      eventId: formData.get("eventId") as string,
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      roomType: formData.get("roomType") as string,
      confirmationNumber: formData.get("confirmationNumber") as string,
      contactPhone: formData.get("contactPhone") as string,
      cost: formData.get("cost") as string,
      notes: formData.get("notes") as string,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      planned: "outline",
      booked: "secondary",
      confirmed: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Travel Planner</h1>
          <p className="text-muted-foreground mt-2">
            Manage your travel arrangements and accommodations
          </p>
        </div>

        <Tabs defaultValue="travel" className="space-y-6">
          <TabsList>
            <TabsTrigger value="travel">
              <Plane className="mr-2 h-4 w-4" />
              Travel ({myTravel?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="accommodations">
              <Hotel className="mr-2 h-4 w-4" />
              Accommodations ({myAccommodations?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="travel" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={travelDialogOpen} onOpenChange={setTravelDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Travel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Travel Arrangement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleTravelSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="eventId">Event</Label>
                      <Input id="eventId" name="eventId" placeholder="Event ID" required />
                    </div>
                    <div>
                      <Label htmlFor="travelType">Travel Type</Label>
                      <Select name="travelType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flight">Flight</SelectItem>
                          <SelectItem value="train">Train</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="departureLocation">From</Label>
                        <Input id="departureLocation" name="departureLocation" />
                      </div>
                      <div>
                        <Label htmlFor="arrivalLocation">To</Label>
                        <Input id="arrivalLocation" name="arrivalLocation" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="carrier">Carrier</Label>
                        <Input id="carrier" name="carrier" placeholder="Airline, etc." />
                      </div>
                      <div>
                        <Label htmlFor="confirmationNumber">Confirmation #</Label>
                        <Input id="confirmationNumber" name="confirmationNumber" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cost">Cost</Label>
                      <Input id="cost" name="cost" type="number" step="0.01" />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" name="notes" />
                    </div>
                    <Button type="submit" className="w-full">Add Travel</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {myTravel?.map((travel) => (
                <Card key={travel.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg capitalize">{travel.travelType}</CardTitle>
                      {getStatusBadge(travel.status || "planned")}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {travel.departureLocation && travel.arrivalLocation && (
                      <p className="text-sm">
                        {travel.departureLocation} → {travel.arrivalLocation}
                      </p>
                    )}
                    {travel.carrier && (
                      <p className="text-sm text-muted-foreground">{travel.carrier}</p>
                    )}
                    {travel.confirmationNumber && (
                      <p className="text-xs text-muted-foreground">
                        Confirmation: {travel.confirmationNumber}
                      </p>
                    )}
                    {travel.cost && (
                      <p className="text-sm font-semibold">${travel.cost}</p>
                    )}
                    {travel.notes && (
                      <p className="text-sm text-muted-foreground">{travel.notes}</p>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTravelMutation.mutate({ id: travel.id })}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accommodations" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={accommodationDialogOpen} onOpenChange={setAccommodationDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Accommodation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Accommodation</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAccommodationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="acc-eventId">Event</Label>
                      <Input id="acc-eventId" name="eventId" placeholder="Event ID" required />
                    </div>
                    <div>
                      <Label htmlFor="name">Hotel/Property Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" name="address" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="roomType">Room Type</Label>
                        <Input id="roomType" name="roomType" />
                      </div>
                      <div>
                        <Label htmlFor="acc-confirmationNumber">Confirmation #</Label>
                        <Input id="acc-confirmationNumber" name="confirmationNumber" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input id="contactPhone" name="contactPhone" type="tel" />
                      </div>
                      <div>
                        <Label htmlFor="acc-cost">Cost</Label>
                        <Input id="acc-cost" name="cost" type="number" step="0.01" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="acc-notes">Notes</Label>
                      <Textarea id="acc-notes" name="notes" />
                    </div>
                    <Button type="submit" className="w-full">Add Accommodation</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {myAccommodations?.map((acc) => (
                <Card key={acc.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{acc.name}</CardTitle>
                      {getStatusBadge(acc.status || "planned")}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {acc.address && (
                      <p className="text-sm text-muted-foreground">{acc.address}</p>
                    )}
                    {acc.roomType && (
                      <p className="text-sm">{acc.roomType}</p>
                    )}
                    {acc.contactPhone && (
                      <p className="text-sm text-muted-foreground">{acc.contactPhone}</p>
                    )}
                    {acc.confirmationNumber && (
                      <p className="text-xs text-muted-foreground">
                        Confirmation: {acc.confirmationNumber}
                      </p>
                    )}
                    {acc.cost && (
                      <p className="text-sm font-semibold">${acc.cost}</p>
                    )}
                    {acc.notes && (
                      <p className="text-sm text-muted-foreground">{acc.notes}</p>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAccommodationMutation.mutate({ id: acc.id })}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

