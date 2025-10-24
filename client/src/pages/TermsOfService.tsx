import DashboardLayout from "@/components/DashboardLayout";

export default function TermsOfService() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: January 24, 2025
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using EasyPlanningPro ("Service"), you accept and agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use the
              Service.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p>
              EasyPlanningPro provides event planning and management tools, including but not
              limited to event creation, registration, ticketing, communication, and analytics.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or viruses</li>
              <li>Harass, abuse, or harm others</li>
              <li>Attempt to gain unauthorized access to the Service</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">5. Payment and Billing</h2>
            <p>
              Certain features require payment. You agree to provide accurate billing information
              and authorize us to charge your payment method. Subscriptions automatically renew
              unless cancelled.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by
              EasyPlanningPro and are protected by international copyright, trademark, and other
              intellectual property laws.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">7. User Content</h2>
            <p>
              You retain ownership of content you submit. By submitting content, you grant us a
              worldwide, non-exclusive license to use, reproduce, and display your content in
              connection with the Service.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">8. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service at our sole
              discretion, without prior notice, for conduct that we believe violates these Terms
              or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind,
              either express or implied. We do not warrant that the Service will be uninterrupted,
              secure, or error-free.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, EasyPlanningPro shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages resulting from your
              use of the Service.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of
              material changes. Your continued use of the Service after changes constitutes
              acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">12. Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
              <br />
              Email: legal@easyplanningpro.com
              <br />
              Address: 123 Event Street, Suite 100, City, State 12345
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

