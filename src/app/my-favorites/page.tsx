"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  Heart,
  MapPin,
  Calendar,
  MessageSquare,
  Star,
  RefreshCw,
  Package
} from "lucide-react"

interface FavoriteProduct {
  id: string
  title: string
  price: number
  images: string[]
  city: string
  state: string
  createdAt: string
  seller: {
    name: string
    phone: string
  }
}

export default function MyFavorites() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites()
    }
  }, [isAuthenticated])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      const data = await response.json()

      if (response.ok) {
        setFavorites(data.favorites)
      } else {
        setError(data.error || 'Failed to fetch favorites')
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
      setError('Failed to fetch favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id !== productId))
      } else {
        setError('Failed to remove from favorites')
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      setError('Failed to remove from favorites')
    }
  }

  const handleContactSeller = (product: FavoriteProduct) => {
    // Navigate to product page with contact intent
    router.push(`/product/${product.id}?contact=true`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-2">Products you've saved for later</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing products and save the ones you like for easy access later.
            </p>
            <button
              onClick={() => router.push('/home')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
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
                      <span>Saved {formatDate(product.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      <span>Seller: {product.seller.name}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Package className="w-4 h-4" />
                      <span>View Product</span>
                    </button>

                    <button
                      onClick={() => handleContactSeller(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Star className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Favorite Tips</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Click the heart icon to quickly remove items from favorites</li>
                  <li>• Use the "Contact" button to start a conversation with the seller</li>
                  <li>• Favorites are saved across all your devices</li>
                  <li>• You can favorite unlimited products</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}