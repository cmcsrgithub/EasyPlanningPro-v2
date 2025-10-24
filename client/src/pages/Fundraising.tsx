import { useState } from "react";
import { useParams } from "wouter";
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
import { Progress } from "@/components/ui/progress";
import { Plus, Heart, DollarSign, Users, TrendingUp, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface DonationFormData {
  donorName: string;
  donorEmail: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
}

export default function Fundraising() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { user } = useAuth();
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const { register, handleSubmit, reset } = useForm<DonationFormData>();

  const { data: donations = [] } = trpc.donations.list.useQuery({ eventId });
  const { data: publicDonations = [] } = trpc.donations.getPublic.useQuery({ eventId });
  const { data: stats } = trpc.donations.getStats.useQuery({ eventId });

  const createDonation = trpc.donations.create.useMutation({
    onSuccess: () => {
      utils.donations.list.invalidate({ eventId });
      utils.donations.getPublic.invalidate({ eventId });
      utils.donations.getStats.invalidate({ eventId });
      toast.success("Donation recorded");
      setDonationDialogOpen(false);
      reset();
    },
  });

  const deleteDonation = trpc.donations.delete.useMutation({
    onSuccess: () => {
      utils.donations.list.invalidate({ eventId });
      utils.donations.getPublic.invalidate({ eventId });
      utils.donations.getStats.invalidate({ eventId });
      toast.success("Donation removed");
    },
  });

  const onSubmit = (data: DonationFormData) => {
    createDonation.mutate({
      eventId,
      ...data,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this donation?")) {
      deleteDonation.mutate({ id });
    }
  };

  const goalAmount = 10000; // Example goal
  const progress = stats ? (stats.totalAmount / goalAmount) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fundraising</h1>
            <p className="text-muted-foreground mt-1">Track donations and fundraising progress</p>
          </div>
          <Dialog open={donationDialogOpen} onOpenChange={setDonationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Donation</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Donor Name</Label>
                  <Input {...register("donorName")} />
                </div>
                <div>
                  <Label>Donor Email</Label>
                  <Input type="email" {...register("donorEmail")} />
                </div>
                <div>
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("amount", { required: true, valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea {...register("message")} rows={3} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register("isAnonymous")} id="isAnonymous" />
                  <Label htmlFor="isAnonymous">Anonymous Donation</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDonationDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Record Donation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalAmount.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">
                {progress.toFixed(0)}% of ${goalAmount.toLocaleString()} goal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.donorCount || 0}</div>
              <p className="text-xs text-muted-foreground">Unique contributors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.donationCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total contributions</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Fundraising Goal Progress</CardTitle>
            <CardDescription>Track progress towards your fundraising goal</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-4" />
            <p className="text-sm text-muted-foreground mt-2">
              ${stats?.totalAmount.toFixed(2) || "0.00"} of ${goalAmount.toLocaleString()} raised
            </p>
          </CardContent>
        </Card>

        {/* Donations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {user && donations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No donations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(user ? donations : publicDonations).map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {donation.donorName || "Anonymous"}
                        </span>
                        {donation.isAnonymous && (
                          <Badge variant="secondary">Anonymous</Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-primary mt-1">
                        ${parseFloat(donation.amount).toFixed(2)}
                      </p>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{donation.message}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {donation.donatedAt ? new Date(donation.donatedAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(donation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

