import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { tasks } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";

export const tasksRouter = router({
  // List tasks for an event
  listByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      return await db
        .select()
        .from(tasks)
        .where(eq(tasks.eventId, input.eventId));
    }),

  // Get single task
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  // Create task
  create: protectedProcedure
    .input(z.object({
      eventId: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      status: z.enum(["todo", "in_progress", "done"]).default("todo"),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      assignedTo: z.string().optional(),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const taskId = `task_${randomBytes(16).toString("hex")}`;

      await db.insert(tasks).values({
        id: taskId,
        userId: ctx.user.id,
        eventId: input.eventId,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        assignedTo: input.assignedTo,
        dueDate: input.dueDate,
      });

      return { success: true, taskId };
    }),

  // Update task
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      status: z.enum(["todo", "in_progress", "done"]).optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      assignedTo: z.string().optional(),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.status !== undefined) {
        updateData.status = input.status;
        if (input.status === "done") {
          updateData.completedAt = new Date();
        }
      }
      if (input.priority !== undefined) updateData.priority = input.priority;
      if (input.assignedTo !== undefined) updateData.assignedTo = input.assignedTo;
      if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;

      await db
        .update(tasks)
        .set(updateData)
        .where(eq(tasks.id, input.id));

      return { success: true };
    }),

  // Delete task
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db.delete(tasks).where(eq(tasks.id, input.id));

      return { success: true };
    }),

  // Update task status (for Kanban drag-and-drop)
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["todo", "in_progress", "done"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const updateData: any = { status: input.status };
      if (input.status === "done") {
        updateData.completedAt = new Date();
      }

      await db
        .update(tasks)
        .set(updateData)
        .where(eq(tasks.id, input.id));

      return { success: true };
    }),

  // Get task statistics for an event
  getStats: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const allTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.eventId, input.eventId));

      const stats = {
        total: allTasks.length,
        todo: allTasks.filter(t => t.status === "todo").length,
        inProgress: allTasks.filter(t => t.status === "in_progress").length,
        done: allTasks.filter(t => t.status === "done").length,
        highPriority: allTasks.filter(t => t.priority === "high").length,
        overdue: allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length,
      };

      return stats;
    }),
});

