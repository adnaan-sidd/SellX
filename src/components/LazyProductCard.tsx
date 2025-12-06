import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load ProductCard with loading fallback
const ProductCard = dynamic(() => import('./ProductCard'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-4">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  ),
  ssr: true // Enable SSR for better SEO
})

interface LazyProductCardProps {
  product: {
    id: string
    title: string
    price: number
    images: string[]
    city: string
    state: string
    createdAt: string
    status: string
  }
}

export default function LazyProductCard({ product }: LazyProductCardProps) {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    }>
      <ProductCard product={product} />
    </Suspense>
  )
}