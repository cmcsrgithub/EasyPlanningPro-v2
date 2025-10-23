import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../stripe";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return res.status(500).send("Database error");
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (!user) {
          console.error(`User not found for customer ${customerId}`);
          break;
        }

        // Determine tier from price ID
        let tier: "basic" | "premium" | "pro" | "business" | "enterprise" = "basic";
        const priceId = subscription.items.data[0]?.price.id;

        if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
          tier = "premium";
        } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = "pro";
        } else if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) {
          tier = "business";
        }

        // Update user subscription
        await db
          .update(users)
          .set({
            subscriptionTier: tier,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status as any,
            subscriptionEndsAt: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          })
          .where(eq(users.id, user.id));

        console.log(`Updated subscription for user ${user.id} to ${tier}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (!user) {
          console.error(`User not found for customer ${customerId}`);
          break;
        }

        // Downgrade to basic
        await db
          .update(users)
          .set({
            subscriptionTier: "basic",
            subscriptionStatus: "canceled",
            subscriptionEndsAt: null,
          })
          .where(eq(users.id, user.id));

        console.log(`Downgraded user ${user.id} to basic`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user) {
          await db
            .update(users)
            .set({
              subscriptionStatus: "past_due",
            })
            .where(eq(users.id, user.id));

          console.log(`Payment failed for user ${user.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    res.status(500).send(`Webhook processing error: ${error.message}`);
  }
}

