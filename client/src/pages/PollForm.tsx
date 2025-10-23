import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Plus, X, Loader2 } from "lucide-react";

const pollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  allowMultiple: z.boolean(),
  closesAt: z.string().optional(),
});

type PollFormData = z.infer<typeof pollSchema>;

export default function PollForm() {
  const [, setLocation] = useLocation();
  const [options, setOptions] = useState<string[]>(["", ""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
  });

  const allowMultiple = watch("allowMultiple");

  const createMutation = trpc.polls.create.useMutation({
    onSuccess: () => {
      toast.success("Poll created successfully");
      setLocation("/polls");
    },
    onError: (error) => {
      toast.error(`Failed to create poll: ${error.message}`);
    },
  });

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const onSubmit = (data: PollFormData) => {
    const validOptions = options.filter((opt) => opt.trim().length > 0);

    if (validOptions.length < 2) {
      toast.error("Please add at least 2 options");
      return;
    }

    createMutation.mutate({
      title: data.title,
      description: data.description,
      allowMultiple: data.allowMultiple,
      closesAt: data.closesAt ? new Date(data.closesAt) : undefined,
      options: validOptions,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Poll</h1>
          <p className="text-muted-foreground">Create a new poll or survey for your event</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Poll Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title *</Label>
                <Input
                  id="title"
                  placeholder="What should we serve for dinner?"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more context about this poll..."
                  {...register("description")}
                />
              </div>

              {/* Allow Multiple */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowMultiple"
                  {...register("allowMultiple")}
                />
                <Label htmlFor="allowMultiple" className="cursor-pointer">
                  Allow multiple selections
                </Label>
              </div>

              {/* Closes At */}
              <div className="space-y-2">
                <Label htmlFor="closesAt">Close Poll On (Optional)</Label>
                <Input
                  id="closesAt"
                  type="datetime-local"
                  {...register("closesAt")}
                />
              </div>

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Poll Options *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  At least 2 options are required
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Poll"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/polls")}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}

