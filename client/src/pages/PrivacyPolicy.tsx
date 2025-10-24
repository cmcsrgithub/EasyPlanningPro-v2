import DashboardLayout from "@/components/DashboardLayout";

export default function PrivacyPolicy() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: January 24, 2025
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account,
              register for events, or use our services. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Profile information and preferences</li>
              <li>Event registration and attendance data</li>
              <li>Payment and billing information</li>
              <li>Communications with us</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information in the
              following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent or at your direction</li>
              <li>With service providers who perform services on our behalf</li>
              <li>For legal compliance or to protect rights and safety</li>
              <li>In connection with a business transaction (merger, sale, etc.)</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no internet transmission is completely secure.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your
              browsing activities. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">7. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@easyplanningpro.com
              <br />
              Address: 123 Event Street, Suite 100, City, State 12345
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

