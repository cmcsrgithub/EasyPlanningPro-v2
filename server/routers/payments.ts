import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eventPayments, events } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const paymentsRouter = router({
  /**
   * Create payment intent for event registration
   */
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        amount: z.number().min(50), // Minimum $0.50
        ticketType: z.string().optional(),
        quantity: z.number().default(1),
        attendeeName: z.string().min(1),
        attendeeEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get event details
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .limit(1);

      if (!event) throw new Error("Event not found");

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: input.amount,
        currency: "usd",
        metadata: {
          eventId: input.eventId,
          eventTitle: event.title,
          ticketType: input.ticketType || "general",
          quantity: input.quantity.toString(),
          attendeeName: input.attendeeName,
          attendeeEmail: input.attendeeEmail,
        },
      });

      // Create payment record
      const paymentId = `pay_${Date.now()}`;
      await db.insert(eventPayments).values({
        id: paymentId,
        eventId: input.eventId,
        userId: ctx.user?.id,
        attendeeName: input.attendeeName,
        attendeeEmail: input.attendeeEmail,
        amount: input.amount,
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
        ticketType: input.ticketType,
        quantity: input.quantity,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId,
      };
    }),

  /**
   * Get payment details
   */
  getPayment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [payment] = await db
        .select()
        .from(eventPayments)
        .where(eq(eventPayments.id, input.id))
        .limit(1);

      return payment;
    }),

  /**
   * List payments for an event
   */
  listEventPayments: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      // Verify user owns the event
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .limit(1);

      if (!event || event.userId !== ctx.user.id) {
        throw new Error("Not authorized");
      }

      return await db
        .select()
        .from(eventPayments)
        .where(eq(eventPayments.eventId, input.eventId));
    }),

  /**
   * Get payment statistics for an event
   */
  getEventPaymentStats: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      // Verify user owns the event
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId))
        .limit(1);

      if (!event || event.userId !== ctx.user.id) {
        throw new Error("Not authorized");
      }

      const payments = await db
        .select()
        .from(eventPayments)
        .where(eq(eventPayments.eventId, input.eventId));

      const succeeded = payments.filter((p) => p.status === "succeeded");
      const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount, 0);
      const totalTickets = succeeded.reduce((sum, p) => sum + (p.quantity || 1), 0);

      return {
        totalPayments: payments.length,
        successfulPayments: succeeded.length,
        totalRevenue,
        totalTickets,
        averageTicketPrice: totalTickets > 0 ? totalRevenue / totalTickets : 0,
      };
    }),

  /**
   * Refund a payment
   */
  refundPayment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get payment
      const [payment] = await db
        .select()
        .from(eventPayments)
        .where(eq(eventPayments.id, input.id))
        .limit(1);

      if (!payment) throw new Error("Payment not found");

      // Verify user owns the event
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, payment.eventId))
        .limit(1);

      if (!event || event.userId !== ctx.user.id) {
        throw new Error("Not authorized");
      }

      if (payment.status !== "succeeded") {
        throw new Error("Can only refund successful payments");
      }

      // Create refund in Stripe
      await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId!,
      });

      // Update payment status
      await db
        .update(eventPayments)
        .set({ status: "refunded" })
        .where(eq(eventPayments.id, input.id));

      return { success: true };
    }),
});

