import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { eventTemplates } from "../../drizzle/schema";
import { eq, desc, like, or } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const templatesRouter = router({
  // List all templates
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(eventTemplates).orderBy(desc(eventTemplates.createdAt));
  }),

  // List public templates
  listPublic: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(eventTemplates)
      .where(eq(eventTemplates.isPublic, true))
      .orderBy(desc(eventTemplates.usageCount));
  }),

  // List my templates
  listMy: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(eventTemplates)
      .where(eq(eventTemplates.createdBy, ctx.user.id))
      .orderBy(desc(eventTemplates.createdAt));
  }),

  // Search templates
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(eventTemplates)
        .where(
          or(
            like(eventTemplates.name, `%${input.query}%`),
            like(eventTemplates.description, `%${input.query}%`),
            like(eventTemplates.category, `%${input.query}%`)
          )
        )
        .orderBy(desc(eventTemplates.usageCount));
    }),

  // Get template by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [template] = await db
        .select()
        .from(eventTemplates)
        .where(eq(eventTemplates.id, input.id));
      return template;
    }),

  // Create template
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        eventType: z.string().optional(),
        defaultDuration: z.number().optional(),
        defaultMaxAttendees: z.number().optional(),
        defaultIsPublic: z.boolean().optional(),
        templateData: z.any().optional(),
        imageUrl: z.string().optional(),
        isPublic: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(eventTemplates).values({
        id,
        ...input,
        createdBy: ctx.user.id,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id };
    }),

  // Update template
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        eventType: z.string().optional(),
        defaultDuration: z.number().optional(),
        defaultMaxAttendees: z.number().optional(),
        defaultIsPublic: z.boolean().optional(),
        templateData: z.any().optional(),
        imageUrl: z.string().optional(),
        isPublic: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db
        .update(eventTemplates)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(eventTemplates.id, id));
      return { success: true };
    }),

  // Delete template
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(eventTemplates).where(eq(eventTemplates.id, input.id));
      return { success: true };
    }),

  // Increment usage count
  incrementUsage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [template] = await db
        .select()
        .from(eventTemplates)
        .where(eq(eventTemplates.id, input.id));
      
      if (template) {
        await db
          .update(eventTemplates)
          .set({ usageCount: (template.usageCount || 0) + 1 })
          .where(eq(eventTemplates.id, input.id));
      }
      return { success: true };
    }),
});

