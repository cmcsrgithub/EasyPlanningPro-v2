import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { travelArrangements, accommodations } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const travelRouter = router({
  // Travel Arrangements
  listTravelByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(travelArrangements)
        .where(eq(travelArrangements.eventId, input.eventId));
    }),

  getMyTravel: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(travelArrangements)
      .where(eq(travelArrangements.userId, ctx.user.id));
  }),

  createTravel: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        travelType: z.enum(["flight", "train", "bus", "car", "other"]),
        departureLocation: z.string().optional(),
        arrivalLocation: z.string().optional(),
        departureTime: z.date().optional(),
        arrivalTime: z.date().optional(),
        confirmationNumber: z.string().optional(),
        carrier: z.string().optional(),
        cost: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["planned", "booked", "confirmed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(travelArrangements).values({
        id,
        ...input,
        userId: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id };
    }),

  updateTravel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        travelType: z.enum(["flight", "train", "bus", "car", "other"]).optional(),
        departureLocation: z.string().optional(),
        arrivalLocation: z.string().optional(),
        departureTime: z.date().optional(),
        arrivalTime: z.date().optional(),
        confirmationNumber: z.string().optional(),
        carrier: z.string().optional(),
        cost: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["planned", "booked", "confirmed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db
        .update(travelArrangements)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(travelArrangements.id, id));
      return { success: true };
    }),

  deleteTravel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(travelArrangements).where(eq(travelArrangements.id, input.id));
      return { success: true };
    }),

  // Accommodations
  listAccommodationsByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(accommodations)
        .where(eq(accommodations.eventId, input.eventId));
    }),

  getMyAccommodations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.userId, ctx.user.id));
  }),

  createAccommodation: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string(),
        address: z.string().optional(),
        checkInDate: z.date().optional(),
        checkOutDate: z.date().optional(),
        confirmationNumber: z.string().optional(),
        roomType: z.string().optional(),
        cost: z.string().optional(),
        contactPhone: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["planned", "booked", "confirmed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(accommodations).values({
        id,
        ...input,
        userId: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id };
    }),

  updateAccommodation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        address: z.string().optional(),
        checkInDate: z.date().optional(),
        checkOutDate: z.date().optional(),
        confirmationNumber: z.string().optional(),
        roomType: z.string().optional(),
        cost: z.string().optional(),
        contactPhone: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["planned", "booked", "confirmed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db
        .update(accommodations)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(accommodations.id, id));
      return { success: true };
    }),

  deleteAccommodation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(accommodations).where(eq(accommodations.id, input.id));
      return { success: true };
    }),
});

