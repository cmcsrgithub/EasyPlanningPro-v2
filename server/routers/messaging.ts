import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { messageChannels, messages } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const messagingRouter = router({
  // Channel operations
  listChannels: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(messageChannels)
        .where(eq(messageChannels.eventId, input.eventId))
        .orderBy(messageChannels.createdAt);
    }),

  createChannel: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        isPrivate: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `channel_${Date.now()}`;
      await db.insert(messageChannels).values({
        id,
        eventId: input.eventId,
        name: input.name,
        description: input.description || null,
        isPrivate: input.isPrivate,
        createdBy: ctx.user.id,
      });

      return { id };
    }),

  deleteChannel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete all messages in the channel first
      await db.delete(messages).where(eq(messages.channelId, input.id));
      
      // Then delete the channel
      await db.delete(messageChannels).where(eq(messageChannels.id, input.id));

      return { success: true };
    }),

  // Message operations
  listMessages: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return await db
        .select()
        .from(messages)
        .where(eq(messages.channelId, input.channelId))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit);
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        content: z.string(),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `msg_${Date.now()}`;
      await db.insert(messages).values({
        id,
        channelId: input.channelId,
        senderId: ctx.user.id,
        senderName: ctx.user.name || "Unknown User",
        content: input.content,
        attachmentUrl: input.attachmentUrl || null,
      });

      return { id };
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Only allow deleting own messages
      await db
        .delete(messages)
        .where(
          and(
            eq(messages.id, input.id),
            eq(messages.senderId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});

