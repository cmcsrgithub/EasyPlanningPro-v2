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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Trash2, Eye, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";

interface FormFieldData {
  label: string;
  fieldType: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date";
  options?: string;
  isRequired: boolean;
}

interface CustomFormData {
  title: string;
  description: string;
  fields: FormFieldData[];
}

export default function CustomForms() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewResponsesFormId, setViewResponsesFormId] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const { register, handleSubmit, reset, control } = useForm<CustomFormData>({
    defaultValues: {
      fields: [{ label: "", fieldType: "text", isRequired: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { data: forms = [] } = trpc.customForms.list.useQuery({ eventId });
  const { data: responses = [] } = trpc.customForms.getResponses.useQuery(
    { formId: viewResponsesFormId || "" },
    { enabled: !!viewResponsesFormId }
  );

  const createForm = trpc.customForms.create.useMutation({
    onSuccess: () => {
      utils.customForms.list.invalidate({ eventId });
      toast.success("Form created");
      setFormDialogOpen(false);
      reset();
    },
  });

  const deleteForm = trpc.customForms.delete.useMutation({
    onSuccess: () => {
      utils.customForms.list.invalidate({ eventId });
      toast.success("Form deleted");
    },
  });

  const onSubmit = (data: CustomFormData) => {
    createForm.mutate({
      eventId,
      title: data.title,
      description: data.description,
      fields: data.fields,
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete form "${title}"?`)) {
      deleteForm.mutate({ id });
    }
  };

  const exportResponses = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    const formResponses = responses.filter((r) => r.formId === formId);
    if (formResponses.length === 0) {
      toast.error("No responses to export");
      return;
    }

    // Create CSV
    const headers = ["Submitted At", "User Name", "User Email", "Response Data"];
    const rows = formResponses.map((r) => [
      r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "N/A",
      r.userName || "N/A",
      r.userEmail || "N/A",
      r.responseData,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/\s+/g, "_")}_responses.csv`;
    a.click();
    toast.success("Responses exported");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Custom Forms</h1>
            <p className="text-muted-foreground mt-1">Create custom registration forms</p>
          </div>
          <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Form</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Form Title *</Label>
                  <Input {...register("title", { required: true })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register("description")} rows={2} />
                </div>

                {/* Form Fields */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Form Fields</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ label: "", fieldType: "text", isRequired: false })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Field {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Label</Label>
                          <Input {...register(`fields.${index}.label` as const)} />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            onValueChange={(value: any) =>
                              register(`fields.${index}.fieldType` as const).onChange({
                                target: { value },
                              })
                            }
                            defaultValue="text"
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...register(`fields.${index}.isRequired` as const)}
                          id={`required-${index}`}
                        />
                        <Label htmlFor={`required-${index}`} className="text-xs">
                          Required
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setFormDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Form</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Forms List */}
        {forms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No custom forms yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{form.title}</CardTitle>
                      {form.description && (
                        <CardDescription className="mt-2">{form.description}</CardDescription>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(form.id, form.title)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={form.isActive ? "default" : "secondary"}>
                      {form.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setViewResponsesFormId(form.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Responses
                    </Button>
                    <Button variant="outline" onClick={() => exportResponses(form.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Responses Viewer */}
        {viewResponsesFormId && (
          <Dialog open={!!viewResponsesFormId} onOpenChange={() => setViewResponsesFormId(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Form Responses</DialogTitle>
              </DialogHeader>
              {responses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No responses yet</div>
              ) : (
                <div className="space-y-4">
                  {responses.map((response) => (
                    <Card key={response.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{response.userName || "Anonymous"}</CardTitle>
                            <p className="text-sm text-muted-foreground">{response.userEmail}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {response.submittedAt
                              ? new Date(response.submittedAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm whitespace-pre-wrap bg-accent p-3 rounded">
                          {response.responseData}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}

