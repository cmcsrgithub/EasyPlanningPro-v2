import { useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Loader2, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function PollDetail() {
  const [, params] = useRoute("/polls/:id");
  const pollId = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();

  const { data: poll, isLoading, refetch } = trpc.polls.get.useQuery({ id: pollId });

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [voterName, setVoterName] = useState("");

  const voteMutation = trpc.polls.vote.useMutation({
    onSuccess: () => {
      toast.success("Vote submitted successfully");
      setSelectedOptions([]);
      setVoterName("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to submit vote: ${error.message}`);
    },
  });

  const handleVote = () => {
    if (selectedOptions.length === 0) {
      toast.error("Please select at least one option");
      return;
    }

    if (!user && !voterName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    voteMutation.mutate({
      pollId,
      optionIds: selectedOptions,
      voterName: voterName || undefined,
    });
  };

  const toggleOption = (optionId: number) => {
    if (poll?.allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!poll) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-xl font-semibold mb-2">Poll not found</h3>
            <p className="text-muted-foreground">This poll may have been deleted</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const totalVotes = poll.totalVotes || 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Poll Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{poll.title}</CardTitle>
                {poll.description && (
                  <CardDescription className="mt-2 text-base">
                    {poll.description}
                  </CardDescription>
                )}
              </div>
              <Badge variant={poll.isActive ? "default" : "secondary"}>
                {poll.isActive ? "Active" : "Closed"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>{totalVotes} total votes</span>
              </div>
              {poll.closesAt && (
                <span>Closes: {new Date(poll.closesAt).toLocaleDateString()}</span>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Voting Section (if active) */}
        {poll.isActive && (
          <Card>
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>
                {poll.allowMultiple
                  ? "Select one or more options"
                  : "Select one option"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {poll.options?.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleOption(option.id)}
                  >
                    {poll.allowMultiple ? (
                      <Checkbox
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => toggleOption(option.id)}
                      />
                    ) : (
                      <RadioGroupItem
                        value={option.id.toString()}
                        checked={selectedOptions.includes(option.id)}
                      />
                    )}
                    <Label className="flex-1 cursor-pointer">{option.text}</Label>
                  </div>
                ))}
              </div>

              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="voterName">Your Name</Label>
                  <Input
                    id="voterName"
                    placeholder="Enter your name"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                  />
                </div>
              )}

              <Button
                onClick={handleVote}
                disabled={voteMutation.isPending || selectedOptions.length === 0}
                className="w-full"
              >
                {voteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Vote"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {totalVotes} {totalVotes === 1 ? "vote" : "votes"} received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {poll.options?.map((option) => {
              const percentage =
                totalVotes > 0 ? ((option.voteCount || 0) / totalVotes) * 100 : 0;

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-muted-foreground">
                      {option.voteCount || 0} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {totalVotes === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No votes yet. Be the first to vote!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

