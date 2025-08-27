import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Button from "./ui/Button";
import {
  ArrowLeft,
  FileText,
  Shield,
  Users,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService: React.FC = () => {
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-card-foreground">
              VisitWise Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using VisitWise ("the Service"), a Progressive
                Web Application for patient management, you accept and agree to
                be bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                2. Description of Service
              </h2>
              <p>
                VisitWise is a patient management application that allows
                healthcare providers to:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Manage patient records and profiles</li>
                <li>Schedule and track patient visits</li>
                <li>Record treatment plans and medical notes</li>
                <li>Track earnings and payments</li>
                <li>Generate reports and analytics</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                3. User Accounts and Registration
              </h2>
              <p>
                To access certain features of the Service, you must register for
                an account. You agree to:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                4. Acceptable Use
              </h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>
                  Use the Service for any commercial purpose without
                  authorization
                </li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                5. Privacy and Data Protection
              </h2>
              <p>
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy, which is
                incorporated into these Terms by reference. By using the
                Service, you consent to the collection and use of information as
                detailed in our Privacy Policy.
              </p>
            </section>

            {/* Medical Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                6. Medical Disclaimer
              </h2>
              <p>
                VisitWise is a management tool and does not provide medical
                advice, diagnosis, or treatment. The information entered into
                the Service should not be considered as medical advice. Always
                consult with qualified healthcare professionals for medical
                decisions.
              </p>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                7. Payment and Subscription Terms
              </h2>
              <p>
                Some features of the Service may require payment. By subscribing
                to paid features, you agree to:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Pay all fees associated with your subscription</li>
                <li>Provide accurate billing information</li>
                <li>Authorize recurring charges if applicable</li>
                <li>
                  Cancel your subscription according to our cancellation policy
                </li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                8. Intellectual Property Rights
              </h2>
              <p>
                The Service and its original content, features, and
                functionality are owned by VisitWise and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                9. Limitation of Liability
              </h2>
              <p>
                In no event shall VisitWise, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                10. Termination
              </h2>
              <p>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                11. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                12. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">VisitWise Support</p>
                <p>Email: support@visitwise.com</p>
                <p>Website: www.visitwise.com</p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-border pt-6 mt-8">
              <p className="text-center text-sm text-muted-foreground">
                By using VisitWise, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
