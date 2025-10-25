import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, UserPlus, Shield, Ban, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("7");
  const [newRole, setNewRole] = useState("");

  // Mock data - replace with actual API call
  const users = [
    {
      id: 1,
      name: "Carlton Campbell",
      email: "cmcampbellsr@gmail.com",
      role: "admin",
      status: "active",
      lastLogin: "2025-10-25",
      eventsCreated: 0,
      subscriptionTier: "basic",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      lastLogin: "2025-10-24",
      eventsCreated: 5,
      subscriptionTier: "premium",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "moderator",
      status: "active",
      lastLogin: "2025-10-23",
      eventsCreated: 12,
      subscriptionTier: "pro",
    },
    {
      id: 4,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "user",
      status: "suspended",
      lastLogin: "2025-10-20",
      eventsCreated: 2,
      subscriptionTier: "basic",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "moderator":
        return "bg-blue-500";
      case "user":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-red-500";
  };

  const handleAssignRole = () => {
    // TODO: Call API to assign role
    console.log("Assigning role:", newRole, "to user:", selectedUser?.id);
    setShowRoleDialog(false);
    setSelectedUser(null);
    setNewRole("");
  };

  const handleSuspendUser = () => {
    // TODO: Call API to suspend user
    console.log("Suspending user:", selectedUser?.id, "for", suspensionDuration, "days");
    setShowSuspendDialog(false);
    setSelectedUser(null);
    setSuspensionReason("");
    setSuspensionDuration("7");
  };

  const handleUnsuspendUser = (userId: number) => {
    // TODO: Call API to unsuspend user
    console.log("Unsuspending user:", userId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, assign roles, and handle suspensions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((users.filter((u) => u.status === "active").length / users.length) * 100)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <Ban className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.status === "suspended").length}
              </div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>View and manage all platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{user.subscriptionTier}</span>
                      </TableCell>
                      <TableCell>{user.eventsCreated}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleDialog(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Role
                          </Button>
                          {user.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowSuspendDialog(true);
                              }}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnsuspendUser(user.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Unsuspend
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Assign Role Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Role</Label>
                <div className="mt-2">
                  <Badge className={getRoleBadgeColor(selectedUser?.role || "")}>
                    {selectedUser?.role}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>New Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignRole} disabled={!newRole}>
                Assign Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend User Dialog */}
        <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User</DialogTitle>
              <DialogDescription>
                Suspend {selectedUser?.name} from the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Reason</Label>
                <Textarea
                  placeholder="Enter suspension reason..."
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label>Duration (days)</Label>
                <Input
                  type="number"
                  value={suspensionDuration}
                  onChange={(e) => setSuspensionDuration(e.target.value)}
                  min="1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave as 0 for permanent suspension
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleSuspendUser}
                disabled={!suspensionReason}
              >
                Suspend User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

