import { useState, useEffect, useRef } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, Hash, Lock, Trash2, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface ChannelFormData {
  name: string;
  description: string;
  isPrivate: boolean;
}

export default function Messaging() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { user } = useAuth();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { register, handleSubmit, reset } = useForm<ChannelFormData>();

  const { data: channels = [] } = trpc.messaging.listChannels.useQuery({ eventId });
  const { data: messages = [] } = trpc.messaging.listMessages.useQuery(
    { channelId: selectedChannelId || "" },
    { enabled: !!selectedChannelId, refetchInterval: 3000 } // Poll every 3 seconds for new messages
  );

  const createChannel = trpc.messaging.createChannel.useMutation({
    onSuccess: () => {
      utils.messaging.listChannels.invalidate({ eventId });
      toast.success("Channel created");
      setChannelDialogOpen(false);
      reset();
    },
  });

  const deleteChannel = trpc.messaging.deleteChannel.useMutation({
    onSuccess: () => {
      utils.messaging.listChannels.invalidate({ eventId });
      setSelectedChannelId(null);
      toast.success("Channel deleted");
    },
  });

  const sendMessage = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      utils.messaging.listMessages.invalidate({ channelId: selectedChannelId || "" });
      setMessageContent("");
    },
  });

  const deleteMessage = trpc.messaging.deleteMessage.useMutation({
    onSuccess: () => {
      utils.messaging.listMessages.invalidate({ channelId: selectedChannelId || "" });
      toast.success("Message deleted");
    },
  });

  const onSubmitChannel = (data: ChannelFormData) => {
    createChannel.mutate({
      eventId,
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate || false,
    });
  };

  const handleSendMessage = () => {
    if (!messageContent.trim() || !selectedChannelId) return;

    sendMessage.mutate({
      channelId: selectedChannelId,
      content: messageContent,
    });
  };

  const handleDeleteChannel = (channelId: string, channelName: string) => {
    if (confirm(`Are you sure you want to delete the channel "${channelName}"?`)) {
      deleteChannel.mutate({ id: channelId });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("Delete this message?")) {
      deleteMessage.mutate({ id: messageId });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select first channel by default
  useEffect(() => {
    if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  if (!eventId) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">No event selected</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Messaging</h1>
            <p className="text-muted-foreground mt-1">Group chat for attendees</p>
          </div>
          <Dialog open={channelDialogOpen} onOpenChange={setChannelDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Channel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Channel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitChannel)} className="space-y-4">
                <div>
                  <Label>Channel Name *</Label>
                  <Input {...register("name", { required: true })} placeholder="e.g., General" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register("description")} rows={2} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register("isPrivate")} id="isPrivate" />
                  <Label htmlFor="isPrivate">Private Channel</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setChannelDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Channel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Channel List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Channels</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {channels.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    No channels yet
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedChannelId === channel.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => setSelectedChannelId(channel.id)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {channel.isPrivate ? (
                            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="font-medium truncate">{channel.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChannel(channel.id, channel.name);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="lg:col-span-3">
            {selectedChannel ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-2">
                    {selectedChannel.isPrivate ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <Hash className="h-5 w-5" />
                    )}
                    <div>
                      <CardTitle>{selectedChannel.name}</CardTitle>
                      {selectedChannel.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedChannel.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Messages */}
                  <ScrollArea className="h-[420px] p-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...messages].reverse().map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.senderId === user?.id ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {message.senderName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`flex-1 max-w-[70%] ${
                                message.senderId === user?.id ? "text-right" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{message.senderName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : "N/A"}
                                </span>
                                {message.senderId === user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteMessage(message.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.senderId === user?.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-accent"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Select a channel to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

