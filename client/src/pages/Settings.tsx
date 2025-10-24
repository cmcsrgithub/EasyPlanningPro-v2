import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CreditCard, Crown, Zap, Building2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const tierIcons = {
  basic: Crown,
  premium: Zap,
  pro: Zap,
  business: Building2,
  enterprise: Building2,
};

const tierColors = {
  basic: "bg-gray-100 text-gray-800",
  premium: "bg-orange-100 text-orange-800",
  pro: "bg-cyan-100 text-cyan-800",
  business: "bg-purple-100 text-purple-800",
  enterprise: "bg-blue-100 text-blue-800",
};

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const { data: subscription, isLoading } = trpc.subscriptions.getCurrent.useQuery();
  const { data: tiers } = trpc.subscriptions.getTiers.useQuery();

  const createCheckoutMutation = trpc.subscriptions.createCheckout.useMutation({
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (!stripe || !data.sessionId) {
        toast.error("Failed to initialize Stripe");
        return;
      }
      // Use window.location instead of deprecated redirectToCheckout
      window.location.href = data.url || `/checkout?session_id=${data.sessionId}`;
    },
    onError: (error) => {
      toast.error(`Failed to start checkout: ${error.message}`);
    },
  });

  const createPortalMutation = trpc.subscriptions.createPortal.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(`Failed to open billing portal: ${error.message}`);
    },
  });

  const handleUpgrade = (tier: "premium" | "pro" | "business") => {
    createCheckoutMutation.mutate({ tier });
  };

  const handleManageBilling = () => {
    createPortalMutation.mutate();
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const currentTier = subscription?.tier || "basic";
  const TierIcon = tierIcons[currentTier];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and account settings</p>
        </div>

        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${tierColors[currentTier]}`}>
                  <TierIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold capitalize">{currentTier}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.tierInfo.eventLimit === Infinity
                      ? "Unlimited events"
                      : `Up to ${subscription?.tierInfo.eventLimit} simultaneous events`}
                  </p>
                </div>
              </div>
              {currentTier !== "basic" && (
                <Button variant="outline" onClick={handleManageBilling}>
                  Manage Billing
                </Button>
              )}
            </div>

            {/* Usage */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Event Usage</span>
                <span className="text-sm text-muted-foreground">
                  {subscription?.currentEventCount || 0} of{" "}
                  {subscription?.tierInfo.eventLimit === Infinity
                    ? "∞"
                    : subscription?.tierInfo.eventLimit}{" "}
                  events
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{
                    width: `${
                      subscription?.tierInfo.eventLimit === Infinity
                        ? 0
                        : ((subscription?.currentEventCount || 0) /
                            (subscription?.tierInfo.eventLimit || 1)) *
                          100
                    }%`,
                  }}
                />
              </div>
              {subscription?.remainingSlots !== undefined &&
                subscription.remainingSlots !== Infinity && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {subscription.remainingSlots} event slots remaining
                  </p>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        {currentTier !== "enterprise" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tiers
                ?.filter((tier) => tier.id !== "basic" && tier.id !== "enterprise")
                .map((tier) => {
                  const Icon = tierIcons[tier.id as keyof typeof tierIcons];
                  const isCurrentTier = tier.id === currentTier;
                  const price = tier.price ? (tier.price / 100).toFixed(2) : null;

                  return (
                    <Card
                      key={tier.id}
                      className={`relative ${
                        isCurrentTier ? "border-primary border-2" : ""
                      }`}
                    >
                      {isCurrentTier && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                          Current Plan
                        </Badge>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="capitalize">{tier.name}</CardTitle>
                        </div>
                        {price && (
                          <div className="text-3xl font-bold">
                            ${price}
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {tier.features.slice(0, 5).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {tier.features.length > 5 && (
                            <li className="text-sm text-muted-foreground">
                              + {tier.features.length - 5} more features
                            </li>
                          )}
                        </ul>
                        {!isCurrentTier && (
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleUpgrade(tier.id as "premium" | "pro" | "business")
                            }
                            disabled={createCheckoutMutation.isPending}
                          >
                            {createCheckoutMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              `Upgrade to ${tier.name}`
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* Enterprise CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Need More?</h3>
              <p className="text-muted-foreground">
                Contact us for Enterprise plans with unlimited events and custom features
              </p>
            </div>
            <Button size="lg" variant="default">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

