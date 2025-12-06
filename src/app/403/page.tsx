import Link from 'next/link'
import { Shield, Lock, ArrowLeft, Home, User, AlertTriangle } from 'lucide-react'

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-16 h-16 text-red-600" />
          </div>
          <div className="text-6xl font-bold text-gray-300 mb-4">403</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Forbidden
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          You don't have permission to access this page. This could be due to insufficient
          privileges, account restrictions, or authentication issues.
        </p>

        {/* Possible Reasons */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
            Possible Reasons
          </h3>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <Lock className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
              <span>You need to log in to access this page</span>
            </div>
            <div className="flex items-start space-x-2">
              <User className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
              <span>Your account doesn't have the required permissions</span>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>You need to complete verification (seller/buyer)</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
              <span>Your account may be suspended or restricted</span>
            </div>
          </div>
        </div>

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

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Need to sell products?</span>
              <Link
                href="/become-seller"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Become a Seller
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Need buyer verification?</span>
              <Link
                href="/verify-buyer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Verify Account
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Account issues?</span>
              <Link
                href="/contact-us"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="mailto:support@sellx.com"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Email Support
            </a>
            <span className="text-gray-400">|</span>
            <Link
              href="/help-center"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}