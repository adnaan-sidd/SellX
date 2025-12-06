import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <div className="w-32 h-32 mx-auto mb-6">
            <svg viewBox="0 0 128 128" className="w-full h-full text-gray-400">
              <path
                fill="currentColor"
                d="M64 16c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48zm0 80c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
                opacity="0.3"
              />
              <circle cx="64" cy="64" r="8" fill="currentColor" opacity="0.6" />
              <path
                fill="currentColor"
                d="M64 48c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 24c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page might have been moved,
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">Try searching for:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/products" className="text-blue-600 hover:text-blue-800">
              Browse Products
            </Link>
            <Link href="/categories" className="text-blue-600 hover:text-blue-800">
              Categories
            </Link>
            <Link href="/help-center" className="text-blue-600 hover:text-blue-800">
              Help Center
            </Link>
            <Link href="/contact-us" className="text-blue-600 hover:text-blue-800">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please{' '}
            <Link href="/contact-us" className="text-blue-600 hover:text-blue-800 font-medium">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}