import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ eventId, ticketType, amount, eventTitle }: {
  eventId: string;
  ticketType: string;
  amount: number;
  eventTitle: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [quantity, setQuantity] = useState(1);

  const createPayment = trpc.payments.createPaymentIntent.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!attendeeName || !attendeeEmail) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPayment.mutateAsync({
        eventId,
        amount: amount * quantity * 100, // Convert to cents
        ticketType,
        quantity,
        attendeeName,
        attendeeEmail,
      });

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret!,
        confirmParams: {
          return_url: `${window.location.origin}/events/${eventId}/payment-success`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Your Name</label>
          <Input
            placeholder="John Doe"
            value={attendeeName}
            onChange={(e) => setAttendeeName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Your Email</label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={attendeeEmail}
            onChange={(e) => setAttendeeEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Ticket Price:</span>
          <span>${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Quantity:</span>
          <span>{quantity}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>${(amount * quantity).toFixed(2)}</span>
        </div>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(amount * quantity).toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment is secure and encrypted
      </p>
    </form>
  );
}

export default function EventCheckout() {
  const params = useParams();
  const eventId = params.id as string;
  const [, setLocation] = useLocation();

  // Get ticket info from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const ticketType = searchParams.get("ticket") || "General Admission";
  const amount = parseFloat(searchParams.get("amount") || "0");

  const { data: event, isLoading } = trpc.events.get.useQuery({ id: eventId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>The event you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (amount <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Ticket</CardTitle>
            <CardDescription>Please select a valid ticket type.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation(`/events/${eventId}`)}>
              Back to Event
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => setLocation(`/events/${eventId}`)}
          className="mb-6"
        >
          ← Back to Event
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <CardDescription>
              {event.title} - {ticketType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                eventId={eventId}
                ticketType={ticketType}
                amount={amount}
                eventTitle={event.title}
              />
            </Elements>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Questions? Contact the event organizer</p>
        </div>
      </div>
    </div>
  );
}

