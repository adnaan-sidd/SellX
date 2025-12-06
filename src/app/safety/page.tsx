"use client"

import { useRouter } from "next/navigation"
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Phone,
  MapPin,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  MessageCircle,
  ExternalLink
} from "lucide-react"

export default function SafetyPage() {
  const router = useRouter()

  const safetyTips = [
    {
      icon: MapPin,
      title: "Meet in Public Places",
      description: "Always meet in well-lit, public locations like shopping malls, cafes, or police stations. Never agree to meet in private homes or isolated areas.",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Bring a Friend",
      description: "Bring a trusted friend or family member with you when meeting someone for the first time. Let someone know where you're going and when you expect to return.",
      color: "text-green-600"
    },
    {
      icon: Eye,
      title: "Inspect Items Carefully",
      description: "Thoroughly examine the item before making payment. Test electronic devices, check for damage, and ensure everything matches the description.",
      color: "text-purple-600"
    },
    {
      icon: CreditCard,
      title: "Use Secure Payment Methods",
      description: "Prefer cash payments in person. If using digital payments, use trusted platforms and avoid sharing banking details unnecessarily.",
      color: "text-orange-600"
    },
    {
      icon: Phone,
      title: "Verify Phone Numbers",
      description: "Cross-check phone numbers provided by sellers. Use the verified contact information shown on product pages rather than external communication.",
      color: "text-indigo-600"
    },
    {
      icon: Lock,
      title: "Protect Personal Information",
      description: "Never share your full address, bank details, or sensitive personal information. Use platform-provided communication channels only.",
      color: "text-red-600"
    }
  ]

  const scamWarnings = [
    {
      title: "Too Good to Be True Deals",
      description: "Be wary of items priced significantly below market value. Scammers often use unrealistically low prices to attract victims.",
      signs: ["Price 50%+ below market rate", "Urgent sale pressure", "Seller avoids questions"]
    },
    {
      title: "Requests for Advance Payment",
      description: "Legitimate sellers will not ask for payment before you see the item. Be suspicious of any requests for deposits or advance payments.",
      signs: ["Advance payment requests", "Payment to third parties", "Cryptocurrency demands"]
    },
    {
      title: "Pressure Tactics",
      description: "Scammers often create urgency or pressure you to make quick decisions. Take your time and don't let anyone rush you.",
      signs: ["'Limited time offer'", "'Item selling fast'", "Emotional manipulation"]
    },
    {
      title: "Fake Verification Badges",
      description: "Check for genuine verification badges. Scammers may use fake badges or claim verification they don't have.",
      signs: ["Inconsistent verification", "Recently created accounts", "No seller history"]
    }
  ]

  const emergencySteps = [
    "Stop all communication with the suspicious party",
    "Report the incident to SellX support immediately",
    "Save all communication records and screenshots",
    "Contact your local police if you've been scammed",
    "Report to cybercrime authorities if financial loss occurred",
    "Monitor your accounts for suspicious activity"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Safety Guidelines</h1>
            <p className="text-xl text-gray-600">Your safety is our top priority. Learn how to stay safe on SellX</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Safety Tips Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meeting Safely for Transactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                  <tip.icon className={`w-6 h-6 ${tip.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scam Recognition */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Recognizing Scams</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scamWarnings.map((scam, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-6 bg-red-50">
                <h3 className="text-lg font-semibold text-red-900 mb-3">{scam.title}</h3>
                <p className="text-red-800 mb-4">{scam.description}</p>
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Warning Signs:</h4>
                  <ul className="space-y-1">
                    {scam.signs.map((sign, signIndex) => (
                      <li key={signIndex} className="flex items-center text-sm text-red-700">
                        <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Safety */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Payment Safety Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safe Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Cash in Person</p>
                    <p className="text-sm text-gray-600">Safest method - inspect item first, then pay</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">UPI/Google Pay/PhonePe</p>
                    <p className="text-sm text-gray-600">Convenient for verified transactions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-sm text-gray-600">For high-value items with proper documentation</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Avoid These Methods</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Wire Transfers</p>
                    <p className="text-sm text-gray-600">Irreversible and high risk</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Cryptocurrency</p>
                    <p className="text-sm text-gray-600">Volatile and often used by scammers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Money Orders/Gift Cards</p>
                    <p className="text-sm text-gray-600">Untraceable and commonly used in scams</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Protection */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Lock className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Protecting Your Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What to Share</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  General location (city/area)
                </li>
                <li className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Meeting preferences
                </li>
                <li className="flex items-center text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Item inspection requirements
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What NOT to Share</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-red-700">
                  <XCircle className="w-4 h-4 mr-2" />
                  Full home address
                </li>
                <li className="flex items-center text-red-700">
                  <XCircle className="w-4 h-4 mr-2" />
                  Bank account details
                </li>
                <li className="flex items-center text-red-700">
                  <XCircle className="w-4 h-4 mr-2" />
                  Passwords or PINs
                </li>
                <li className="flex items-center text-red-700">
                  <XCircle className="w-4 h-4 mr-2" />
                  Social security numbers
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* What to Do If Scammed */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-red-900">What to Do If You've Been Scammed</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencySteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-red-800 font-medium">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">SellX Support</p>
                <button
                  onClick={() => router.push('/support/new-ticket')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create Support Ticket
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-900">Cyber Crime Helpline</p>
                <p className="text-gray-600">1930 (India)</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Local Police</p>
                <p className="text-gray-600">100 (Emergency)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Button */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">See Something Suspicious?</h3>
          <p className="text-blue-100 mb-6">
            Help keep SellX safe by reporting fraudulent listings and suspicious activity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/my-reports')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View My Reports
            </button>
            <button
              onClick={() => router.push('/support/new-ticket')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}