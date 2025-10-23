import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { randomBytes } from "crypto";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  description: z.string().optional(),
  amenities: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const venuesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserVenues(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getVenue(input.id);
    }),

  create: protectedProcedure
    .input(venueSchema)
    .mutation(async ({ ctx, input }) => {
      const venue = {
        id: randomBytes(16).toString("hex"),
        userId: ctx.user.id,
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await db.createVenue(venue);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: venueSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      await db.updateVenue(input.id, { ...input.data, updatedAt: new Date() });
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.deleteVenue(input.id);
      return { success: true };
    }),
});

