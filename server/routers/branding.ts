import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { brandingSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const brandingRouter = router({
  // Get branding settings for current user
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const settings = await db
      .select()
      .from(brandingSettings)
      .where(eq(brandingSettings.userId, ctx.user.id))
      .limit(1);

    return settings[0] || null;
  }),

  // Get branding by subdomain (public)
  getBySubdomain: publicProcedure
    .input(z.object({ subdomain: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const settings = await db
        .select()
        .from(brandingSettings)
        .where(eq(brandingSettings.subdomain, input.subdomain))
        .limit(1);

      return settings[0] || null;
    }),

  // Create or update branding settings
  upsert: protectedProcedure
    .input(
      z.object({
        subdomain: z.string().optional(),
        customDomain: z.string().optional(),
        logoUrl: z.string().optional(),
        faviconUrl: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        brandName: z.string().optional(),
        tagline: z.string().optional(),
        customCss: z.string().optional(),
        isWhiteLabel: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if settings exist
      const existing = await db
        .select()
        .from(brandingSettings)
        .where(eq(brandingSettings.userId, ctx.user.id))
        .limit(1);

      if (existing[0]) {
        // Update existing
        const updates: any = {};
        if (input.subdomain !== undefined) updates.subdomain = input.subdomain;
        if (input.customDomain !== undefined) updates.customDomain = input.customDomain;
        if (input.logoUrl !== undefined) updates.logoUrl = input.logoUrl;
        if (input.faviconUrl !== undefined) updates.faviconUrl = input.faviconUrl;
        if (input.primaryColor !== undefined) updates.primaryColor = input.primaryColor;
        if (input.secondaryColor !== undefined) updates.secondaryColor = input.secondaryColor;
        if (input.brandName !== undefined) updates.brandName = input.brandName;
        if (input.tagline !== undefined) updates.tagline = input.tagline;
        if (input.customCss !== undefined) updates.customCss = input.customCss;
        if (input.isWhiteLabel !== undefined) updates.isWhiteLabel = input.isWhiteLabel;

        await db
          .update(brandingSettings)
          .set(updates)
          .where(eq(brandingSettings.userId, ctx.user.id));

        return { id: existing[0].id, updated: true };
      } else {
        // Create new
        const id = `brand_${Date.now()}`;
        await db.insert(brandingSettings).values({
          id,
          userId: ctx.user.id,
          subdomain: input.subdomain || null,
          customDomain: input.customDomain || null,
          logoUrl: input.logoUrl || null,
          faviconUrl: input.faviconUrl || null,
          primaryColor: input.primaryColor || "#00AEEF",
          secondaryColor: input.secondaryColor || null,
          brandName: input.brandName || null,
          tagline: input.tagline || null,
          customCss: input.customCss || null,
          isWhiteLabel: input.isWhiteLabel || false,
        });

        return { id, created: true };
      }
    }),

  // Check subdomain availability
  checkSubdomain: publicProcedure
    .input(z.object({ subdomain: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(brandingSettings)
        .where(eq(brandingSettings.subdomain, input.subdomain))
        .limit(1);

      return { available: !existing[0] };
    }),
});

