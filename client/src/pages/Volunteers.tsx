import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Volunteers() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = () => {
    if (!name || !email) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Volunteer application submitted!");
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setSkills("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Volunteer Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage event volunteers and applications
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Volunteer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Volunteer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Submit Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Total Volunteers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              No volunteers yet. Add your first volunteer to get started.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
