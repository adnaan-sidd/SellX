"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  Phone,
  User,
  MapPin,
  Camera
} from "lucide-react"

interface FormData {
  name: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  governmentId: File | null
  selfieWithId: File | null
}

export default function BecomeSeller() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    governmentId: null,
    selfieWithId: null
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [previewGovtId, setPreviewGovtId] = useState<string | null>(null)
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: 'governmentId' | 'selfieWithId', file: File | null) => {
    if (!file) {
      setFormData(prev => ({ ...prev, [field]: null }))
      if (field === 'governmentId') setPreviewGovtId(null)
      if (field === 'selfieWithId') setPreviewSelfie(null)
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or PDF file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setError("")
    setFormData(prev => ({ ...prev, [field]: file }))

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (field === 'governmentId') {
          setPreviewGovtId(e.target?.result as string)
        } else {
          setPreviewSelfie(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Basic validation
    if (!formData.name || !formData.email || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (!formData.governmentId) {
      setError("Government ID is required")
      setLoading(false)
      return
    }

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('address', formData.address)
      submitData.append('city', formData.city)
      submitData.append('state', formData.state)
      submitData.append('pincode', formData.pincode)
      submitData.append('governmentId', formData.governmentId)
      if (formData.selfieWithId) {
        submitData.append('selfieWithId', formData.selfieWithId)
      }

      const response = await fetch('/api/seller/apply', {
        method: 'POST',
        body: submitData
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Application submission failed')
      }
    } catch (error) {
      setError('An error occurred during submission')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Your seller application has been submitted successfully. You'll be notified within 24 hours.
          </p>
          <button
            onClick={() => router.push('/seller-status')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Check Application Status
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Seller</h1>
            <p className="text-gray-600">
              Fill out the form below to start selling on SellX
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={user?.phone || ""}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Phone is verified via OTP</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government ID * (Aadhar/PAN/DL)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange('governmentId', e.target.files?.[0] || null)}
                    className="hidden"
                    id="govt-id-upload"
                  />
                  <label htmlFor="govt-id-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF (max 5MB)</p>
                  </label>
                </div>
                {previewGovtId && (
                  <div className="mt-2">
                    <img
                      src={previewGovtId}
                      alt="Government ID Preview"
                      className="max-w-xs max-h-32 rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selfie with ID (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('selfieWithId', e.target.files?.[0] || null)}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                    <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                  </label>
                </div>
                {previewSelfie && (
                  <div className="mt-2">
                    <img
                      src={previewSelfie}
                      alt="Selfie Preview"
                      className="max-w-xs max-h-32 rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Your application will be reviewed within 24 hours. You'll receive email updates on the status.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}