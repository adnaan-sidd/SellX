"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  ArrowLeft,
  Upload,
  X,
  Send,
  User,
  Mail,
  Phone,
  FileText,
  HelpCircle
} from "lucide-react"

export default function NewSupportTicket() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    category: '',
    description: '',
    screenshot: null as File | null
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'Account Issues',
    'Payment Problems',
    'Verification Issues',
    'Product Listing Issues',
    'Chat Problems',
    'Report Fraud',
    'Other'
  ]

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        mobile: user.phone || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Screenshot must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      setFormData(prev => ({ ...prev, screenshot: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.description.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.description.length > 1000) {
      setError('Description must be less than 1000 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('mobile', formData.mobile)
      submitData.append('email', formData.email)
      submitData.append('category', formData.category)
      submitData.append('description', formData.description.trim())

      if (formData.screenshot) {
        submitData.append('screenshot', formData.screenshot)
      }

      const response = await fetch('/api/support/create-ticket', {
        method: 'POST',
        body: submitData
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/support/tickets?success=true&ticket=${data.ticketNumber}`)
      } else {
        setError(data.error || 'Failed to create support ticket')
      }
    } catch (error) {
      console.error('Ticket creation error:', error)
      setError('Failed to create support ticket')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
            <p className="text-gray-600">Get help from our support team</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your mobile number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Issue Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Issue Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Please describe your issue in detail. Include any relevant information that might help us resolve your issue faster."
                    maxLength={1000}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshot (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    {formData.screenshot ? (
                      <div className="space-y-2">
                        <div className="text-green-600 font-medium">Screenshot selected</div>
                        <div className="text-sm text-gray-600">{formData.screenshot.name}</div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setFormData(prev => ({ ...prev, screenshot: null }))
                          }}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div className="text-sm text-gray-600">
                          Click to upload screenshot
                        </div>
                        <div className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Support Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  Our support team typically responds within 24 hours. For urgent issues,
                  please include as much detail as possible in your description.
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to resolve most issues within 2-3 business days.
                </p>
                <p>
                  <strong>Follow-up:</strong> You can add more information to your ticket after submission
                  by visiting your tickets page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}