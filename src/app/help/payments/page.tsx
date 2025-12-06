"use client"

import { useRouter } from "next/navigation"
import {
  CreditCard,
  Shield,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Smartphone,
  Building,
  Wallet,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react"

export default function PaymentsHelp() {
  const router = useRouter()

  const paymentMethods = [
    {
      method: "Cash",
      icon: DollarSign,
      description: "Physical currency exchange during in-person meetings",
      pros: ["No fees", "Immediate", "Untraceable"],
      cons: ["Must meet in person", "Carrying cash risk"],
      recommended: true
    },
    {
      method: "UPI/PhonePe/Google Pay",
      icon: Smartphone,
      description: "Digital wallet transfers through UPI apps",
      pros: ["Convenient", "Instant", "Secure"],
      cons: ["Requires smartphone", "Transaction fees may apply"],
      recommended: true
    },
    {
      method: "Bank Transfer",
      icon: Building,
      description: "Direct bank account transfers",
      pros: ["Secure", "Large amounts", "Traceable"],
      cons: ["Takes time", "May have fees"],
      recommended: false
    },
    {
      method: "Digital Wallets",
      icon: Wallet,
      description: "Paytm, Amazon Pay, and other digital wallets",
      pros: ["Convenient", "Cashback offers"],
      cons: ["Transaction limits", "Service fees"],
      recommended: false
    }
  ]

  const refundPolicy = [
    {
      scenario: "Listing Fee Refunds",
      eligible: true,
      conditions: [
        "Technical issues preventing listing publication",
        "Duplicate charges",
        "Payment processing errors"
      ],
      timeline: "Within 7 days of payment",
      process: "Contact support with payment proof"
    },
    {
      scenario: "Product Purchase Refunds",
      eligible: false,
      conditions: [
        "SellX does not handle product refunds",
        "Refunds arranged directly between buyer and seller",
        "Platform only facilitates transactions"
      ],
      timeline: "N/A",
      process: "Contact seller directly"
    },
    {
      scenario: "Fraudulent Transactions",
      eligible: true,
      conditions: [
        "Confirmed fraudulent activity",
        "Payment made under false pretenses",
        "Seller verification issues"
      ],
      timeline: "Within 30 days of transaction",
      process: "Report fraud + contact support"
    }
  ]

  const safetyTips = [
    "Always verify seller/buyer identity before payment",
    "Use platform-recommended payment methods only",
    "Keep payment receipts and transaction IDs",
    "Report suspicious payment requests immediately",
    "Never share banking details unnecessarily",
    "Use secure networks for digital transactions"
  ]

  const commonIssues = [
    {
      issue: "Payment Failed",
      solutions: [
        "Check internet connection",
        "Verify card/bank details",
        "Ensure sufficient balance",
        "Try different payment method",
        "Contact bank if card declined"
      ]
    },
    {
      issue: "Money Not Received",
      solutions: [
        "Wait 24-48 hours for processing",
        "Check transaction status",
        "Contact payment provider",
        "Report to SellX support"
      ]
    },
    {
      issue: "Wrong Amount Charged",
      solutions: [
        "Check transaction details",
        "Contact bank immediately",
        "Report to SellX support",
        "Keep all communication records"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Help & Support</h1>
            <p className="text-xl text-gray-600">Everything you need to know about payments on SellX</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Accepted Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
                method.recommended ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center mb-4">
                  <method.icon className={`w-6 h-6 mr-3 ${method.recommended ? 'text-green-600' : 'text-blue-600'}`} />
                  <h3 className="text-lg font-semibold text-gray-900">{method.method}</h3>
                  {method.recommended && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{method.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {method.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Cons:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {method.cons.map((con, conIndex) => (
                        <li key={conIndex} className="flex items-center">
                          <XCircle className="w-3 h-3 text-red-600 mr-2" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <RefreshCw className="w-8 h-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Refund Policy</h2>
          </div>

          <div className="space-y-6">
            {refundPolicy.map((policy, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{policy.scenario}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    policy.eligible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {policy.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {policy.conditions.map((condition, condIndex) => (
                        <li key={condIndex} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Timeline:</h4>
                    <p className="text-sm text-gray-600">{policy.timeline}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Process:</h4>
                    <p className="text-sm text-gray-600">{policy.process}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Safety */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-green-900">Transaction Safety Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-green-800 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Common Payment Issues & Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commonIssues.map((issue, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{issue.issue}</h3>
                <ul className="space-y-2">
                  {issue.solutions.map((solution, solIndex) => (
                    <li key={solIndex} className="flex items-start text-gray-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Times */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-blue-900">Payment Processing Times</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Fees</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Instant processing for approved payments</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Refunds processed within 5-7 business days</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Transactions</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Cash payments: Instant</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Digital payments: 1-24 hours</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Bank transfers: 1-3 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Was this payment guide helpful?</h2>
          <div className="flex justify-center space-x-4">
            <button className="flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-lg hover:bg-green-200 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span>Yes, very helpful</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-100 text-red-800 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors">
              <ThumbsDown className="w-5 h-5" />
              <span>Could be better</span>
            </button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Payment Issues?</h3>
          <p className="text-blue-100 mb-6">
            Our payment specialists are here to help resolve any payment-related issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/support/new-ticket')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Create Support Ticket
            </button>
            <button
              onClick={() => router.push('/help-center')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}