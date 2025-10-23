import { useState } from "react";
import { useParams } from "wouter";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#00AEEF", "#FF8042", "#00C49F", "#FFBB28", "#8884d8", "#82ca9d"];

interface ExpenseFormData {
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface BudgetFormData {
  category: string;
  allocatedAmount: number;
}

export default function Financial() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const utils = trpc.useUtils();

  const { register: registerExpense, handleSubmit: handleSubmitExpense, reset: resetExpense } =
    useForm<ExpenseFormData>();
  const { register: registerBudget, handleSubmit: handleSubmitBudget, reset: resetBudget } =
    useForm<BudgetFormData>();

  const { data: summary } = trpc.financial.getSummary.useQuery({ eventId });
  const { data: expenses = [] } = trpc.financial.listExpenses.useQuery({ eventId });
  const { data: budgets = [] } = trpc.financial.listBudgets.useQuery({ eventId });
  const { data: event } = trpc.events.get.useQuery({ id: eventId });

  const createExpense = trpc.financial.createExpense.useMutation({
    onSuccess: () => {
      utils.financial.listExpenses.invalidate({ eventId });
      utils.financial.getSummary.invalidate({ eventId });
      toast.success("Expense added");
      setExpenseDialogOpen(false);
      resetExpense();
    },
  });

  const deleteExpense = trpc.financial.deleteExpense.useMutation({
    onSuccess: () => {
      utils.financial.listExpenses.invalidate({ eventId });
      utils.financial.getSummary.invalidate({ eventId });
      toast.success("Expense deleted");
    },
  });

  const createBudget = trpc.financial.createBudget.useMutation({
    onSuccess: () => {
      utils.financial.listBudgets.invalidate({ eventId });
      utils.financial.getSummary.invalidate({ eventId });
      toast.success("Budget created");
      setBudgetDialogOpen(false);
      resetBudget();
    },
  });

  const onSubmitExpense = (data: ExpenseFormData) => {
    createExpense.mutate({
      eventId,
      ...data,
      date: new Date(data.date),
    });
  };

  const onSubmitBudget = (data: BudgetFormData) => {
    createBudget.mutate({
      eventId,
      ...data,
    });
  };

  const exportToCSV = () => {
    const csv = [
      ["Date", "Category", "Description", "Amount"],
      ...expenses.map((e) => [
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.description || "",
        e.amount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${event?.title || "event"}.csv`;
    a.click();
    toast.success("Exported to CSV");
  };

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
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            {event && <p className="text-muted-foreground mt-1">Event: {event.title}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Budget Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitBudget(onSubmitBudget)} className="space-y-4">
                  <div>
                    <Label>Category *</Label>
                    <Input {...registerBudget("category", { required: true })} placeholder="e.g., Catering" />
                  </div>
                  <div>
                    <Label>Allocated Amount *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...registerBudget("allocatedAmount", { required: true, valueAsNumber: true })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setBudgetDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Budget</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitExpense(onSubmitExpense)} className="space-y-4">
                  <div>
                    <Label>Category *</Label>
                    <Input {...registerExpense("category", { required: true })} placeholder="e.g., Catering" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea {...registerExpense("description")} rows={2} />
                  </div>
                  <div>
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...registerExpense("amount", { required: true, valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>Date *</Label>
                    <Input type="date" {...registerExpense("date", { required: true })} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setExpenseDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Expense</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.totalBudget.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.percentageUsed.toFixed(1)}% of budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.remaining.toFixed(2)}</div>
                <Progress value={100 - summary.percentageUsed} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        {summary && summary.categoryBreakdown.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Spent by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="allocated" fill="#00AEEF" name="Budget" />
                    <Bar dataKey="spent" fill="#FF8042" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={summary.categoryBreakdown}
                      dataKey="spent"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {summary.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const spent = parseFloat(budget.spentAmount || "0");
                  const allocated = parseFloat(budget.allocatedAmount);
                  const percentage = (spent / allocated) * 100;

                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{budget.category}</span>
                        <span className="text-sm text-muted-foreground">
                          ${spent.toFixed(2)} / ${allocated.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={percentage} className={percentage > 90 ? "bg-red-100" : ""} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No expenses recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description || "-"}</TableCell>
                      <TableCell className="text-right">${parseFloat(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            deleteExpense.mutate({
                              id: expense.id,
                              eventId: expense.eventId,
                              category: expense.category,
                              amount: parseFloat(expense.amount),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

