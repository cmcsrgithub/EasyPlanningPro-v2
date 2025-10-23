import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createStripeCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  SUBSCRIPTION_TIERS,
  canCreateEvent,
  getRemainingEventSlots,
} from "../stripe";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const subscriptionsRouter = router({
  /**
   * Get current user's subscription info
   */
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user) throw new Error("User not found");

    const tier = user.subscriptionTier || "basic";
    const tierInfo = SUBSCRIPTION_TIERS[tier];

    // Count active events for this user
    const eventCount = 0; // TODO: Implement event counting

    return {
      tier,
      tierInfo,
      status: user.subscriptionStatus,
      endsAt: user.subscriptionEndsAt,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      currentEventCount: eventCount,
      remainingSlots: getRemainingEventSlots(tier, eventCount),
      canCreateMore: canCreateEvent(tier, eventCount),
    };
  }),

  /**
   * Create a checkout session to upgrade subscription
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["premium", "pro", "business"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user) throw new Error("User not found");

      // Create Stripe customer if doesn't exist
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await createStripeCustomer({
          email: user.email || "",
          name: user.name || undefined,
          userId: user.id,
        });
        customerId = customer.id;

        // Update user with customer ID
        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, user.id));
      }

      const tierInfo = SUBSCRIPTION_TIERS[input.tier];
      if (!tierInfo.priceId) {
        throw new Error(`Price ID not configured for ${input.tier} tier`);
      }

      // Create checkout session
      const session = await createCheckoutSession({
        customerId,
        priceId: tierInfo.priceId,
        successUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/dashboard?subscription=success`,
        cancelUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/dashboard?subscription=canceled`,
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Create a billing portal session
   */
  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user || !user.stripeCustomerId) {
      throw new Error("No Stripe customer found");
    }

    const session = await createBillingPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/dashboard`,
    });

    return {
      url: session.url,
    };
  }),

  /**
   * Cancel subscription
   */
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user || !user.stripeSubscriptionId) {
      throw new Error("No active subscription found");
    }

    await cancelSubscription(user.stripeSubscriptionId);

    // Update user subscription status
    await db
      .update(users)
      .set({
        subscriptionStatus: "canceled",
        subscriptionTier: "basic",
      })
      .where(eq(users.id, user.id));

    return { success: true };
  }),

  /**
   * Get all available tiers
   */
  getTiers: protectedProcedure.query(() => {
    return Object.entries(SUBSCRIPTION_TIERS).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }),
});

