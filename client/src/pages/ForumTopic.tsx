import { useParams } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Pin, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ForumTopic() {
  const { id } = useParams();
  const [replyContent, setReplyContent] = useState("");
  const utils = trpc.useUtils();

  const { data: topic, isLoading } = trpc.forum.getTopicById.useQuery({ id: id! });
  const { data: replies } = trpc.forum.getRepliesByTopic.useQuery({ topicId: id! });

  const createReplyMutation = trpc.forum.createReply.useMutation({
    onSuccess: () => {
      toast.success("Reply posted");
      setReplyContent("");
      utils.forum.getRepliesByTopic.invalidate();
      utils.forum.getTopicById.invalidate();
    },
  });

  const deleteReplyMutation = trpc.forum.deleteReply.useMutation({
    onSuccess: () => {
      toast.success("Reply deleted");
      utils.forum.getRepliesByTopic.invalidate();
    },
  });

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    createReplyMutation.mutate({
      topicId: id!,
      content: replyContent,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!topic) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Topic Not Found</h2>
          <p className="text-muted-foreground">This topic doesn't exist or has been deleted.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Topic Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {topic.isPinned && <Pin className="h-4 w-4 text-primary" />}
            {topic.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
            <h1 className="text-4xl font-semibold tracking-tight">{topic.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{topic.replyCount || 0} replies</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{topic.viewCount || 0} views</span>
            </div>
            <span>
              {topic.createdAt && new Date(topic.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Original Post */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  {topic.authorId?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Author</span>
                  <Badge variant="outline">OP</Badge>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-wrap">{topic.content}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Replies ({replies?.length || 0})</h2>
          
          {replies && replies.length > 0 ? (
            replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {reply.authorId?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">User</span>
                          <span className="text-xs text-muted-foreground">
                            {reply.createdAt &&
                              new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReplyMutation.mutate({ id: reply.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No replies yet. Be the first to reply!
            </p>
          )}
        </div>

        {/* Reply Form */}
        {!topic.isLocked && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Post a Reply</h3>
              <Textarea
                placeholder="Write your reply..."
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleSubmitReply}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Post Reply
              </Button>
            </CardContent>
          </Card>
        )}

        {topic.isLocked && (
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                This topic is locked. No new replies can be posted.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

