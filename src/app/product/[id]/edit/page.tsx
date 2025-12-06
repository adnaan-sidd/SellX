"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  Package,
  ArrowLeft,
  Upload,
  X,
  MapPin,
  CheckCircle,
  Save,
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

interface Product {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  condition: string
  category: string
  subcategory: string
  images: string[]
  city: string
  state: string
  pincode: string
  status: string
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

export default function EditProduct() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()

        if (response.ok) {
          const product: Product = data.product

          // Check if user owns this product
          if (product.sellerId !== user?.id) {
            router.push('/my-listings')
            return
          }

          setFormData({
            category: product.category,
            subcategory: product.subcategory,
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            condition: product.condition,
            images: [],
            city: product.city,
            state: product.state,
            pincode: product.pincode
          })

          setExistingImages(product.images)
          setImagePreviews(product.images)
        } else {
          setError(data.error || 'Failed to fetch product')
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && productId) {
      fetchProduct()
    }
  }, [isAuthenticated, productId, user?.id, router])

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

    if (existingImages.length + formData.images.length + files.length > 10) {
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
    if (index < existingImages.length) {
      // Removing existing image
      const newExistingImages = existingImages.filter((_, i) => i !== index)
      const newPreviews = imagePreviews.filter((_, i) => i !== index)
      setExistingImages(newExistingImages)
      setImagePreviews(newPreviews)
    } else {
      // Removing newly uploaded image
      const adjustedIndex = index - existingImages.length
      const newImages = formData.images.filter((_, i) => i !== adjustedIndex)
      const newPreviews = imagePreviews.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, images: newImages }))
      setImagePreviews(newPreviews)
    }
  }

  const validateForm = () => {
    return formData.title &&
           formData.description &&
           formData.price &&
           formData.condition &&
           formData.category &&
           formData.subcategory &&
           formData.city &&
           formData.state &&
           formData.pincode &&
           (existingImages.length > 0 || formData.images.length > 0)
  }

  const handleSave = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields")
      return
    }

    setSaving(true)
    setError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('condition', formData.condition)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('subcategory', formData.subcategory)
      formDataToSend.append('city', formData.city)
      formDataToSend.append('state', formData.state)
      formDataToSend.append('pincode', formData.pincode)

      // Add existing images
      existingImages.forEach((image, index) => {
        formDataToSend.append('existingImages', image)
      })

      // Add new images
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image)
      })

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: formDataToSend
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/my-listings')
      } else {
        setError(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      setError('Failed to update product')
    } finally {
      setSaving(false)
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
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  const selectedCategory = CATEGORIES.find(cat => cat.value === formData.category)

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

          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update your product listing</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Category</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                  Subcategory
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

          {/* Product Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>

            <div className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            <p className="text-sm text-gray-600 mb-4">Upload 1-10 images (max 5MB each). First image will be the main thumbnail.</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
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
                      <button
                        onClick={() => removeImage(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-500 text-white rounded-full text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
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

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}