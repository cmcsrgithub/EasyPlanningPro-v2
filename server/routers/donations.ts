import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { donations } from "../../drizzle/schema";
import { eq, desc, sum, sql } from "drizzle-orm";

export const donationsRouter = router({
  // List donations for an event
  list: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(donations)
        .where(eq(donations.eventId, input.eventId))
        .orderBy(desc(donations.donatedAt));
    }),

  // Get public donations (non-anonymous)
  getPublic: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const publicDonations = await db
        .select()
        .from(donations)
        .where(eq(donations.eventId, input.eventId))
        .orderBy(desc(donations.donatedAt));

      // Hide donor info for anonymous donations
      return publicDonations.map((d) => ({
        ...d,
        donorName: d.isAnonymous ? "Anonymous" : d.donorName,
        donorEmail: d.isAnonymous ? null : d.donorEmail,
      }));
    }),

  // Get donation statistics
  getStats: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select({
          totalAmount: sql<string>`COALESCE(SUM(${donations.amount}), 0)`,
          donorCount: sql<number>`COUNT(DISTINCT ${donations.donorEmail})`,
          donationCount: sql<number>`COUNT(*)`,
        })
        .from(donations)
        .where(eq(donations.eventId, input.eventId));

      return {
        totalAmount: parseFloat(result[0]?.totalAmount || "0"),
        donorCount: result[0]?.donorCount || 0,
        donationCount: result[0]?.donationCount || 0,
      };
    }),

  // Create donation
  create: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        donorName: z.string().optional(),
        donorEmail: z.string().optional(),
        amount: z.number(),
        message: z.string().optional(),
        isAnonymous: z.boolean().default(false),
        stripePaymentId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `donation_${Date.now()}`;
      await db.insert(donations).values({
        id,
        eventId: input.eventId,
        donorName: input.donorName || null,
        donorEmail: input.donorEmail || null,
        amount: input.amount.toString(),
        message: input.message || null,
        isAnonymous: input.isAnonymous,
        stripePaymentId: input.stripePaymentId || null,
        status: "completed",
      });

      return { id };
    }),

  // Delete donation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(donations).where(eq(donations.id, input.id));

      return { success: true };
    }),
});

