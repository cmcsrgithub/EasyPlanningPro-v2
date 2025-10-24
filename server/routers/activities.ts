import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { activities, activityRegistrations } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const activitiesRouter = router({
  // List all activities
  list: protectedProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new Error("Database not available");
    return await db.select().from(activities).orderBy(desc(activities.startTime));
  }),

  // List activities by event
  listByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(activities)
        .where(eq(activities.eventId, input.eventId))
        .orderBy(activities.startTime);
    }),

  // Get activity by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [activity] = await db
        .select()
        .from(activities)
        .where(eq(activities.id, input.id));
      return activity;
    }),

  // Create activity
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        activityType: z.string().optional(),
        startTime: z.date(),
        endTime: z.date(),
        venueId: z.string().optional(),
        location: z.string().optional(),
        capacity: z.number().optional(),
        registrationRequired: z.boolean().optional(),
        registrationDeadline: z.date().optional(),
        price: z.string().optional(),
        organizerId: z.string().optional(),
        organizerName: z.string().optional(),
        materials: z.string().optional(),
        equipment: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(activities).values({
        id,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id };
    }),

  // Update activity
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        eventId: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        activityType: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        venueId: z.string().optional(),
        location: z.string().optional(),
        capacity: z.number().optional(),
        registrationRequired: z.boolean().optional(),
        registrationDeadline: z.date().optional(),
        price: z.string().optional(),
        organizerId: z.string().optional(),
        organizerName: z.string().optional(),
        materials: z.string().optional(),
        equipment: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "cancelled", "completed"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db
        .update(activities)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(activities.id, id));
      return { success: true };
    }),

  // Delete activity
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Delete registrations first
      await db
        .delete(activityRegistrations)
        .where(eq(activityRegistrations.activityId, input.id));
      
      // Delete activity
      await db.delete(activities).where(eq(activities.id, input.id));
      return { success: true };
    }),

  // Register for activity
  register: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        memberId: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(activityRegistrations).values({
        id,
        activityId: input.activityId,
        userId: ctx.user.id,
        memberId: input.memberId,
        notes: input.notes,
        registeredAt: new Date(),
        createdAt: new Date(),
      });
      return { id };
    }),

  // Cancel registration
  cancelRegistration: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(activityRegistrations)
        .set({ status: "cancelled" })
        .where(eq(activityRegistrations.id, input.id));
      return { success: true };
    }),

  // Get registrations for activity
  getRegistrations: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(activityRegistrations)
        .where(eq(activityRegistrations.activityId, input.activityId));
    }),

  // Get user's registrations
  getMyRegistrations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
      if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(activityRegistrations)
      .where(eq(activityRegistrations.userId, ctx.user.id));
  }),
});

