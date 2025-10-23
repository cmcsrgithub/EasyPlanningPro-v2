import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { albums } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const albumsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const result = await db
      .select()
      .from(albums)
      .where(eq(albums.userId, ctx.user.id))
      .orderBy(albums.createdAt);

    return result;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        eventId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = Date.now();
      await db.insert(albums).values({
        id,
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        eventId: input.eventId,
      });

      return { id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(albums)
        .where(eq(albums.id, input.id));

      return { success: true };
    }),
});

