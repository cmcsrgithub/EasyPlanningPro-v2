import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { expenses, budgets } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export const financialRouter = router({
  // Expenses
  listExpenses: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(expenses)
        .where(eq(expenses.eventId, input.eventId))
        .orderBy(sql`${expenses.date} DESC`);
    }),

  createExpense: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        category: z.string(),
        description: z.string().optional(),
        amount: z.number(),
        date: z.date(),
        receipt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const expense = {
        id: randomBytes(16).toString("hex"),
        ...input,
        amount: input.amount.toString(),
        createdAt: new Date(),
      };

      await db.insert(expenses).values(expense);

      // Update budget spent amount
      const [budget] = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.eventId, input.eventId), eq(budgets.category, input.category)))
        .limit(1);

      if (budget) {
        const newSpent = parseFloat(budget.spentAmount || "0") + input.amount;
        await db
          .update(budgets)
          .set({ spentAmount: newSpent.toString(), updatedAt: new Date() })
          .where(eq(budgets.id, budget.id));
      }

      return expense;
    }),

  deleteExpense: protectedProcedure
    .input(z.object({ id: z.string(), eventId: z.string(), category: z.string(), amount: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(expenses).where(eq(expenses.id, input.id));

      // Update budget spent amount
      const [budget] = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.eventId, input.eventId), eq(budgets.category, input.category)))
        .limit(1);

      if (budget) {
        const newSpent = Math.max(0, parseFloat(budget.spentAmount || "0") - input.amount);
        await db
          .update(budgets)
          .set({ spentAmount: newSpent.toString(), updatedAt: new Date() })
          .where(eq(budgets.id, budget.id));
      }

      return { success: true };
    }),

  // Budgets
  listBudgets: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db.select().from(budgets).where(eq(budgets.eventId, input.eventId));
    }),

  createBudget: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        category: z.string(),
        allocatedAmount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const budget = {
        id: randomBytes(16).toString("hex"),
        ...input,
        allocatedAmount: input.allocatedAmount.toString(),
        spentAmount: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(budgets).values(budget);
      return budget;
    }),

  updateBudget: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        allocatedAmount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(budgets)
        .set({
          allocatedAmount: input.allocatedAmount.toString(),
          updatedAt: new Date(),
        })
        .where(eq(budgets.id, input.id));

      return { success: true };
    }),

  deleteBudget: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(budgets).where(eq(budgets.id, input.id));
      return { success: true };
    }),

  // Financial Summary
  getSummary: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [budgetList, expenseList] = await Promise.all([
        db.select().from(budgets).where(eq(budgets.eventId, input.eventId)),
        db.select().from(expenses).where(eq(expenses.eventId, input.eventId)),
      ]);

      const totalBudget = budgetList.reduce((sum, b) => sum + parseFloat(b.allocatedAmount), 0);
      const totalSpent = expenseList.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const remaining = totalBudget - totalSpent;

      const categoryBreakdown = budgetList.map((budget) => {
        const categoryExpenses = expenseList.filter((e) => e.category === budget.category);
        const spent = categoryExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const allocated = parseFloat(budget.allocatedAmount);

        return {
          category: budget.category,
          allocated,
          spent,
          remaining: allocated - spent,
          percentage: allocated > 0 ? (spent / allocated) * 100 : 0,
        };
      });

      return {
        totalBudget,
        totalSpent,
        remaining,
        percentageUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        categoryBreakdown,
      };
    }),
});

