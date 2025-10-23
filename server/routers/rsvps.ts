import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { randomBytes } from "crypto";

const rsvpSchema = z.object({
  eventId: z.string(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  status: z.enum(["yes", "no", "maybe"]),
  guestCount: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const rsvpsRouter = router({
  list: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      return await db.getEventRsvps(input.eventId);
    }),

  getByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      return await db.getEventRsvps(input.eventId);
    }),

  getByMember: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .query(async ({ input }) => {
      // For now, return empty array - this would need a proper implementation
      // based on how member RSVPs are tracked
      return [];
    }),

  create: publicProcedure
    .input(rsvpSchema)
    .mutation(async ({ ctx, input }) => {
      const rsvp = {
        id: randomBytes(16).toString("hex"),
        userId: ctx.user?.id,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await db.createRsvp(rsvp);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: rsvpSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateRsvp(input.id, { ...input.data, updatedAt: new Date() });
      return { success: true };
    }),
});

