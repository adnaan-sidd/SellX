"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import ProductSkeleton from '@/components/ProductSkeleton'
import SellButton from '@/components/SellButton'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  city: string
  state: string
  createdAt: string
  seller: {
    id: string
    name: string | null
    phone: string
  }
}

interface PaginationData {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    city: '',
    sort: 'newest'
  })

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      })

      const response = await fetch(`/api/products/list?${params}`)
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handlePageChange = (page: number) => {
    fetchProducts(page)
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">SellX</h1>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar
                value={filters.search}
                onChange={(search) => handleFilterChange({ search })}
                onSearch={() => fetchProducts()}
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Chats</button>
              <button
                onClick={() => router.push('/my-reports')}
                className="text-gray-600 hover:text-gray-900"
              >
                My Reports
              </button>

              {/* Account Dropdown */}
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <span>My Account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => router.push('/my-listings')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Listings
                    </button>
                    <button
                      onClick={() => router.push('/support/tickets')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Tickets
                    </button>
                    <button
                      onClick={() => router.push('/support/new-ticket')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                      </svg>
                      <span>Report an Issue</span>
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => router.push('/help-center')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Help Center
                    </button>
                    <button
                      onClick={() => router.push('/safety')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Safety Guidelines
                    </button>
                  </div>
                </div>
              </div>

              <SellButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onChange={handleFilterChange}
              onApply={() => fetchProducts()}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {pagination ? `${pagination.total} Products Found` : 'Products'}
              </h2>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 20 }).map((_, i) => <ProductSkeleton key={i} />)
                : products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SellX</h3>
              <p className="text-gray-600 mb-4">
                Your trusted marketplace for buying and selling products locally.
                Safe, secure, and easy to use.
              </p>
              <button
                onClick={() => router.push('/support/new-ticket')}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
                <span>Report an Issue</span>
              </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => router.push('/help/buying')} className="hover:text-gray-900">How to Buy</button></li>
                <li><button onClick={() => router.push('/help/selling')} className="hover:text-gray-900">How to Sell</button></li>
                <li><button onClick={() => router.push('/safety')} className="hover:text-gray-900">Safety Tips</button></li>
                <li><button onClick={() => router.push('/help/verification')} className="hover:text-gray-900">Verification</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => router.push('/help-center')} className="hover:text-gray-900">Help Center</button></li>
                <li><button onClick={() => router.push('/my-reports')} className="hover:text-gray-900">Report Fraud</button></li>
                <li><button onClick={() => router.push('/support/tickets')} className="hover:text-gray-900">My Tickets</button></li>
                <li><button onClick={() => router.push('/help/payments')} className="hover:text-gray-900">Payment Help</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 SellX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}