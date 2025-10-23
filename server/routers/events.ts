import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { randomBytes } from "crypto";
import { canCreateEvent, getRemainingEventSlots, SUBSCRIPTION_TIERS } from "../stripe";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

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
      // Check subscription limits
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const [user] = await database
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user) throw new Error("User not found");

      const tier = user.subscriptionTier || "basic";
      const userEvents = await db.getUserEvents(ctx.user.id);
      const activeEventCount = userEvents.length;

      if (!canCreateEvent(tier, activeEventCount)) {
        const limit = SUBSCRIPTION_TIERS[tier].eventLimit;
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached your event limit (${limit} events). Please upgrade your subscription to create more events.`,
        });
      }

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

  // Export event to calendar
  exportToCalendar: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const event = await db.getEvent(input.id);
      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      const { generateICS, generateCalendarLinks } = await import("../calendar");
      
      // Generate ICS file content
      const icsContent = generateICS(event);
      const icsBase64 = Buffer.from(icsContent).toString("base64");
      const icsDataUrl = `data:text/calendar;base64,${icsBase64}`;

      // Generate calendar links
      const links = generateCalendarLinks(event, icsDataUrl);

      return {
        icsContent,
        icsDataUrl,
        links,
      };
    }),
});
