import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sponsors } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const sponsorsRouter = router({
  // List sponsors for an event
  list: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(sponsors)
        .where(and(eq(sponsors.eventId, input.eventId), eq(sponsors.isActive, true)))
        .orderBy(sponsors.createdAt);
    }),

  // Get sponsor by ID
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const sponsor = await db
        .select()
        .from(sponsors)
        .where(eq(sponsors.id, input.id))
        .limit(1);

      return sponsor[0] || null;
    }),

  // Create sponsor
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string(),
        tier: z.enum(["platinum", "gold", "silver", "bronze"]).default("bronze"),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
        contributionAmount: z.number().optional(),
        contactName: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `sponsor_${Date.now()}`;
      await db.insert(sponsors).values({
        id,
        eventId: input.eventId,
        name: input.name,
        tier: input.tier,
        logoUrl: input.logoUrl || null,
        website: input.website || null,
        description: input.description || null,
        contributionAmount: input.contributionAmount?.toString() || null,
        contactName: input.contactName || null,
        contactEmail: input.contactEmail || null,
        contactPhone: input.contactPhone || null,
        isActive: true,
      });

      return { id };
    }),

  // Update sponsor
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        tier: z.enum(["platinum", "gold", "silver", "bronze"]).optional(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
        contributionAmount: z.number().optional(),
        contactName: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.tier) updates.tier = input.tier;
      if (input.logoUrl !== undefined) updates.logoUrl = input.logoUrl;
      if (input.website !== undefined) updates.website = input.website;
      if (input.description !== undefined) updates.description = input.description;
      if (input.contributionAmount !== undefined) updates.contributionAmount = input.contributionAmount.toString();
      if (input.contactName !== undefined) updates.contactName = input.contactName;
      if (input.contactEmail !== undefined) updates.contactEmail = input.contactEmail;
      if (input.contactPhone !== undefined) updates.contactPhone = input.contactPhone;
      if (input.isActive !== undefined) updates.isActive = input.isActive;

      await db.update(sponsors).set(updates).where(eq(sponsors.id, input.id));

      return { success: true };
    }),

  // Delete sponsor
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(sponsors).where(eq(sponsors.id, input.id));

      return { success: true };
    }),
});

