import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Eye, Pin, Lock } from "lucide-react";

export default function Forum() {
  const { data: topics, isLoading } = trpc.forum.listTopics.useQuery({});

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Discussion Forum</h1>
            <p className="text-muted-foreground mt-2">
              Connect with the community and discuss events
            </p>
          </div>
          <Link href="/forum/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {topics && topics.length > 0 ? (
            topics.map((topic) => (
              <Link key={topic.id} href={`/forum/${topic.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {topic.authorId?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isPinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                          {topic.isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold text-lg truncate">
                            {topic.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {topic.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{topic.replyCount || 0} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{topic.viewCount || 0} views</span>
                          </div>
                          <span>
                            {topic.createdAt &&
                              new Date(topic.createdAt).toLocaleDateString()}
                          </span>
                          {topic.lastReplyAt && (
                            <span>
                              Last reply{" "}
                              {new Date(topic.lastReplyAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Topics Yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start a discussion to connect with the community
                </p>
                <Link href="/forum/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Topic
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

