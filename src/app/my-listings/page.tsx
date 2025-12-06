"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  Package,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  AlertTriangle
} from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  city: string
  state: string
  createdAt: string
  status: string
  views: number
  inquiries: number
}

export default function MyListings() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyListings()
    }
  }, [isAuthenticated])

  const fetchMyListings = async () => {
    try {
      const response = await fetch('/api/products/my-listings')
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
      } else {
        setError(data.error || 'Failed to fetch listings')
      }
    } catch (error) {
      console.error('Failed to fetch my listings:', error)
      setError('Failed to fetch listings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(prev => prev.filter(product => product.id !== productId))
      } else {
        setError('Failed to delete listing')
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
      setError('Failed to delete listing')
    }
  }

  const handleMarkAsSold = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SOLD' })
      })

      if (response.ok) {
        setProducts(prev =>
          prev.map(product =>
            product.id === productId
              ? { ...product, status: 'SOLD' }
              : product
          )
        )
      } else {
        setError('Failed to update listing')
      }
    } catch (error) {
      console.error('Failed to mark as sold:', error)
      setError('Failed to update listing')
    }
  }

  const filteredProducts = products.filter(product => {
    switch (filter) {
      case 'active':
        return product.status === 'ACTIVE'
      case 'sold':
        return product.status === 'SOLD'
      case 'suspended':
        return product.status === 'SUSPENDED'
      default:
        return true
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        )
      case 'SOLD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sold
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStats = () => {
    const total = products.length
    const active = products.filter(p => p.status === 'ACTIVE').length
    const sold = products.filter(p => p.status === 'SOLD').length
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalInquiries = products.reduce((sum, p) => sum + (p.inquiries || 0), 0)

    return { total, active, sold, totalViews, totalInquiries }
  }

  const stats = getStats()

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-2">Manage your product listings and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sold</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'sold', label: 'Sold' },
                  { value: 'suspended', label: 'Suspended' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredProducts.length} of {products.length} listings
              </div>
              <button
                onClick={() => router.push('/post-product')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Post New Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all'
                ? "You haven't posted any products yet."
                : `No ${filter} listings found.`}
            </p>
            <button
              onClick={() => router.push('/post-product')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Post Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(product.status)}
                  </div>
                  {product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      +{product.images.length - 1}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.title}
                  </h3>

                  <p className="text-lg font-bold text-gray-900 mb-2">
                    ₹{product.price.toLocaleString()}
                  </p>

                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{product.city}, {product.state}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Posted {formatDate(product.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{product.views || 0} views</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>{product.inquiries || 0} inquiries</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>

                    {product.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => router.push(`/product/${product.id}/edit`)}
                          className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleMarkAsSold(product.id)}
                          className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Sold</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}