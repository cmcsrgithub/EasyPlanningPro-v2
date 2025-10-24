import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Clock, ArrowLeft, ShoppingCart } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function PackageDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/packages/:id");
  const [, setLocation] = useLocation();
  const packageId = params?.id as string;

  const { data: pkg, isLoading } = trpc.packages.get.useQuery(
    { id: packageId },
    { enabled: !!packageId }
  );

  const purchasePackage = trpc.packages.purchase.useMutation({
    onSuccess: (data) => {
      toast.success(`Package purchased! QR Code: ${data.qrCode}`);
      setLocation("/packages");
    },
  });

  const handlePurchase = () => {
    if (!pkg) return;
    
    const amount = parseFloat(pkg.price || "0");
    purchasePackage.mutate({
      packageId: pkg.id,
      amount,
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

  if (!pkg) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Package not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/packages")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{pkg.title}</h1>
              {pkg.description && (
                <p className="text-muted-foreground mt-2">{pkg.description}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Package Price</p>
            <p className="text-3xl font-bold text-primary">
              ${parseFloat(pkg.price || "0").toFixed(2)}
            </p>
          </div>
        </div>

        {/* Purchase Button */}
        {user && (
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" size="lg" onClick={handlePurchase}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase Package
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Event Itinerary */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Event Itinerary</h2>
          {!pkg.events || pkg.events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No events in this package
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pkg.events.map((event: any, index: number) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/events/${event.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {event.eventType && (
                        <Badge variant="secondary">{event.eventType}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.startDate
                            ? new Date(event.startDate).toLocaleDateString()
                            : "Date TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.startDate
                            ? new Date(event.startDate).toLocaleTimeString()
                            : "Time TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{event.location || "Location TBD"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Package Info */}
        <Card>
          <CardHeader>
            <CardTitle>Package Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Events</span>
              <span className="font-semibold">{pkg.events?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Package Price</span>
              <span className="font-semibold">${parseFloat(pkg.price || "0").toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={pkg.isActive ? "default" : "secondary"}>
                {pkg.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

