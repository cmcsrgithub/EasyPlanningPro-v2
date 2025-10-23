import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Subscription tier configuration
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: "Basic",
    price: 0,
    eventLimit: 1,
    features: [
      "1 Event",
      "Event Management",
      "Venue Management",
      "Activities Management",
      "Event Information Page",
      "1 Administrator Account",
    ],
  },
  premium: {
    name: "Premium",
    price: 1999, // $19.99 in cents
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
    eventLimit: 2,
    features: [
      "2 Simultaneous Events",
      "Everything in Basic",
      "Photo Gallery",
      "RSVP Functionality",
      "Calendar Integration",
      "Payment Collection",
      "Polls & Surveys",
      "Up to 2 Administrator Accounts",
    ],
  },
  pro: {
    name: "Pro",
    price: 5999, // $59.99 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    eventLimit: 5,
    features: [
      "5 Simultaneous Events",
      "Everything in Premium",
      "Private Group Messaging",
      "Multi-Event Itinerary & Ticketing",
      "Advanced Task Management & Assignments",
      "Custom Subdomain Branding",
      "Detailed Financial Reporting & Export",
      "Up to 5 Administrator Accounts",
    ],
  },
  business: {
    name: "Business",
    price: 12999, // $129.99 in cents
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || "",
    eventLimit: 10,
    features: [
      "10 Simultaneous Events",
      "Everything in Pro",
      "Customizable Registration Forms",
      "Attendee Data Export (CSV)",
      "Sponsor Management & Showcase",
      "Donation & Fundraising Tools",
      "Advanced Event Analytics",
      "Up to 10 Administrator Accounts",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: null,
    eventLimit: Infinity,
    features: [
      "Unlimited Events",
      "Everything in Business",
      "Unlimited Administrator Accounts",
      "Dedicated Account Manager & Premium Support (SLAs)",
      "API Access for Custom Integrations",
      "White-label Solutions",
      "Custom Training & Onboarding",
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

/**
 * Create a Stripe customer for a user
 */
export async function createStripeCustomer(params: {
  email: string;
  name?: string;
  userId: string;
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      userId: params.userId,
    },
  });

  return customer;
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session;
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

/**
 * Check if user can create more events based on their subscription tier
 */
export function canCreateEvent(
  tier: SubscriptionTier,
  currentEventCount: number
): boolean {
  const limit = SUBSCRIPTION_TIERS[tier].eventLimit;
  return currentEventCount < limit;
}

/**
 * Get remaining event slots for a user
 */
export function getRemainingEventSlots(
  tier: SubscriptionTier,
  currentEventCount: number
): number {
  const limit = SUBSCRIPTION_TIERS[tier].eventLimit;
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentEventCount);
}

