'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Package, Heart, ShoppingCart, TrendingUp, Plus, Star } from 'lucide-react'

export default function Dashboard() {
  const { data: session } = useSession()

  if (!session) return null

  const isSeller = session.user.role === 'SELLER' || session.user.sellerStatus

  const buyerStats = [
    { name: 'Active Orders', value: '0', icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Favorite Items', value: '0', icon: Heart, color: 'text-red-600' },
    { name: 'Reviews Given', value: '0', icon: Star, color: 'text-yellow-600' },
  ]

  const sellerStats = [
    { name: 'Active Listings', value: '0', icon: Package, color: 'text-green-600' },
    { name: 'Total Sales', value: '₹0', icon: TrendingUp, color: 'text-purple-600' },
    { name: 'Average Rating', value: '0.0', icon: Star, color: 'text-yellow-600' },
  ]

  const stats = isSeller ? sellerStats : buyerStats

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          {isSeller
            ? 'Manage your listings and track your sales performance.'
            : 'Discover great deals and manage your purchases.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gray-100`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isSeller ? (
            <>
              <Link
                href="/post-product"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Post New Product</p>
                  <p className="text-sm text-gray-600">List an item for sale</p>
                </div>
              </Link>
              <Link
                href="/my-listings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">My Listings</p>
                  <p className="text-sm text-gray-600">Manage your products</p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Browse Products</p>
                  <p className="text-sm text-gray-600">Find items to buy</p>
                </div>
              </Link>
              <Link
                href="/my-favorites"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">My Favorites</p>
                  <p className="text-sm text-gray-600">Saved items</p>
                </div>
              </Link>
            </>
          )}
          <Link
            href="/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Update Profile</p>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity to show.</p>
          <p className="text-sm mt-1">
            {isSeller
              ? 'Start by posting your first product!'
              : 'Start browsing products to see activity here.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
