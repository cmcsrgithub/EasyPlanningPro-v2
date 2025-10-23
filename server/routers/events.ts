import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { randomBytes } from "crypto";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  eventType: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  location: z.string().optional(),
  venueId: z.string().optional(),
  isPublic: z.boolean().optional(),
  maxAttendees: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
});

export const eventsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserEvents(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getEvent(input.id);
    }),

  create: protectedProcedure
    .input(eventSchema)
    .mutation(async ({ ctx, input }) => {
      const event = {
        id: randomBytes(16).toString("hex"),
        userId: ctx.user.id,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await db.createEvent(event);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: eventSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateEvent(input.id, { ...input.data, updatedAt: new Date() });
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.deleteEvent(input.id);
      return { success: true };
    }),
});

