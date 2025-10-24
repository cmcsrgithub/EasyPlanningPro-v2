import { useState } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Award, Trash2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface SponsorFormData {
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  logoUrl: string;
  website: string;
  description: string;
  contributionAmount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export default function Sponsors() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const { register, handleSubmit, reset, setValue } = useForm<SponsorFormData>();

  const { data: sponsors = [] } = trpc.sponsors.list.useQuery({ eventId });

  const createSponsor = trpc.sponsors.create.useMutation({
    onSuccess: () => {
      utils.sponsors.list.invalidate({ eventId });
      toast.success("Sponsor added");
      setSponsorDialogOpen(false);
      reset();
    },
  });

  const deleteSponsor = trpc.sponsors.delete.useMutation({
    onSuccess: () => {
      utils.sponsors.list.invalidate({ eventId });
      toast.success("Sponsor removed");
    },
  });

  const onSubmit = (data: SponsorFormData) => {
    createSponsor.mutate({
      eventId,
      ...data,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove sponsor "${name}"?`)) {
      deleteSponsor.mutate({ id });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-slate-200 text-slate-900";
      case "gold":
        return "bg-yellow-200 text-yellow-900";
      case "silver":
        return "bg-gray-200 text-gray-900";
      case "bronze":
        return "bg-orange-200 text-orange-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sponsor Management</h1>
            <p className="text-muted-foreground mt-1">Manage event sponsors and partnerships</p>
          </div>
          <Dialog open={sponsorDialogOpen} onOpenChange={setSponsorDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Sponsor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Sponsor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Sponsor Name *</Label>
                  <Input {...register("name", { required: true })} />
                </div>
                <div>
                  <Label>Sponsorship Tier *</Label>
                  <Select onValueChange={(value: any) => setValue("tier", value)} defaultValue="bronze">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input {...register("logoUrl")} placeholder="https://example.com/logo.png" />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input {...register("website")} placeholder="https://example.com" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register("description")} rows={3} />
                </div>
                <div>
                  <Label>Contribution Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("contributionAmount", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Name</Label>
                    <Input {...register("contactName")} />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input type="email" {...register("contactEmail")} />
                  </div>
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input {...register("contactPhone")} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSponsorDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Sponsor</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sponsors Grid */}
        {sponsors.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sponsors yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{sponsor.name}</CardTitle>
                        <Badge className={getTierColor(sponsor.tier || "bronze")}>
                          {sponsor.tier}
                        </Badge>
                      </div>
                      {sponsor.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {sponsor.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sponsor.id, sponsor.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sponsor.logoUrl && (
                    <div className="flex justify-center p-4 bg-accent rounded-lg">
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className="max-h-20 object-contain"
                      />
                    </div>
                  )}
                  {sponsor.contributionAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contribution</span>
                      <span className="font-semibold">
                        ${parseFloat(sponsor.contributionAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {sponsor.website && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(sponsor.website || "", "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  )}
                  {sponsor.contactEmail && (
                    <div className="text-xs text-muted-foreground">
                      Contact: {sponsor.contactEmail}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

