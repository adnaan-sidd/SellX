"use client"

import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Search,
  UserCheck,
  MessageCircle,
  Eye,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowRight,
  Phone,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react"

export default function BuyingGuide() {
  const router = useRouter()

  const buyingSteps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up with your phone number and complete your profile",
      icon: UserCheck,
      details: [
        "Provide valid phone number for OTP verification",
        "Add your name and basic details",
        "Complete buyer verification for full access"
      ]
    },
    {
      step: 2,
      title: "Browse & Search",
      description: "Find items you're interested in using search and filters",
      icon: Search,
      details: [
        "Use search bar to find specific items",
        "Apply filters by category, price, location, condition",
        "Browse featured listings on the home page"
      ]
    },
    {
      step: 3,
      title: "Review Listings Carefully",
      description: "Examine product details, photos, and seller information",
      icon: Eye,
      details: [
        "Check all product photos and description",
        "Verify seller's verification status",
        "Read seller ratings and reviews",
        "Note the location and condition"
      ]
    },
    {
      step: 4,
      title: "Contact the Seller",
      description: "Reach out to the seller through verified channels",
      icon: MessageCircle,
      details: [
        "Use in-app chat for secure communication",
        "Ask questions about the item condition",
        "Inquire about meeting location and time",
        "Verify seller's contact information"
      ]
    },
    {
      step: 5,
      title: "Arrange Safe Meeting",
      description: "Plan a safe transaction meeting",
      icon: MapPin,
      details: [
        "Choose public, well-lit locations",
        "Bring a friend or family member",
        "Inform someone about your plans",
        "Verify item condition before payment"
      ]
    },
    {
      step: 6,
      title: "Complete Transaction",
      description: "Make payment and receive your item",
      icon: CreditCard,
      details: [
        "Inspect item thoroughly before payment",
        "Use preferred payment method (cash recommended)",
        "Get receipt or confirmation",
        "Rate your experience"
      ]
    }
  ]

  const verificationSteps = [
    {
      title: "Access Verification Page",
      description: "Navigate to 'Verify Buyer' from your account dashboard",
      image: "/verify-buyer-1.png"
    },
    {
      title: "Upload Government ID",
      description: "Submit a clear photo of your Aadhaar, PAN, or Passport",
      image: "/verify-buyer-2.png"
    },
    {
      title: "Take Selfie",
      description: "Upload a recent selfie for identity verification",
      image: "/verify-buyer-3.png"
    },
    {
      title: "Wait for Approval",
      description: "Verification typically takes 24-48 hours",
      image: "/verify-buyer-4.png"
    }
  ]

  const contactMethods = [
    {
      method: "In-App Chat",
      icon: MessageCircle,
      description: "Secure, encrypted messaging within the platform",
      pros: ["Secure", "Seller verification", "Message history"],
      cons: ["Requires app access"]
    },
    {
      method: "Phone Call",
      icon: Phone,
      description: "Direct phone communication (after verification)",
      pros: ["Immediate response", "Voice verification"],
      cons: ["Requires phone number sharing"]
    }
  ]

  const safetyTips = [
    "Never share your full home address",
    "Meet in public places during daylight",
    "Bring someone you trust with you",
    "Test electronic items before payment",
    "Use cash payment when possible",
    "Trust your instincts - walk away if uncomfortable"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">How to Buy on SellX</h1>
            <p className="text-xl text-gray-600">Complete step-by-step guide to buying safely and successfully</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step-by-Step Guide */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Step-by-Step Buying Guide</h2>
          <div className="space-y-8">
            {buyingSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                        Step {step.step}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Process */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Buyer Verification Process</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Complete buyer verification to unlock full platform features including contacting sellers and accessing premium listings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verificationSteps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Screenshot placeholder</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/verify-buyer')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Start Verification Process
            </button>
          </div>
        </div>

        {/* Contacting Sellers */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Contacting Sellers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <method.icon className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{method.method}</h3>
                </div>
                <p className="text-gray-600 mb-4">{method.description}</p>

                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-green-700 mb-1">Pros:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {method.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {method.cons && method.cons.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-700 mb-1">Cons:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {method.cons.map((con, conIndex) => (
                          <li key={conIndex} className="flex items-center">
                            <span className="w-3 h-3 text-red-600 mr-2">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-green-900">Safety First - Essential Tips</h2>
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

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Was this guide helpful?</h2>
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

        {/* Need More Help */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Need More Help?</h3>
          <p className="text-blue-100 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/help-center')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Help Center
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