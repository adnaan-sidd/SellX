import type { Metadata } from "next"
import { FileText, AlertTriangle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions - SellX",
  description: "Read SellX's terms and conditions for using our platform. Understand your rights and responsibilities when buying and selling products.",
  keywords: "terms and conditions, SellX terms, user agreement, platform rules, legal terms",
  openGraph: {
    title: "Terms & Conditions - SellX",
    description: "Read SellX's terms and conditions for using our platform",
    type: "website",
  },
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to SellX ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our
                website, mobile application, and services (collectively, the "Platform"). By accessing or using SellX,
                you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree to these Terms, please do not use our Platform. These Terms apply to all users,
                including buyers, sellers, and visitors.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Account Creation</h3>
                  <p className="text-gray-700">
                    You must create an account to buy or sell products. You are responsible for maintaining the
                    confidentiality of your account credentials.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Account Verification</h3>
                  <p className="text-gray-700">
                    We may require verification of your identity, phone number, and other details to ensure platform safety.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Account Responsibility</h3>
                  <p className="text-gray-700">
                    You are responsible for all activities that occur under your account. Notify us immediately of any
                    unauthorized use.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Listing Rules */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Listing Rules</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What You Can List:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>New or used consumer goods in good condition</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Electronics, furniture, clothing, and accessories</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Collectibles and vintage items</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Sports equipment and hobby items</span>
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900 mb-4">What You Cannot List:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Illegal items or substances</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Counterfeit or stolen goods</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Firearms, weapons, or dangerous materials</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Adult content or services</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Listing Fee</h3>
                <p className="text-blue-800">
                  Sellers pay a ₹25 listing fee per product. This fee is non-refundable once the listing is published.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Payment Methods</h3>
                <p className="text-green-800">
                  We accept payments through secure gateways including Razorpay. All transactions are protected by SSL encryption.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Payment Disputes</h3>
                <p className="text-orange-800">
                  Payment disputes must be reported within 48 hours of transaction completion. We mediate disputes fairly.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Items */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Items & Activities</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-4">Strictly Prohibited:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-red-800">
                  <li>• Illegal drugs or substances</li>
                  <li>• Stolen or counterfeit goods</li>
                  <li>• Firearms and ammunition</li>
                  <li>• Explosives or hazardous materials</li>
                  <li>• Adult content or services</li>
                  <li>• Tobacco and related products</li>
                </ul>
                <ul className="space-y-2 text-red-800">
                  <li>• Government documents</li>
                  <li>• Medical devices without certification</li>
                  <li>• Endangered species products</li>
                  <li>• Items promoting hate or violence</li>
                  <li>• Copyright-infringing materials</li>
                  <li>• Items violating trademark laws</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Account Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violations of these Terms,
                illegal activities, or at our discretion.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Termination Process:</h3>
                <ol className="list-decimal list-inside text-yellow-800 space-y-1">
                  <li>Initial warning for minor violations</li>
                  <li>Temporary suspension for repeated issues</li>
                  <li>Permanent termination for serious violations</li>
                  <li>Appeal process available within 30 days</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Dispute Resolution</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We encourage users to resolve disputes amicably. If direct resolution is not possible,
                our mediation team will assist in finding a fair solution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 1</h4>
                  <p className="text-gray-700 text-sm">Contact the other party directly to resolve the issue</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 2</h4>
                  <p className="text-gray-700 text-sm">File a dispute report through our platform</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Step 3</h4>
                  <p className="text-gray-700 text-sm">Our team mediates and provides final resolution</p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                SellX is a platform that connects buyers and sellers. We are not responsible for:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Quality or condition of items sold</li>
                <li>• Accuracy of product descriptions</li>
                <li>• Delivery or shipping issues</li>
                <li>• Disputes between users</li>
                <li>• Loss or damage during transactions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Our liability is limited to the amount of fees paid by users in the preceding 12 months.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-blue-800">
                <p><strong>Email:</strong> legal@sellx.com</p>
                <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p><strong>Address:</strong> 123 Business District, Connaught Place, New Delhi - 110001</p>
              </div>
            </div>
          </section>

          {/* Updates to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Updates to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. Users will be notified of significant changes via email
              or platform notifications. Continued use of SellX after changes constitutes acceptance of the new Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}