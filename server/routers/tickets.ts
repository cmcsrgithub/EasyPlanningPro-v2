import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { supportTickets, ticketComments } from "../../drizzle/schema";
import { eq, desc, or } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const ticketsRouter = router({
  // Tickets
  listTickets: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(supportTickets)
      .where(
        or(
          eq(supportTickets.submittedBy, ctx.user.id),
          eq(supportTickets.assignedTo, ctx.user.id)
        )
      )
      .orderBy(desc(supportTickets.createdAt));
  }),

  getTicketById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [ticket] = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.id, input.id));
      return ticket;
    }),

  createTicket: protectedProcedure
    .input(
      z.object({
        eventId: z.string().optional(),
        subject: z.string(),
        description: z.string(),
        category: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(supportTickets).values({
        id,
        ...input,
        submittedBy: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id };
    }),

  updateTicket: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        assignedTo: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      
      const updateData: any = { ...data, updatedAt: new Date() };
      if (data.status === "resolved" || data.status === "closed") {
        updateData.resolvedAt = new Date();
      }
      
      await db
        .update(supportTickets)
        .set(updateData)
        .where(eq(supportTickets.id, id));
      return { success: true };
    }),

  deleteTicket: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(supportTickets).where(eq(supportTickets.id, input.id));
      return { success: true };
    }),

  // Comments
  getCommentsByTicket: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(ticketComments)
        .where(eq(ticketComments.ticketId, input.ticketId))
        .orderBy(ticketComments.createdAt);
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        content: z.string(),
        isInternal: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(ticketComments).values({
        id,
        ...input,
        authorId: ctx.user.id,
        createdAt: new Date(),
      });
      
      // Update ticket timestamp
      await db
        .update(supportTickets)
        .set({ updatedAt: new Date() })
        .where(eq(supportTickets.id, input.ticketId));
      
      return { id };
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(ticketComments).where(eq(ticketComments.id, input.id));
      return { success: true };
    }),
});

