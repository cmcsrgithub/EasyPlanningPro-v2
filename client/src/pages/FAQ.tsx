import DashboardLayout from "@/components/DashboardLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What is EasyPlanningPro?",
      answer:
        "EasyPlanningPro is a comprehensive event planning and management platform that helps you create, manage, and promote events of all sizes. From registration to analytics, we provide all the tools you need in one place.",
    },
    {
      question: "How much does it cost?",
      answer:
        "We offer multiple pricing tiers to fit your needs: Basic (Free), Premium ($19.99/mo), Pro ($49.99/mo), and Business ($129.99/mo). Each tier includes different features and capabilities. Visit our pricing page for detailed information.",
    },
    {
      question: "Can I try it for free?",
      answer:
        "Yes! Our Basic plan is completely free and includes core event management features. You can upgrade to a paid plan anytime to unlock advanced features like financial reporting, custom branding, and more.",
    },
    {
      question: "How do I create an event?",
      answer:
        "Creating an event is easy! Click the 'Create Event' button from your dashboard, fill in the event details (title, date, location, description), and publish. You can then add activities, manage registrations, and track attendance.",
    },
    {
      question: "Can I sell tickets through the platform?",
      answer:
        "Yes! Our ticketing system allows you to create different ticket types, set prices, and collect payments securely through Stripe. You can also offer early bird pricing and group discounts.",
    },
    {
      question: "How do attendees register for events?",
      answer:
        "Attendees can browse events, view details, and register directly through the platform. They'll receive confirmation emails and can manage their registrations from their account dashboard.",
    },
    {
      question: "Can I customize the look of my event pages?",
      answer:
        "Yes! Pro and Business plans include custom branding features. You can add your logo, choose color schemes, use custom domains, and even add custom CSS for complete control over the appearance.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Our platform is fully mobile-responsive, so you can access all features from any device through your web browser. We're also working on native mobile apps for iOS and Android.",
    },
    {
      question: "How do I track event analytics?",
      answer:
        "Our analytics dashboard provides insights into registrations, attendance, revenue, and engagement. Business plan users get access to advanced analytics with custom reports and data export.",
    },
    {
      question: "Can I manage multiple events?",
      answer:
        "Absolutely! You can create and manage unlimited events across all plans. Use our dashboard to switch between events and view aggregate statistics.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe integration. Some plans also support PayPal and bank transfers.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period. No refunds are provided for partial months.",
    },
    {
      question: "Do you offer customer support?",
      answer:
        "Yes! All users have access to email support. Premium and higher plans include priority support with faster response times. Business plan users get dedicated account management.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Security is our top priority. We use industry-standard encryption, secure servers, and regular backups. All payment processing is handled by Stripe, which is PCI DSS compliant.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Yes! Business plan users can export attendee data, financial reports, and other information in CSV format. This makes it easy to use your data in other tools or for record-keeping.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions about EasyPlanningPro
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a href="/contact" className="text-primary hover:underline">
            Contact Support →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

