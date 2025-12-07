import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'

interface ProductCardProps {
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

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

          {/* Status Badge */}
          {product.status !== 'ACTIVE' && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {product.status}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{product.city}, {product.state}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-400 text-xs mt-2">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(product.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
