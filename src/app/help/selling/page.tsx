"use client"

import { useRouter } from "next/navigation"
import {
  Store,
  UserCheck,
  Package,
  Camera,
  MapPin,
  CreditCard,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Users,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react"

export default function SellingGuide() {
  const router = useRouter()

  const sellingSteps = [
    {
      step: 1,
      title: "Become a Verified Seller",
      description: "Apply for seller verification to unlock listing capabilities",
      icon: UserCheck,
      details: [
        "Complete seller application form",
        "Submit business documents and ID proof",
        "Wait for approval (typically 24-48 hours)",
        "Once approved, you can start listing products"
      ]
    },
    {
      step: 2,
      title: "Create Compelling Listings",
      description: "Write detailed, accurate product descriptions",
      icon: Package,
      details: [
        "Use clear, descriptive titles (under 70 characters)",
        "Write detailed descriptions with specifications",
        "Highlight unique features and condition",
        "Be honest about any flaws or wear"
      ]
    },
    {
      step: 3,
      title: "Add High-Quality Photos",
      description: "Upload clear, well-lit photos from multiple angles",
      icon: Camera,
      details: [
        "Use good lighting and clean backgrounds",
        "Show the item from all angles",
        "Include close-ups of important details",
        "First photo becomes the main thumbnail"
      ]
    },
    {
      step: 4,
      title: "Set Competitive Pricing",
      description: "Research market prices and set fair asking prices",
      icon: DollarSign,
      details: [
        "Check similar items on SellX and other platforms",
        "Factor in item condition and age",
        "Consider shipping costs if applicable",
        "Be open to reasonable offers"
      ]
    },
    {
      step: 5,
      title: "Pay Listing Fee",
      description: "Complete payment to publish your listing",
      icon: CreditCard,
      details: [
        "₹25 one-time listing fee per product",
        "Secure payment through Razorpay",
        "Fee helps maintain platform quality",
        "Listing remains active until sold"
      ]
    },
    {
      step: 6,
      title: "Manage Inquiries",
      description: "Respond promptly to buyer questions and offers",
      icon: MessageCircle,
      details: [
        "Check messages regularly",
        "Be responsive and helpful",
        "Arrange safe meeting locations",
        "Update listing status when sold"
      ]
    }
  ]

  const pricingTips = [
    {
      category: "Electronics",
      tips: [
        "Check prices on Amazon, Flipkart for similar items",
        "Consider age, warranty status, and condition",
        "Brand new items: 80-95% of retail price",
        "Used items: 50-80% depending on condition"
      ]
    },
    {
      category: "Vehicles",
      tips: [
        "Research local market prices",
        "Consider mileage, service history, condition",
        "Get professional valuation if needed",
        "Price competitively to attract buyers"
      ]
    },
    {
      category: "Home & Furniture",
      tips: [
        "Compare with furniture store prices",
        "Factor in age, wear, and current market value",
        "Large items may need delivery arrangements",
        "Consider pickup-only vs delivery options"
      ]
    }
  ]

  const listingTips = [
    {
      title: "Use Specific Keywords",
      description: "Include brand, model, size, color in your title and description",
      icon: "🔍"
    },
    {
      title: "Be Honest About Condition",
      description: "Clearly state if item is new, used, refurbished, or has damage",
      icon: "✅"
    },
    {
      title: "Highlight Unique Features",
      description: "Mention what makes your item special or valuable",
      icon: "⭐"
    },
    {
      title: "Include All Accessories",
      description: "List included items like chargers, manuals, boxes, etc.",
      icon: "📦"
    },
    {
      title: "Set Realistic Expectations",
      description: "Don't overprice - be willing to negotiate",
      icon: "💰"
    },
    {
      title: "Respond Quickly",
      description: "Buyers expect fast responses to inquiries",
      icon: "⚡"
    }
  ]

  const sellerVerificationSteps = [
    {
      title: "Access Seller Application",
      description: "Navigate to 'Become a Seller' from your dashboard",
      image: "/seller-apply-1.png"
    },
    {
      title: "Fill Business Details",
      description: "Provide your business name, type, and contact information",
      image: "/seller-apply-2.png"
    },
    {
      title: "Upload Documents",
      description: "Submit ID proof, address proof, and business documents",
      image: "/seller-apply-3.png"
    },
    {
      title: "Submit & Wait",
      description: "Application review takes 24-48 hours",
      image: "/seller-apply-4.png"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Store className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">How to Sell on SellX</h1>
            <p className="text-xl text-gray-600">Complete guide to becoming a successful seller</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step-by-Step Guide */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Step-by-Step Selling Guide</h2>
          <div className="space-y-8">
            {sellingSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
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

        {/* Seller Verification */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <UserCheck className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Seller Verification Process</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Get verified as a seller to build trust with buyers and access premium features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellerVerificationSteps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3">
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
              onClick={() => router.push('/become-seller')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply to Become a Seller
            </button>
          </div>
        </div>

        {/* Pricing Tips */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Pricing Tips by Category</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTips.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-gray-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Best Practices */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Star className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-blue-900">Listing Best Practices</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listingTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Managing Inquiries */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Managing Buyer Inquiries</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Respond within 1-2 hours during business hours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Be honest about item condition and availability</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Provide clear meeting instructions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Set clear expectations about payment methods</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety Precautions</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Meet in public, well-lit locations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Prefer cash payments in person</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Trust your instincts - cancel if uncomfortable</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Keep records of all communications</span>
                </li>
              </ul>
            </div>
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
        <div className="bg-green-600 text-white rounded-lg p-8 text-center">
          <Store className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Ready to Start Selling?</h3>
          <p className="text-green-100 mb-6">
            Join thousands of successful sellers on SellX. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/become-seller')}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Become a Seller
            </button>
            <button
              onClick={() => router.push('/support/new-ticket')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Get Help
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}