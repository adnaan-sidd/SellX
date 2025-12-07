"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  Package, 
  ArrowLeft, 
  ArrowRight,
  Upload,
  X,
  MapPin,
  CheckCircle,
  DollarSign,
  FileText,
  Image as ImageIcon
} from "lucide-react"

interface FormData {
  category: string
  subcategory: string
  title: string
  description: string
  price: string
  condition: string
  images: File[]
  city: string
  state: string
  pincode: string
}

interface PaymentData {
  razorpayOrderId: string
  amount: number
}

const CATEGORIES = [
  {
    value: 'Electronics',
    subcategories: ['Mobiles', 'Laptops', 'TVs', 'Cameras', 'Gaming', 'Audio']
  },
  {
    value: 'Vehicles',
    subcategories: ['Cars', 'Bikes', 'Scooters', 'Bicycles', 'Commercial Vehicles']
  },
  {
    value: 'Home & Furniture',
    subcategories: ['Sofa', 'Beds', 'Tables', 'Chairs', 'Appliances', 'Decor']
  },
  {
    value: 'Fashion',
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Footwear', 'Accessories', 'Watches']
  },
  {
    value: 'Books & Sports',
    subcategories: ['Books', 'Sports Equipment', 'Fitness', 'Outdoor', 'Toys & Games']
  },
  {
    value: 'Pets',
    subcategories: ['Dogs', 'Cats', 'Birds', 'Fish', 'Pet Accessories']
  }
]

export default function PostProduct() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState<FormData>({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    price: "",
    condition: "",
    images: [],
    city: "",
    state: "",
    pincode: ""
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signup')
      return
    }

    const checkSellerStatus = async () => {
      try {
        const response = await fetch('/api/seller/status')
        const data = await response.json()

        if (response.ok) {
          if (data.sellerStatus !== 'APPROVED') {
            router.push('/seller-status')
            return
          }
        } else {
          router.push('/become-seller')
          return
        }
      } catch (error) {
        console.error('Failed to check seller status:', error)
        router.push('/become-seller')
        return
      } finally {
        setLoading(false)
      }
    }

    checkSellerStatus()
  }, [isAuthenticated, router])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-suggest location when pincode is entered
    if (field === 'pincode' && value.length === 6) {
      fetchLocationByPincode(value)
    }
  }

  const fetchLocationByPincode = async (pincode: string) => {
    try {
      const response = await fetch(`/api/location/pincode?pincode=${pincode}`)
      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          city: data.city,
          state: data.state
        }))
      } else {
        // Clear city and state if pincode is invalid
        setFormData(prev => ({
          ...prev,
          city: '',
          state: ''
        }))
        if (data.error !== 'Location not found for this pincode') {
          setError(data.error || 'Failed to fetch location')
        }
      }
    } catch (error) {
      console.error('Failed to fetch location:', error)
      setError('Failed to fetch location data')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (formData.images.length + files.length > 10) {
      setError("Maximum 10 images allowed")
      return
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError("Only image files are allowed")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB")
        return
      }
    }

    setError("")
    const newImages = [...formData.images, ...files]
    setFormData(prev => ({ ...prev, images: newImages }))

    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setFormData(prev => ({ ...prev, images: newImages }))
    setImagePreviews(newPreviews)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images]
    const newPreviews = [...imagePreviews]
    
    const [movedImage] = newImages.splice(fromIndex, 1)
    const [movedPreview] = newPreviews.splice(fromIndex, 1)
    
    newImages.splice(toIndex, 0, movedImage)
    newPreviews.splice(toIndex, 0, movedPreview)
    
    setFormData(prev => ({ ...prev, images: newImages }))
    setImagePreviews(newPreviews)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.category && formData.subcategory
      case 2:
        return formData.title && formData.description && formData.price && formData.condition
      case 3:
        return formData.images.length > 0
      case 4:
        return formData.city && formData.state && formData.pincode
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      setError("Please fill in all required fields")
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    setError("")
  }

  const handlePayment = async () => {
    if (!validateStep(5)) {
      setError("Please review all details")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Create payment order
      const paymentResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 25 })
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to create payment order')
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: 'INR',
        name: 'SellX',
        description: 'Product Listing Fee',
        order_id: paymentData.razorpayOrderId,
        handler: function (response: any) {
          verifyPayment(response, paymentData)
        },
        prefill: {
          name: user?.name || '',
          email: '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#3B82F6'
        }
      }

      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error: any) {
      setError(error.message || 'Payment initialization failed')
      setSubmitting(false)
    }
  }

  const verifyPayment = async (razorpayResponse: any, paymentData: PaymentData) => {
    try {
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          productData: formData
        })
      })

      const verifyData = await verifyResponse.json()

      if (verifyResponse.ok) {
        router.push(`/product/${verifyData.productId}?success=true`)
      } else {
        // Payment failed - show error and allow retry
        setError(verifyData.error || 'Payment verification failed. Please try again or contact support.')
        setSubmitting(false)

        // Optionally, you could show a retry button or redirect to payment again
        // For now, we'll just show the error and keep the form available
      }
    } catch (error: any) {
      console.error('Payment verification error:', error)
      setError('Network error during payment verification. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const selectedCategory = CATEGORIES.find(cat => cat.value === formData.category)
  const isLastStep = currentStep === 5

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Post Your Product</h1>
          <p className="text-gray-600 mt-2">Step {currentStep} of 5 - Complete your product listing</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Category', 'Details', 'Images', 'Location', 'Payment'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm ${currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step}
                </span>
                {index < 4 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Category</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleInputChange('category', category.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.category === category.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Package className="w-6 h-6 text-gray-600 mb-2" />
                    <h3 className="font-medium text-gray-900">{category.value}</h3>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose subcategory</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Product Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (max 70 characters)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value.slice(0, 70))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product title"
                  maxLength={70}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/70 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (max 5000 characters)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value.slice(0, 5000))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Describe your product in detail"
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="condition"
                        value="New"
                        checked={formData.condition === 'New'}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">New</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="condition"
                        value="Used"
                        checked={formData.condition === 'Used'}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Used</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h2>
              <p className="text-sm text-gray-600">Upload 1-10 images (max 5MB each). First image will be the main thumbnail.</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP (max 5MB each)</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, index - 1)}
                              className="p-1 bg-white rounded-full text-xs"
                            >
                              ←
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-500 text-white rounded-full text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index < imagePreviews.length - 1 && (
                            <button
                              onClick={() => moveImage(index, index + 1)}
                              className="p-1 bg-white rounded-full text-xs"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pincode"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Payment</h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                    <p className="text-gray-600">{formData.category} - {formData.subcategory}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Price</h3>
                    <p className="text-gray-600">₹{formData.price}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-2">Title</h3>
                    <p className="text-gray-600">{formData.title}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{formData.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Condition</h3>
                    <p className="text-gray-600">{formData.condition}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600">{formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-2">Images</h3>
                    <p className="text-gray-600">{formData.images.length} image(s) uploaded</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">Listing Fee:</span>
                  <span className="text-2xl font-bold text-green-600">₹25</span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePayment}
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5" />
                        <span>Pay ₹25 to List Product</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="text-center">
                      <button
                        onClick={() => {
                          setError("")
                          handlePayment()
                        }}
                        disabled={submitting}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Retry Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {!isLastStep ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}