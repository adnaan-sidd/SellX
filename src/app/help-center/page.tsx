"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Shield,
  CreditCard,
  UserCheck,
  MessageCircle,
  ShoppingCart,
  Store,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "account-creation",
    question: "How do I create an account?",
    answer: "To create an account on SellX, click the 'Sign Up' button and provide your phone number. You'll receive an OTP for verification. Once verified, you can complete your profile with your name and other details.",
    category: "Account"
  },
  {
    id: "buyer-verification",
    question: "How to verify as a buyer?",
    answer: "Go to the 'Verify Buyer' page from your dashboard. Upload a clear photo of your government-issued ID (Aadhaar, PAN, or Passport) and a selfie. Our team will verify your documents within 24-48 hours.",
    category: "Verification"
  },
  {
    id: "seller-verification",
    question: "How to become a seller?",
    answer: "Apply to become a seller by filling out the seller application form. Provide your business details, upload required documents (ID proof, address proof), and submit for approval. Once approved, you can start listing products.",
    category: "Selling"
  },
  {
    id: "listing-fee",
    question: "Why is there a ₹25 listing fee?",
    answer: "The ₹25 listing fee helps maintain platform quality by discouraging spam listings and covering verification costs. This fee is only charged once per listing and helps ensure serious sellers use our platform.",
    category: "Selling"
  },
  {
    id: "edit-listing",
    question: "How do I edit my listing?",
    answer: "Go to 'My Listings' from your dashboard, find the product you want to edit, and click the 'Edit' button. You can update photos, description, price, and other details. Changes are saved automatically.",
    category: "Selling"
  },
  {
    id: "report-fraud",
    question: "How to report a fraudulent product?",
    answer: "Click the 'Report' button (flag icon) on any product page. Select the reason for reporting, provide details, and optionally upload screenshots. Our team reviews all reports within 24 hours.",
    category: "Safety"
  },
  {
    id: "payment-issue",
    question: "What if I face a payment issue?",
    answer: "If you encounter payment issues, first check your internet connection and try again. For listing fee refunds, contact support within 7 days of payment. Include your order ID and describe the issue.",
    category: "Payments"
  },
  {
    id: "contact-support",
    question: "How to contact support?",
    answer: "Use the 'Support' section in your account dropdown or visit the help center. Create a support ticket with your issue details. We typically respond within 24 hours.",
    category: "Support"
  },
  {
    id: "delete-account",
    question: "How to delete my account?",
    answer: "Account deletion requests must be submitted through support. Go to 'Support' > 'New Ticket' and select 'Account Deletion' as the category. We'll process your request within 7-10 business days.",
    category: "Account"
  },
  {
    id: "chat-work",
    question: "How does chat work?",
    answer: "Verified buyers can start chats with sellers. Click 'Chat with Seller' on any product page. Messages are encrypted and real-time. You can share images and block users if needed. All chats are monitored for safety.",
    category: "Buying"
  }
]

const HELP_SECTIONS = [
  {
    title: "Getting Started",
    icon: UserCheck,
    pages: [
      { title: "How to Buy", href: "/help/buying", description: "Step-by-step buying guide" },
      { title: "How to Sell", href: "/help/selling", description: "Complete selling guide" },
      { title: "Verification", href: "/help/verification", description: "Account verification process" }
    ]
  },
  {
    title: "Safety & Security",
    icon: Shield,
    pages: [
      { title: "Safety Guidelines", href: "/safety", description: "Stay safe on SellX" },
      { title: "Report Fraud", href: "/my-reports", description: "Report suspicious activity" }
    ]
  },
  {
    title: "Payments & Billing",
    icon: CreditCard,
    pages: [
      { title: "Payment Help", href: "/help/payments", description: "Payment methods and refunds" }
    ]
  },
  {
    title: "Support",
    icon: MessageCircle,
    pages: [
      { title: "Contact Support", href: "/support/new-ticket", description: "Get help from our team" },
      { title: "My Tickets", href: "/support/tickets", description: "View your support tickets" }
    ]
  }
]

export default function HelpCenter() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{[key: string]: boolean}>({})

  const filteredFAQs = FAQ_DATA.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFeedback = (faqId: string, helpful: boolean) => {
    setFeedback(prev => ({ ...prev, [faqId]: helpful }))
    // In a real app, this would send feedback to analytics
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
            <p className="text-xl text-gray-600">Find answers to your questions and get the help you need</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Quick Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {HELP_SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <section.icon className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.pages.map((page) => (
                  <button
                    key={page.href}
                    onClick={() => router.push(page.href)}
                    className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{page.title}</div>
                    <div className="text-sm text-gray-600">{page.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>

                    {/* Feedback */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Was this helpful?</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFeedback(faq.id, true)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                              feedback[faq.id] === true
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Yes</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, false)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                              feedback[faq.id] === false
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>No</span>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push('/support/new-ticket')}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <span>Still need help?</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any FAQs matching "{searchQuery}"
              </p>
              <button
                onClick={() => router.push('/support/new-ticket')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Contact Support
              </button>
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mt-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you with any questions or issues you may have.
          </p>
          <button
            onClick={() => router.push('/support/new-ticket')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}