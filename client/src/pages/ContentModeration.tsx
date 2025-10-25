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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Flag,
  MessageSquare,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";

export default function ContentModeration() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "remove">("approve");
  const [reviewNotes, setReviewNotes] = useState("");

  // Mock flagged content
  const flaggedContent = [
    {
      id: 1,
      contentType: "comment",
      content: "This is inappropriate content that was flagged by users.",
      reportedBy: "John Doe",
      reportReason: "Spam",
      reportCount: 3,
      status: "pending",
      createdAt: "2025-10-25 05:30:00",
      author: "Bob Wilson",
      entityId: "comment-123",
    },
    {
      id: 2,
      contentType: "event",
      content: "Suspicious event description with external links",
      reportedBy: "Jane Smith",
      reportReason: "Suspicious activity",
      reportCount: 2,
      status: "pending",
      createdAt: "2025-10-25 04:15:00",
      author: "Alice Brown",
      entityId: "event-456",
    },
    {
      id: 3,
      contentType: "photo",
      content: "Inappropriate image uploaded to gallery",
      reportedBy: "Mike Johnson",
      reportReason: "Inappropriate content",
      reportCount: 5,
      status: "pending",
      createdAt: "2025-10-25 03:45:00",
      author: "Charlie Davis",
      entityId: "photo-789",
    },
    {
      id: 4,
      contentType: "comment",
      content: "Previously reviewed content - approved",
      reportedBy: "Sarah Wilson",
      reportReason: "Spam",
      reportCount: 1,
      status: "approved",
      createdAt: "2025-10-24 10:00:00",
      author: "David Lee",
      entityId: "comment-321",
    },
    {
      id: 5,
      contentType: "event",
      content: "Previously reviewed content - removed",
      reportedBy: "Tom Harris",
      reportReason: "Violation of terms",
      reportCount: 7,
      status: "removed",
      createdAt: "2025-10-24 08:30:00",
      author: "Emma White",
      entityId: "event-654",
    },
  ];

  // Mock moderation stats
  const moderationStats = {
    pending: flaggedContent.filter((c) => c.status === "pending").length,
    reviewed: flaggedContent.filter((c) => c.status !== "pending").length,
    approved: flaggedContent.filter((c) => c.status === "approved").length,
    removed: flaggedContent.filter((c) => c.status === "removed").length,
  };

  const filteredContent = flaggedContent.filter((content) => {
    const matchesStatus = statusFilter === "all" || content.status === statusFilter;
    const matchesType = contentTypeFilter === "all" || content.contentType === contentTypeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "removed":
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Removed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getContentTypeBadge = (type: string) => {
    const icons = {
      comment: MessageSquare,
      event: Flag,
      photo: Eye,
    };
    const Icon = icons[type as keyof typeof icons] || Flag;
    return (
      <Badge variant="outline">
        <Icon className="h-3 w-3 mr-1" />
        {type}
      </Badge>
    );
  };

  const handleReviewContent = () => {
    // TODO: Call API to review content
    console.log("Reviewing content:", selectedContent?.id, "Action:", reviewAction, "Notes:", reviewNotes);
    setShowReviewDialog(false);
    setSelectedContent(null);
    setReviewNotes("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground mt-2">
            Review and moderate flagged content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{moderationStats.pending}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moderationStats.reviewed}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{moderationStats.approved}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((moderationStats.approved / moderationStats.reviewed) * 100)}% approval rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Removed</CardTitle>
              <Trash2 className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{moderationStats.removed}</div>
              <p className="text-xs text-muted-foreground">Content violations</p>
            </CardContent>
          </Card>
        </div>

        {/* Flagged Content Table */}
        <Card>
          <CardHeader>
            <CardTitle>Flagged Content</CardTitle>
            <CardDescription>Review and moderate user-reported content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="photo">Photos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>{getContentTypeBadge(content.contentType)}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{content.content}</p>
                      </TableCell>
                      <TableCell>{content.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.reportReason}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-orange-500">{content.reportCount}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(content.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {content.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        {content.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContent(content);
                                setReviewAction("approve");
                                setShowReviewDialog(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedContent(content);
                                setReviewAction("remove");
                                setShowReviewDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                        {content.status !== "pending" && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === "approve" ? "Approve Content" : "Remove Content"}
              </DialogTitle>
              <DialogDescription>
                Review and {reviewAction} this flagged content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Content</Label>
                <p className="text-sm mt-2 p-3 bg-muted rounded-md">
                  {selectedContent?.content}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author</Label>
                  <p className="text-sm mt-1">{selectedContent?.author}</p>
                </div>
                <div>
                  <Label>Report Count</Label>
                  <p className="text-sm mt-1">
                    <Badge className="bg-orange-500">{selectedContent?.reportCount}</Badge>
                  </p>
                </div>
              </div>
              <div>
                <Label>Report Reason</Label>
                <p className="text-sm mt-1">
                  <Badge variant="outline">{selectedContent?.reportReason}</Badge>
                </p>
              </div>
              <div>
                <Label>Review Notes</Label>
                <Textarea
                  placeholder="Enter review notes (optional)..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button
                variant={reviewAction === "approve" ? "default" : "destructive"}
                onClick={handleReviewContent}
              >
                {reviewAction === "approve" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Content
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Content
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

