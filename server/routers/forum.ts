import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { forumTopics, forumReplies } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const forumRouter = router({
  // Topics
  listTopics: protectedProcedure
    .input(z.object({ eventId: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      if (input.eventId) {
        return await db
          .select()
          .from(forumTopics)
          .where(eq(forumTopics.eventId, input.eventId))
          .orderBy(desc(forumTopics.isPinned), desc(forumTopics.createdAt));
      }
      
      return await db
        .select()
        .from(forumTopics)
        .orderBy(desc(forumTopics.isPinned), desc(forumTopics.createdAt));
    }),

  getTopicById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Increment view count
      const [topic] = await db
        .select()
        .from(forumTopics)
        .where(eq(forumTopics.id, input.id));
      
      if (topic) {
        await db
          .update(forumTopics)
          .set({ viewCount: (topic.viewCount || 0) + 1 })
          .where(eq(forumTopics.id, input.id));
      }
      
      return topic;
    }),

  createTopic: protectedProcedure
    .input(
      z.object({
        eventId: z.string().optional(),
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      await db.insert(forumTopics).values({
        id,
        ...input,
        authorId: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id };
    }),

  updateTopic: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        isPinned: z.boolean().optional(),
        isLocked: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db
        .update(forumTopics)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(forumTopics.id, id));
      return { success: true };
    }),

  deleteTopic: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(forumTopics).where(eq(forumTopics.id, input.id));
      return { success: true };
    }),

  // Replies
  getRepliesByTopic: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      return await db
        .select()
        .from(forumReplies)
        .where(eq(forumReplies.topicId, input.topicId))
        .orderBy(forumReplies.createdAt);
    }),

  createReply: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const id = createId();
      
      // Create reply
      await db.insert(forumReplies).values({
        id,
        ...input,
        authorId: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Update topic reply count and last reply time
      const [topic] = await db
        .select()
        .from(forumTopics)
        .where(eq(forumTopics.id, input.topicId));
      
      if (topic) {
        await db
          .update(forumTopics)
          .set({
            replyCount: (topic.replyCount || 0) + 1,
            lastReplyAt: new Date(),
          })
          .where(eq(forumTopics.id, input.topicId));
      }
      
      return { id };
    }),

  deleteReply: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(forumReplies).where(eq(forumReplies.id, input.id));
      return { success: true };
    }),
});

