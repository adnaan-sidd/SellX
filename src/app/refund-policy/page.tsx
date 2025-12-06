import type { Metadata } from "next"
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Mail,
  Phone
} from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy - SellX",
  description: "Learn about SellX's refund policy for listing fees. Understand when refunds are available and how to request them.",
  keywords: "refund policy, SellX refunds, listing fee refund, cancellation policy, money back guarantee",
  openGraph: {
    title: "Refund Policy - SellX",
    description: "Learn about SellX's refund policy and when you can get your money back",
    type: "website",
  },
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
            <p className="text-gray-600">Understanding our refund process and eligibility</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                At SellX, we strive to provide a fair and transparent refund policy. Our ₹25 listing fee is designed
                to maintain platform quality and cover operational costs. Refunds are available under specific circumstances
                as outlined below.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Listing Fee</h3>
                    <p className="text-blue-800 text-sm">
                      All product listings require a one-time ₹25 fee. This fee helps us maintain a high-quality,
                      safe platform for all users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Eligibility */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When Can You Get a Refund?</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Issues</h3>
                  <p className="text-gray-700 mb-2">
                    If your listing fails due to technical problems on our end (payment processing errors, system failures, etc.).
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800 text-sm">
                      <strong>Examples:</strong> Payment gateway failures, duplicate charges, system errors preventing listing publication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Account Verification Issues</h3>
                  <p className="text-gray-700 mb-2">
                    If your account cannot be verified due to technical issues preventing document upload or processing.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800 text-sm">
                      <strong>Note:</strong> Refunds are not available if verification fails due to invalid or incomplete documents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Duplicate Payments</h3>
                  <p className="text-gray-700 mb-2">
                    If you are charged multiple times for the same listing due to system errors.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800 text-sm">
                      <strong>Processing:</strong> Extra charges are refunded within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Change of Mind</h3>
                  <p className="text-gray-700 mb-2">
                    Refunds are not available if you simply change your mind after listing a product.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm">
                      <strong>Alternative:</strong> You can edit or delete your listing instead.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Policy Violations</h3>
                  <p className="text-gray-700 mb-2">
                    No refunds for listings removed due to violations of our terms and conditions.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm">
                      <strong>Examples:</strong> Prohibited items, false information, spam listings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Refund</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-gray-700 text-sm">
                    Reach out to our support team with your listing details and reason for refund.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Review Process</h3>
                  <p className="text-gray-700 text-sm">
                    Our team reviews your request within 2-3 business days.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Processed</h3>
                  <p className="text-gray-700 text-sm">
                    Approved refunds are processed within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email Support
                </h4>
                <p className="text-gray-700 text-sm">refunds@sellx.com</p>
                <p className="text-gray-500 text-xs mt-1">Include order ID and reason</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  Phone Support
                </h4>
                <p className="text-gray-700 text-sm">+91-XXXXXXXXXX</p>
                <p className="text-gray-500 text-xs mt-1">Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Processing Time</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Review Time</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">2-3 Days</p>
                <p className="text-gray-600 text-sm">Business days to review your request</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">5-7 Days</p>
                <p className="text-gray-600 text-sm">From approval to refund in your account</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
                <p className="text-purple-600 font-semibold mb-1">Original Payment</p>
                <p className="text-gray-600 text-sm">Same method used for payment</p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">Time Limits</h3>
                    <p className="text-yellow-800 text-sm">
                      Refund requests must be submitted within 30 days of the original payment.
                      Requests after this period will not be considered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Partial Refunds</h3>
                    <p className="text-blue-800 text-sm">
                      In some cases, partial refunds may be issued. For example, if a listing was active for several
                      days before a technical issue occurred.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Appeal Process</h3>
                    <p className="text-red-800 text-sm">
                      If your refund request is denied, you can appeal the decision within 14 days by providing
                      additional evidence or documentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with a Refund?</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                Our refund team is here to help you with any questions or concerns about the refund process.
                Please provide as much detail as possible when contacting us.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Information</h3>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• Order ID or transaction reference</li>
                    <li>• Date of original payment</li>
                    <li>• Reason for refund request</li>
                    <li>• Any relevant screenshots or documentation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">refunds@sellx.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">+91-XXXXXXXXXX</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">Mon-Fri, 9 AM - 6 PM IST</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}