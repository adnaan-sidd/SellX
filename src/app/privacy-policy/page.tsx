import type { Metadata } from "next"
import { Shield, Eye, Database, Users, Lock, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy - SellX",
  description: "Learn how SellX collects, uses, and protects your personal information. Our commitment to data privacy and user rights.",
  keywords: "privacy policy, data protection, user privacy, SellX privacy, data collection",
  openGraph: {
    title: "Privacy Policy - SellX",
    description: "Learn how SellX protects your privacy and handles your data",
    type: "website",
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
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
                At SellX ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using SellX, you consent to the collection and use of information in accordance with this policy.
                If you do not agree with our policies and practices, please do not use our platform.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Database className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Name and contact information (phone, email)</li>
                    <li>• Profile photos and bio</li>
                    <li>• Location information (city, state, pincode)</li>
                    <li>• Government ID for verification (stored securely)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Eye className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Device information and IP address</li>
                    <li>• Browser type and version</li>
                    <li>• Pages visited and time spent</li>
                    <li>• Search queries and interactions</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transaction Information</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Product listings and purchase history</li>
                    <li>• Payment information (processed securely)</li>
                    <li>• Chat messages and communications</li>
                    <li>• Ratings and reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">We use your information to:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide and maintain our services</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Verify user identities and prevent fraud</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Process payments and transactions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Facilitate communication between users</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Improve our platform and services</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Send important updates and notifications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comply with legal obligations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information only in the following circumstances:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">With Your Consent</h4>
                  <p className="text-green-800 text-sm">
                    When you explicitly agree to share information for specific purposes.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Service Providers</h4>
                  <p className="text-blue-800 text-sm">
                    With trusted third-party service providers who help us operate our platform.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Legal Requirements</h4>
                  <p className="text-orange-800 text-sm">
                    When required by law, court order, or to protect our rights and safety.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Business Transfers</h4>
                  <p className="text-purple-800 text-sm">
                    In connection with a merger, acquisition, or sale of our business.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cookie Policy</h3>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform:
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Essential Cookies:</strong>
                    <span className="text-gray-700 ml-2">Required for basic platform functionality</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Analytics Cookies:</strong>
                    <span className="text-gray-700 ml-2">Help us understand how users interact with our platform</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Marketing Cookies:</strong>
                    <span className="text-gray-700 ml-2">Used to show relevant advertisements</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mt-4">
                You can control cookie settings through your browser preferences. However, disabling certain cookies
                may affect platform functionality.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our platform integrates with third-party services to provide enhanced functionality:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Processing</h4>
                  <p className="text-gray-700 text-sm">
                    Razorpay and other payment gateways process transactions securely.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Cloud Storage</h4>
                  <p className="text-gray-700 text-sm">
                    AWS S3 stores images and files with enterprise-grade security.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <p className="text-gray-700 text-sm">
                    Twilio handles SMS notifications and phone verification.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                  <p className="text-gray-700 text-sm">
                    Google Analytics helps us improve user experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <Lock className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Security Measures</h3>
                  <p className="text-green-800">
                    We implement industry-standard security measures to protect your data:
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-green-800 ml-9">
                <li>• SSL/TLS encryption for all data transmission</li>
                <li>• Secure cloud infrastructure with regular security audits</li>
                <li>• Encrypted storage of sensitive information</li>
                <li>• Regular security updates and patches</li>
                <li>• Access controls and employee training</li>
                <li>• Regular backups and disaster recovery plans</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights and Choices</h2>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You have certain rights regarding your personal information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Access & Portability</h4>
                  <p className="text-blue-800 text-sm">
                    Request a copy of your personal data in a portable format.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Correction</h4>
                  <p className="text-orange-800 text-sm">
                    Update or correct inaccurate personal information.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Deletion</h4>
                  <p className="text-red-800 text-sm">
                    Request deletion of your personal data (subject to legal requirements).
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Opt-out</h4>
                  <p className="text-purple-800 text-sm">
                    Unsubscribe from marketing communications at any time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact for Privacy Concerns */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact for Privacy Concerns</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Privacy Officer</h3>
                  <p className="text-blue-800 mb-3">
                    For privacy-related questions or to exercise your rights, contact our Privacy Officer:
                  </p>
                  <div className="space-y-1 text-blue-800">
                    <p><strong>Email:</strong> privacy@sellx.com</p>
                    <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                    <p><strong>Address:</strong> 123 Business District, Connaught Place, New Delhi - 110001</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Updates to This Policy</h2>

            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              via email or platform notification. Your continued use of SellX after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}