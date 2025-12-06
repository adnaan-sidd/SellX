import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, MessageSquare } from 'lucide-react'

export default function ServerError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          <div className="text-6xl font-bold text-gray-300 mb-4">500</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Server Error
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          We're experiencing technical difficulties. Our team has been notified and is working
          to resolve this issue as quickly as possible.
        </p>

        {/* What happened */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What happened?</h3>
          <p className="text-sm text-gray-600">
            Something went wrong on our servers. This could be due to a temporary issue,
            maintenance, or an unexpected error.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Status Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">System Status</h3>
          <p className="text-sm text-blue-800 mb-3">
            Our monitoring systems are actively tracking this issue. Most server errors
            are resolved within minutes.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700">Investigating</span>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">Need immediate help?</span>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            If this error persists or affects your ability to use SellX, please contact our support team.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact-us"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-center text-sm"
            >
              Contact Support
            </Link>

            <a
              href="mailto:support@sellx.com"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center text-sm"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Error ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}