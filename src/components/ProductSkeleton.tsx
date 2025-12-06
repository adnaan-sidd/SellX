export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  )
}