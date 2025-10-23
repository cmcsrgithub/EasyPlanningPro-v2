import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { polls, pollOptions, pollVotes } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const pollsRouter = router({
  /**
   * List all polls (optionally filter by event)
   */
  list: protectedProcedure
    .input(z.object({ eventId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(polls.userId, ctx.user.id)];
      if (input?.eventId) {
        conditions.push(eq(polls.eventId, input.eventId));
      }

      return await db
        .select()
        .from(polls)
        .where(and(...conditions))
        .orderBy(desc(polls.createdAt));
    }),

  /**
   * Get a single poll with options and vote counts
   */
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [poll] = await db
        .select()
        .from(polls)
        .where(eq(polls.id, input.id))
        .limit(1);

      if (!poll) return null;

      const options = await db
        .select()
        .from(pollOptions)
        .where(eq(pollOptions.pollId, input.id))
        .orderBy(pollOptions.order);

      // Get vote counts for each option
      const votes = await db
        .select()
        .from(pollVotes)
        .where(eq(pollVotes.pollId, input.id));

      const optionsWithVotes = options.map((option) => ({
        ...option,
        voteCount: votes.filter((v) => v.optionId === option.id).length,
      }));

      return {
        ...poll,
        options: optionsWithVotes,
        totalVotes: votes.length,
      };
    }),

  /**
   * Create a new poll
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        eventId: z.string().optional(),
        allowMultiple: z.boolean().default(false),
        closesAt: z.date().optional(),
        options: z.array(z.string()).min(2, "At least 2 options required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const pollId = Date.now();

      // Create poll
      await db.insert(polls).values({
        id: pollId,
        userId: ctx.user.id,
        eventId: input.eventId,
        title: input.title,
        description: input.description,
        allowMultiple: input.allowMultiple,
        closesAt: input.closesAt,
      });

      // Create options
      const optionValues = input.options.map((text, index) => ({
        id: Date.now() + index,
        pollId,
        text,
        order: index,
      }));

      await db.insert(pollOptions).values(optionValues);

      return { id: pollId };
    }),

  /**
   * Vote on a poll
   */
  vote: publicProcedure
    .input(
      z.object({
        pollId: z.number(),
        optionIds: z.array(z.number()),
        voterName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get poll to check if multiple votes allowed
      const [poll] = await db
        .select()
        .from(polls)
        .where(eq(polls.id, input.pollId))
        .limit(1);

      if (!poll) throw new Error("Poll not found");
      if (!poll.isActive) throw new Error("Poll is closed");
      if (poll.closesAt && new Date() > poll.closesAt) {
        throw new Error("Poll has expired");
      }

      // Check if already voted (if user is logged in)
      if (ctx.user) {
        const existingVotes = await db
          .select()
          .from(pollVotes)
          .where(
            and(
              eq(pollVotes.pollId, input.pollId),
              eq(pollVotes.userId, ctx.user.id)
            )
          );

        if (existingVotes.length > 0) {
          throw new Error("You have already voted on this poll");
        }
      }

      // Validate option count
      if (!poll.allowMultiple && input.optionIds.length > 1) {
        throw new Error("This poll only allows one selection");
      }

      // Create votes
      const voteValues = input.optionIds.map((optionId, index) => ({
        id: Date.now() + index,
        pollId: input.pollId,
        optionId,
        userId: ctx.user?.id,
        voterName: input.voterName,
      }));

      await db.insert(pollVotes).values(voteValues);

      return { success: true };
    }),

  /**
   * Delete a poll
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete votes first
      await db.delete(pollVotes).where(eq(pollVotes.pollId, input.id));

      // Delete options
      await db.delete(pollOptions).where(eq(pollOptions.pollId, input.id));

      // Delete poll
      await db.delete(polls).where(eq(polls.id, input.id));

      return { success: true };
    }),

  /**
   * Toggle poll active status
   */
  toggleActive: protectedProcedure
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(polls)
        .set({ isActive: input.isActive })
        .where(eq(polls.id, input.id));

      return { success: true };
    }),
});

