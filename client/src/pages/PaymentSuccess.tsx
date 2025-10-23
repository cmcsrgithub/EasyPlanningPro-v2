import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const params = useParams();
  const eventId = params.id as string;
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your ticket purchase has been confirmed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address with your ticket details.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and spam folder.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => setLocation(`/events/${eventId}`)}>
              View Event Details
            </Button>
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

