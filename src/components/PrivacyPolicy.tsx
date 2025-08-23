import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Button from "./ui/Button";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Lock,
  Users,
  Globe,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-card-foreground">
              VisitWise Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                1. Introduction
              </h2>
              <p>
                VisitWise ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                patient management Progressive Web Application. By using
                VisitWise, you consent to the data practices described in this
                policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                2.1 Personal Information
              </h3>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Name, email address, and contact information</li>
                <li>
                  Professional credentials and medical license information
                </li>
                <li>Account authentication details</li>
                <li>Billing and payment information</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                2.2 Patient Information
              </h3>
              <p>As a healthcare management tool, we may process:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Patient names and contact details</li>
                <li>Medical history and treatment records</li>
                <li>Appointment schedules and visit notes</li>
                <li>Payment and billing information</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
                2.3 Technical Information
              </h3>
              <p>We automatically collect:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and app interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                3. How We Use Your Information
              </h2>
              <p>
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Provide and maintain the VisitWise service</li>
                <li>Process transactions and manage billing</li>
                <li>Send important service updates and notifications</li>
                <li>Improve our application and user experience</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Provide customer support and respond to inquiries</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                4. Information Sharing and Disclosure
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share information in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  service providers who assist in operating our service
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>Consent:</strong> When you explicitly consent to
                  sharing
                </li>
                <li>
                  <strong>Emergency Situations:</strong> To protect public
                  health and safety
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                5. Data Security
              </h2>
              <p>
                We implement appropriate security measures to protect your
                information:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the internet is 100%
                secure. While we strive to protect your information, we cannot
                guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                6. Data Retention
              </h2>
              <p>
                We retain your information for as long as necessary to provide
                our services and comply with legal obligations. Specific
                retention periods depend on the type of data and its purpose:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Account Information:</strong> Retained while your
                  account is active
                </li>
                <li>
                  <strong>Patient Records:</strong> Retained according to
                  healthcare regulations
                </li>
                <li>
                  <strong>Transaction Data:</strong> Retained for accounting and
                  tax purposes
                </li>
                <li>
                  <strong>Logs and Analytics:</strong> Retained for service
                  improvement and security
                </li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                7. Your Rights and Choices
              </h2>
              <p>
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Access:</strong> Request a copy of your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we use your
                  information
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain processing
                  activities
                </li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                8. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar technologies to enhance your
                experience, analyze usage, and provide personalized content. You
                can control cookie settings through your browser preferences.
              </p>
              <p className="mt-3">Types of cookies we use:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic
                  functionality
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how you
                  use our service
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
                <li>
                  <strong>Security Cookies:</strong> Help maintain security and
                  prevent fraud
                </li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                9. Third-Party Services
              </h2>
              <p>
                Our service may contain links to third-party websites or
                integrate with third-party services. We are not responsible for
                the privacy practices of these external services. We encourage
                you to review their privacy policies.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                10. Children's Privacy
              </h2>
              <p>
                VisitWise is not intended for use by children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you are a parent or guardian and believe
                your child has provided us with personal information, please
                contact us immediately.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                11. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your information in accordance with this
                Privacy Policy and applicable data protection laws.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                12. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying in-app notifications</li>
              </ul>
              <p className="mt-3">
                Your continued use of VisitWise after any changes indicates your
                acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                13. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">VisitWise Privacy Team</p>
                <p>Email: privacy@visitwise.com</p>
                <p>Website: www.visitwise.com</p>
                <p>Address: [Your Business Address]</p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-border pt-6 mt-8">
              <p className="text-center text-sm text-muted-foreground">
                This Privacy Policy is effective as of the date listed above and
                applies to all users of VisitWise.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
