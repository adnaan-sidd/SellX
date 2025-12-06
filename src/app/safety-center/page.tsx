import type { Metadata } from "next"
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"

export const metadata: Metadata = {
  title: "Safety Center - SellX",
  description: "Learn about online safety, common scams, and how to protect yourself when buying and selling on SellX. Your safety is our priority.",
  keywords: "online safety, scam protection, buyer seller safety, fraud prevention, SellX safety",
  openGraph: {
    title: "Safety Center - SellX",
    description: "Learn about online safety and protect yourself when buying and selling",
    type: "website",
  },
}

export default function SafetyCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Shield className="w-20 h-20 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Your Safety is Our Priority</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Learn how to stay safe when buying and selling online. Protect yourself from scams and ensure secure transactions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Safety Guidelines */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety Guidelines</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Verify Before You Buy</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Check seller ratings and reviews</li>
                <li>• Examine product photos carefully</li>
                <li>• Ask detailed questions about the item</li>
                <li>• Request additional photos if needed</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Payment Methods</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Use SellX's secure payment system</li>
                <li>• Never share bank details directly</li>
                <li>• Avoid wire transfers or money orders</li>
                <li>• Keep payment records for disputes</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Safe Communication</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Use SellX's built-in messaging</li>
                <li>• Never share personal information</li>
                <li>• Meet in public places for exchanges</li>
                <li>• Bring a friend for large transactions</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Police: 100 (India)</li>
                <li>• Cyber Crime Helpline: 1930</li>
                <li>• SellX Support: Available 24/7</li>
                <li>• Local consumer court</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Report Suspicious Activity</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Use SellX's report feature</li>
                <li>• Document all communications</li>
                <li>• Report to authorities if needed</li>
                <li>• Help keep the community safe</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trust Your Instincts</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• If something feels wrong, walk away</li>
                <li>• Research market prices</li>
                <li>• Verify all details independently</li>
                <li>• Trust but verify</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Scams */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Scams to Avoid</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Overpayment Scams</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Buyer sends more money than needed and asks for refund of excess.
                    </p>
                    <div className="bg-red-100 rounded p-3">
                      <p className="text-red-900 text-xs font-medium mb-1">Red Flags:</p>
                      <ul className="text-red-800 text-xs space-y-1">
                        <li>• Unexpected overpayment</li>
                        <li>• Urgency to refund quickly</li>
                        <li>• Pressure to use different payment method</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Fake Payment Proof</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Seller shows fake payment confirmation to build trust.
                    </p>
                    <div className="bg-red-100 rounded p-3">
                      <p className="text-red-900 text-xs font-medium mb-1">Red Flags:</p>
                      <ul className="text-red-800 text-xs space-y-1">
                        <li>• Screenshots of payment apps</li>
                        <li>• Claims of payment without your confirmation</li>
                        <li>• Pressure to ship before verification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Too Good to Be True</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Items priced significantly below market value.
                    </p>
                    <div className="bg-red-100 rounded p-3">
                      <p className="text-red-900 text-xs font-medium mb-1">Red Flags:</p>
                      <ul className="text-red-800 text-xs space-y-1">
                        <li>• Prices 50%+ below market rate</li>
                        <li>• Vague or changing stories</li>
                        <li>• Refusal to meet in person</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Identity Theft</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Requests for personal information or ID copies.
                    </p>
                    <div className="bg-red-100 rounded p-3">
                      <p className="text-red-900 text-xs font-medium mb-1">Red Flags:</p>
                      <ul className="text-red-800 text-xs space-y-1">
                        <li>• Requests for government ID</li>
                        <li>• Asks for bank account details</li>
                        <li>• Wants to verify via unofficial channels</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Advance Fee Fraud</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Promises of large returns for small upfront payments.
                    </p>
                    <div className="bg-red-100 rounded p-3">
                      <p className="text-red-900 text-xs font-medium mb-1">Red Flags:</p>
                      <ul className="text-red-800 text-xs space-y-1">
                        <li>• "Processing fees" or "shipping costs"</li>
                        <li>• Promises of quick rich returns</li>
                        <li>• Urgency and emotional pressure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Phishing Attempts</h3>
                    <p className="text-red-800 text-sm mb-3">
                      Fake links or requests to login outside the platform.
                    </p>
                    <div className="bg-red-100 rounded p-3">
                      <p className="text-red-900 text-xs font-medium mb-1">Red Flags:</p>
                      <ul className="text-red-800 text-xs space-y-1">
                        <li>• Links to external login pages</li>
                        <li>• Requests for password reset</li>
                        <li>• Urgent account security alerts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Report */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Report Issues</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Document Everything</h3>
                <p className="text-gray-700 text-sm">
                  Save screenshots, messages, and transaction details. Include dates, times, and usernames.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Report on SellX</h3>
                <p className="text-gray-700 text-sm">
                  Use our built-in reporting system. Go to the item or user profile and click "Report".
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Authorities</h3>
                <p className="text-gray-700 text-sm">
                  For serious fraud, contact local police or cyber crime units. Provide all documentation.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Report Types</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                    <ul className="space-y-1 text-sm">
                      <li>• Suspicious listings</li>
                      <li>• Fake reviews or ratings</li>
                      <li>• Harassment or threats</li>
                      <li>• Payment fraud</li>
                    </ul>
                    <ul className="space-y-1 text-sm">
                      <li>• Counterfeit goods</li>
                      <li>• Prohibited items</li>
                      <li>• Spam or scams</li>
                      <li>• Account misuse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secure Payment Tips */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Secure Payment Tips</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Safe Payment Methods
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>SellX's integrated payment system with buyer protection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Credit/debit cards through verified gateways</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>UPI payments with transaction tracking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Net banking with OTP verification</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                Avoid These Methods
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Wire transfers or money orders</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Western Union or similar services</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Cryptocurrency for small transactions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Direct bank transfers without protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-gray-900 text-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Emergency Contacts</h2>
            <p className="text-gray-300">Don't hesitate to reach out if you need immediate help</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Police Emergency</h3>
              <p className="text-gray-300 text-sm mb-2">For immediate danger or crime</p>
              <p className="text-xl font-bold">100</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Cyber Crime Helpline</h3>
              <p className="text-gray-300 text-sm mb-2">For online fraud and cyber crimes</p>
              <p className="text-xl font-bold">1930</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">SellX Support</h3>
              <p className="text-gray-300 text-sm mb-2">24/7 support for platform issues</p>
              <p className="text-xl font-bold">+91-XXXXXXXXXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}