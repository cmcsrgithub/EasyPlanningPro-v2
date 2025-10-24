import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { eventWaitlist } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const waitlistRouter = router({
  // List waitlist for an event
  listByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(eventWaitlist)
        .where(eq(eventWaitlist.eventId, input.eventId))
        .orderBy(eventWaitlist.position);
    }),

  // Get user's waitlist entries
  getMyWaitlist: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(eventWaitlist)
      .where(eq(eventWaitlist.userId, ctx.user.id))
      .orderBy(desc(eventWaitlist.joinedAt));
  }),

  // Join waitlist
  join: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Check if already on waitlist
      const existing = await db
        .select()
        .from(eventWaitlist)
        .where(
          and(
            eq(eventWaitlist.eventId, input.eventId),
            eq(eventWaitlist.userId, ctx.user.id)
          )
        );

      if (existing.length > 0) {
        throw new Error("Already on waitlist");
      }

      // Get current max position
      const waitlistEntries = await db
        .select()
        .from(eventWaitlist)
        .where(eq(eventWaitlist.eventId, input.eventId));

      const maxPosition = waitlistEntries.reduce(
        (max, entry) => Math.max(max, entry.position || 0),
        0
      );

      const id = createId();
      await db.insert(eventWaitlist).values({
        id,
        eventId: input.eventId,
        userId: ctx.user.id,
        position: maxPosition + 1,
        status: "waiting",
        notes: input.notes,
        joinedAt: new Date(),
        createdAt: new Date(),
      });

      return { id, position: maxPosition + 1 };
    }),

  // Leave waitlist
  leave: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(eventWaitlist).where(eq(eventWaitlist.id, input.id));
      return { success: true };
    }),

  // Offer spot to next person
  offerSpot: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        expiresIn: z.number().optional(), // hours
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Find next waiting person
      const [nextPerson] = await db
        .select()
        .from(eventWaitlist)
        .where(
          and(
            eq(eventWaitlist.eventId, input.eventId),
            eq(eventWaitlist.status, "waiting")
          )
        )
        .orderBy(eventWaitlist.position)
        .limit(1);

      if (!nextPerson) {
        throw new Error("No one on waitlist");
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (input.expiresIn || 24));

      await db
        .update(eventWaitlist)
        .set({
          status: "offered",
          offeredAt: new Date(),
          expiresAt,
        })
        .where(eq(eventWaitlist.id, nextPerson.id));

      return { id: nextPerson.id, userId: nextPerson.userId };
    }),

  // Accept offer
  acceptOffer: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(eventWaitlist)
        .set({
          status: "accepted",
          respondedAt: new Date(),
        })
        .where(eq(eventWaitlist.id, input.id));
      return { success: true };
    }),

  // Decline offer
  declineOffer: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(eventWaitlist)
        .set({
          status: "declined",
          respondedAt: new Date(),
        })
        .where(eq(eventWaitlist.id, input.id));
      return { success: true };
    }),

  // Mark offer as expired
  expireOffer: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(eventWaitlist)
        .set({ status: "expired" })
        .where(eq(eventWaitlist.id, input.id));
      return { success: true };
    }),
});

