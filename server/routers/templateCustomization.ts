import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { templateCustomizations } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";

function createId() {
  return randomBytes(16).toString("hex");
}

export const templateCustomizationRouter = router({
  // Get customization for a template
  get: protectedProcedure
    .input(z.object({ templateId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const customization = await db
        .select()
        .from(templateCustomizations)
        .where(
          and(
            eq(templateCustomizations.templateId, input.templateId),
            eq(templateCustomizations.userId, ctx.user.id)
          )
        )
        .limit(1);

      return customization.length > 0 ? customization[0] : null;
    }),

  // Save or update customization
  save: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        eventId: z.string().optional(),
        colorScheme: z.string().default("default"),
        fontFamily: z.string().default("inter"),
        customBackgroundColor: z.string().optional(),
        customFontColor: z.string().optional(),
        customAccentColor: z.string().optional(),
        shareableSlug: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if customization exists
      const existing = await db
        .select()
        .from(templateCustomizations)
        .where(
          and(
            eq(templateCustomizations.templateId, input.templateId),
            eq(templateCustomizations.userId, ctx.user.id)
          )
        )
        .limit(1);

      const customizationData = {
        templateId: input.templateId,
        userId: ctx.user.id,
        eventId: input.eventId || null,
        colorScheme: input.colorScheme,
        fontFamily: input.fontFamily,
        customBackgroundColor: input.customBackgroundColor || null,
        customFontColor: input.customFontColor || null,
        customAccentColor: input.customAccentColor || null,
        shareableSlug:
          input.shareableSlug ||
          `${input.templateId}-${Math.random().toString(36).substring(2, 9)}`,
        isPubliclyAccessible: true,
        updatedAt: new Date(),
      };

      if (existing.length > 0) {
        // Update existing
        await db
          .update(templateCustomizations)
          .set(customizationData)
          .where(eq(templateCustomizations.id, existing[0].id));

        const updated = await db
          .select()
          .from(templateCustomizations)
          .where(eq(templateCustomizations.id, existing[0].id))
          .limit(1);

        return updated[0];
      } else {
        // Create new
        const newId = createId();
        await db.insert(templateCustomizations).values({
          id: newId,
          ...customizationData,
          createdAt: new Date(),
        });

        const created = await db
          .select()
          .from(templateCustomizations)
          .where(eq(templateCustomizations.id, newId))
          .limit(1);

        return created[0];
      }
    }),

  // Get shared template by slug (public access)
  getShared: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const customization = await db
        .select()
        .from(templateCustomizations)
        .where(
          and(
            eq(templateCustomizations.shareableSlug, input.slug),
            eq(templateCustomizations.isPubliclyAccessible, true)
          )
        )
        .limit(1);

      if (customization.length === 0) {
        throw new Error("Template not found");
      }

      return customization[0];
    }),
});

