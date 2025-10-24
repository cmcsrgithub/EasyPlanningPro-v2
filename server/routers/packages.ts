import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eventPackages, packageEvents, packagePurchases, events } from "../../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";

export const packagesRouter = router({
  // List all active packages
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return await db
      .select()
      .from(eventPackages)
      .where(eq(eventPackages.isActive, true))
      .orderBy(eventPackages.createdAt);
  }),

  // Get package by ID with events
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const pkg = await db
        .select()
        .from(eventPackages)
        .where(eq(eventPackages.id, input.id))
        .limit(1);

      if (!pkg[0]) throw new Error("Package not found");

      // Get events in this package
      const pkgEvents = await db
        .select()
        .from(packageEvents)
        .where(eq(packageEvents.packageId, input.id))
        .orderBy(packageEvents.orderIndex);

      const eventIds = pkgEvents.map((pe) => pe.eventId);
      let packageEventsList: any[] = [];

      if (eventIds.length > 0) {
        packageEventsList = await db
          .select()
          .from(events)
          .where(inArray(events.id, eventIds));
      }

      return {
        ...pkg[0],
        events: packageEventsList,
      };
    }),

  // Create package
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        price: z.number(),
        eventIds: z.array(z.string()),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `pkg_${Date.now()}`;
      
      // Create package
      await db.insert(eventPackages).values({
        id,
        userId: ctx.user.id,
        title: input.title,
        description: input.description || null,
        price: input.price.toString(),
        imageUrl: input.imageUrl || null,
        isActive: true,
      });

      // Add events to package
      for (let i = 0; i < input.eventIds.length; i++) {
        await db.insert(packageEvents).values({
          id: `pkgevt_${Date.now()}_${i}`,
          packageId: id,
          eventId: input.eventIds[i],
          orderIndex: i,
        });
      }

      return { id };
    }),

  // Update package
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        eventIds: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updates: any = {};
      if (input.title) updates.title = input.title;
      if (input.description !== undefined) updates.description = input.description;
      if (input.price !== undefined) updates.price = input.price.toString();
      if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;
      if (input.isActive !== undefined) updates.isActive = input.isActive;

      await db.update(eventPackages).set(updates).where(eq(eventPackages.id, input.id));

      // Update events if provided
      if (input.eventIds) {
        // Delete existing events
        await db.delete(packageEvents).where(eq(packageEvents.packageId, input.id));

        // Add new events
        for (let i = 0; i < input.eventIds.length; i++) {
          await db.insert(packageEvents).values({
            id: `pkgevt_${Date.now()}_${i}`,
            packageId: input.id,
            eventId: input.eventIds[i],
            orderIndex: i,
          });
        }
      }

      return { success: true };
    }),

  // Delete package
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete package events
      await db.delete(packageEvents).where(eq(packageEvents.packageId, input.id));

      // Delete package
      await db.delete(eventPackages).where(eq(eventPackages.id, input.id));

      return { success: true };
    }),

  // Purchase package
  purchase: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
        amount: z.number(),
        stripePaymentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const id = `pkgpur_${Date.now()}`;
      const qrCode = `PKG-${id}-${ctx.user.id}`;

      await db.insert(packagePurchases).values({
        id,
        packageId: input.packageId,
        userId: ctx.user.id,
        userName: ctx.user.name || null,
        userEmail: ctx.user.email || null,
        amount: input.amount.toString(),
        stripePaymentId: input.stripePaymentId || null,
        status: "completed",
        qrCode,
      });

      return { id, qrCode };
    }),

  // Get user's purchased packages
  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return await db
      .select()
      .from(packagePurchases)
      .where(eq(packagePurchases.userId, ctx.user.id))
      .orderBy(packagePurchases.purchasedAt);
  }),
});

