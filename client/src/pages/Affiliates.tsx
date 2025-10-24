import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Gift,
  HeadphonesIcon,
  CheckCircle2,
} from "lucide-react";

export default function Affiliates() {
  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Earn Recurring Revenue with EasyPlanningPro
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of affiliates earning recurring commissions by helping people plan amazing events. 
            Promote the leading event planning platform and earn 20% on every referral.
          </p>
          <Button size="lg" className="mt-4">
            Apply Now - It's Free
          </Button>
        </div>

        {/* Commission Structure */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Commission Structure</h2>
            <p className="text-muted-foreground mt-2">Both Monthly & Annual Plans</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Premium Plan */}
            <Card className="border-2 hover:border-cyan-500 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <CardDescription>
                  Monthly: $19.99 | Annual: $199
                </CardDescription>
                <Badge className="mx-auto mt-2 bg-orange-500">20% Commission</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">Monthly: $3.99</p>
                  <p className="text-sm text-muted-foreground">per monthly subscription</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">Annual: $39.80</p>
                  <p className="text-sm text-muted-foreground">per annual subscription</p>
                </div>
                <p className="text-xs text-muted-foreground pt-4">
                  Recurring income for subscription lifetime
                </p>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-cyan-500 shadow-lg scale-105">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <CardDescription>
                  Monthly: $59.99 | Annual: $599
                </CardDescription>
                <Badge className="mx-auto mt-2 bg-orange-500">20% Commission</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">Monthly: $11.99</p>
                  <p className="text-sm text-muted-foreground">per monthly subscription</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">Annual: $119.80</p>
                  <p className="text-sm text-muted-foreground">per annual subscription</p>
                </div>
                <p className="text-xs text-muted-foreground pt-4">
                  Recurring income for subscription lifetime
                </p>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="border-2 hover:border-cyan-500 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Business Plan</CardTitle>
                <CardDescription>
                  Monthly: $129.99 | Annual: $1,299
                </CardDescription>
                <Badge className="mx-auto mt-2 bg-orange-500">20% Commission</Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">Monthly: $25.99</p>
                  <p className="text-sm text-muted-foreground">per monthly subscription</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">Annual: $259.80</p>
                  <p className="text-sm text-muted-foreground">per annual subscription</p>
                </div>
                <p className="text-xs text-muted-foreground pt-4">
                  Recurring income for subscription lifetime
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6 text-center">
              <p className="text-lg">
                💡 <strong>Pro Tip:</strong> Annual subscriptions earn you 10x more per referral!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Examples */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Monthly Subscription Earnings Examples</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-cyan-600">5 Monthly Referrals</CardTitle>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>3x Premium Monthly</span>
                  <span>$11.97</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2x Pro Monthly</span>
                  <span>$23.98</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Monthly Earnings:</span>
                    <span className="text-green-600">$35.95</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-cyan-600">15 Monthly Referrals</CardTitle>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>8x Premium Monthly</span>
                  <span>$31.92</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>5x Pro Monthly</span>
                  <span>$59.95</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2x Business Monthly</span>
                  <span>$51.98</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Monthly Earnings:</span>
                    <span className="text-green-600">$143.85</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-cyan-600">50 Monthly Referrals</CardTitle>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>25x Premium Monthly</span>
                  <span>$99.75</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>20x Pro Monthly</span>
                  <span>$239.80</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>5x Business Monthly</span>
                  <span>$129.95</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Monthly Earnings:</span>
                    <span className="text-green-600">$469.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Annual Subscription Earnings Examples</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">5 Annual Referrals</CardTitle>
                <CardDescription>per year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>3x Premium Annual</span>
                  <span>$119.40</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2x Pro Annual</span>
                  <span>$239.60</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Annual Earnings:</span>
                    <span className="text-blue-600">$359.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-600">15 Annual Referrals</CardTitle>
                <CardDescription>per year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>8x Premium Annual</span>
                  <span>$318.40</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>5x Pro Annual</span>
                  <span>$599.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2x Business Annual</span>
                  <span>$519.60</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Annual Earnings:</span>
                    <span className="text-blue-600">$1,437.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">50 Annual Referrals</CardTitle>
                <CardDescription>per year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>25x Premium Annual</span>
                  <span>$995.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>20x Pro Annual</span>
                  <span>$2,396.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>5x Business Annual</span>
                  <span>$1,299.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Annual Earnings:</span>
                    <span className="text-blue-600">$4,690.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-cyan-200 dark:border-cyan-800">
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-lg font-semibold">
                🚀 Mix of Monthly & Annual Referrals?
              </p>
              <p className="text-base">
                Most successful affiliates earn <strong className="text-cyan-600">$3,000-8,000+ per month</strong> by promoting both billing options. 
                Annual plans provide significantly higher commissions per referral!
              </p>
              <p className="text-sm text-muted-foreground">
                *Earnings potential increases with subscriber retention and plan upgrades.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Join Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Join Our Affiliate Program?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>20% Commission Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn 20% on every successful referral across all plan tiers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Monthly Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive your earnings via Stripe Connect on the 1st of each month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your clicks, conversions, and earnings in your dashboard
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Marketing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access banners, email templates, and promotional materials
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Gift className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Lifetime Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn commissions for as long as your referrals remain subscribed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HeadphonesIcon className="h-8 w-8 text-cyan-600 mb-2" />
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get help from our affiliate success team when you need it
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Get Started */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">How to Get Started</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Apply to Join",
                description: "Complete our simple affiliate application form with your details and promotional strategy.",
              },
              {
                step: "02",
                title: "Get Approved",
                description: "Our team reviews your application and approves qualified affiliates within 24-48 hours.",
              },
              {
                step: "03",
                title: "Set Up Payments",
                description: "Connect your Stripe account to receive monthly commission payments securely.",
              },
              {
                step: "04",
                title: "Start Promoting",
                description: "Use your unique referral links and marketing materials to promote EasyPlanningPro.",
              },
              {
                step: "05",
                title: "Earn Commissions",
                description: "Receive 20% commission on every successful referral for the lifetime of their subscription.",
              },
            ].map((item) => (
              <Card key={item.step} className="hover:border-cyan-500 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-cyan-600">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-cyan-600">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketing Materials */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Marketing Materials</h2>
            <p className="text-muted-foreground mt-2">Everything you need to succeed</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold mb-2">Banner Ads</h3>
                <p className="text-sm text-muted-foreground">Multiple sizes and designs</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="font-semibold mb-2">Email Templates</h3>
                <p className="text-sm text-muted-foreground">Ready-to-send campaigns</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold mb-2">Social Graphics</h3>
                <p className="text-sm text-muted-foreground">Instagram, Facebook, Twitter</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold mb-2">Landing Pages</h3>
                <p className="text-sm text-muted-foreground">High-converting templates</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>When do I get paid?</AccordionTrigger>
              <AccordionContent>
                Payments are processed on the 1st of each month via Stripe Connect. You'll receive your earnings for all referrals from the previous month. Minimum payout threshold is $50.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How long do I earn commissions?</AccordionTrigger>
              <AccordionContent>
                You earn lifetime recurring commissions! As long as your referral remains an active subscriber, you'll continue to receive 20% commission every month or year (depending on their billing cycle).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Do I earn more from annual subscriptions?</AccordionTrigger>
              <AccordionContent>
                Yes! Annual subscriptions provide 10x more commission per referral compared to monthly subscriptions. For example, a Pro annual subscription earns you $119.80 vs. $11.99 for monthly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I promote on social media?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We encourage promotion on all social media platforms. We provide ready-made graphics and content for Instagram, Facebook, Twitter, LinkedIn, and more.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Is there a signup fee?</AccordionTrigger>
              <AccordionContent>
                No! Joining our affiliate program is completely free. There are no signup fees, monthly fees, or hidden costs. You simply earn commissions on successful referrals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What's the difference between monthly and annual commissions?</AccordionTrigger>
              <AccordionContent>
                Monthly commissions are paid every month as long as the subscriber maintains their monthly plan. Annual commissions are paid once per year when the subscriber renews their annual plan. Both are recurring - you continue earning as long as they remain subscribed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
          <CardContent className="p-12 text-center space-y-4">
            <h2 className="text-4xl font-bold">Ready to Start Earning?</h2>
            <p className="text-xl opacity-90">
              Join our affiliate program today and start earning 20% commission on every referral.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary">
                Apply Now - Free to Join
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                Contact Affiliate Team
              </Button>
            </div>
            <p className="text-sm opacity-75 pt-4">
              Questions? Email us at affiliates@easyplanningpro.com
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

