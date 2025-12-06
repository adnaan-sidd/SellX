"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  User,
  DollarSign,
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  Edit,
  Save,
  X,
  Ban,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare
} from "lucide-react"

interface ProductDetail {
  id: string
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
  createdAt: string
  paymentId: string | null
  seller: {
    id: string
    name: string | null
    phone: string
  }
  payment?: {
    id: string
    amount: number
    razorpayOrderId: string
    status: string
    createdAt: string
  }
  _count: {
    chats: number
  }
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

export default function AdminProductDetail() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isEditMode = searchParams.get('edit') === 'true'

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    status: ''
  })

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
  }, [id])

  useEffect(() => {
    if (product) {
      setEditForm({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        status: product.status
      })
    }
  }, [product])

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      const data = await response.json()

      if (response.ok) {
        setProduct(data.product)
      }
    } catch (error) {
      console.error('Failed to fetch product detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          ...editForm,
          price: parseFloat(editForm.price)
        })
      })

      if (response.ok) {
        await fetchProductDetail() // Refresh data
        router.push(`/admin/products/${id}`) // Exit edit mode
      }
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAction = async (action: string) => {
    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/products/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productId: id })
      })

      if (response.ok) {
        await fetchProductDetail() // Refresh data
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        )
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Suspended
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The requested product could not be found.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const selectedCategory = CATEGORIES.find(cat => cat.value === product.category)

  if (isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                  <p className="text-gray-600 mt-1">Modify product details</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push(`/admin/products/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (max 70 characters)
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value.slice(0, 70) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={70}
              />
              <p className="text-xs text-gray-500 mt-1">{editForm.title.length}/70 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (max 5000 characters)
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value.slice(0, 5000) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                maxLength={5000}
              />
              <p className="text-xs text-gray-500 mt-1">{editForm.description.length}/5000 characters</p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                <p className="text-gray-600 mt-1">Manage product listing and view information</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/admin/products/${id}?edit=true`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Product</span>
              </button>

              <button
                onClick={() => handleAction(product.status === 'SUSPENDED' ? 'activate' : 'suspend')}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  product.status === 'SUSPENDED'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                } disabled:opacity-50`}
              >
                {product.status === 'SUSPENDED' ? 'Activate Listing' : 'Suspend Listing'}
              </button>

              <button
                onClick={() => handleAction('delete')}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
              {product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No images available</p>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{product.title}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-green-600">₹{product.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category} - {product.subcategory}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">{product.condition}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{product.city}, {product.state} - {product.pincode}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(product.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Payment Information */}
            {product.payment && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">₹{product.payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm">{product.payment.razorpayOrderId}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        product.payment.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(product.payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{product.seller.name || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{product.seller.phone}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{product._count.chats} inquiries</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => router.push(`/admin/sellers/${product.seller.id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Seller Profile
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Product ID:</span>
                  <span className="text-blue-900 font-mono">{product.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Images:</span>
                  <span className="text-blue-900 font-medium">{product.images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Inquiries:</span>
                  <span className="text-blue-900 font-medium">{product._count.chats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Payment:</span>
                  <span className={`font-medium ${
                    product.paymentId ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.paymentId ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  View Public Listing
                </button>

                <button
                  onClick={() => router.push(`/admin/products/${product.id}?edit=true`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Product
                </button>

                <button
                  onClick={() => handleAction(product.status === 'SUSPENDED' ? 'activate' : 'suspend')}
                  disabled={actionLoading}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    product.status === 'SUSPENDED'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  } disabled:opacity-50`}
                >
                  {product.status === 'SUSPENDED' ? 'Activate Listing' : 'Suspend Listing'}
                </button>

                <button
                  onClick={() => handleAction('delete')}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}