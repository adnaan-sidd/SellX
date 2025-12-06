"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  FileText,
  ArrowLeft,
  Eye,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"

interface FraudReport {
  id: string
  reason: string
  description: string | null
  status: string
  createdAt: string
  product: {
    id: string
    title: string
    images: string[]
  }
}

export default function MyReports() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<FraudReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/fraud-reports/my-reports')
        const data = await response.json()

        if (response.ok) {
          setReports(data.reports)
        } else {
          setError(data.error || 'Failed to fetch reports')
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error)
        setError('Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchReports()
    }
  }, [isAuthenticated])

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'fake_product': 'Fake product',
      'fraud_seller': 'Fraud seller',
      'wrong_information': 'Wrong information',
      'overpriced_product': 'Overpriced product',
      'scam_misleading': 'Scam/Misleading',
      'other': 'Other'
    }
    return labels[reason] || reason
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Open
          </span>
        )
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Eye className="w-3 h-3 mr-1" />
            Under Review
          </span>
        )
      case 'CLOSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Closed
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
              <p className="text-gray-600 mt-2">Track the status of your fraud reports</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
              <div className="text-sm text-gray-600">Total reports</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-4">
              You haven't submitted any fraud reports yet.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={report.product.images[0] || '/placeholder-product.jpg'}
                          alt={report.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Report Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                          {report.product.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>Reason: {getReasonLabel(report.reason)}</span>
                          <span>•</span>
                          <span>Report ID: {report.id.slice(-8)}</span>
                        </div>
                        {report.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {report.description}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Reported on {formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(report.status)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {report.status === 'OPEN' && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Awaiting review from our team
                        </span>
                      )}
                      {report.status === 'UNDER_REVIEW' && (
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          Currently under investigation
                        </span>
                      )}
                      {report.status === 'CLOSED' && (
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Investigation completed
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => router.push(`/product/${report.product.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">About Fraud Reports</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  Fraud reports help maintain a safe marketplace for all users. Our team reviews each report carefully
                  and takes appropriate action when fraud is confirmed.
                </p>
                <p>
                  <strong>Report Status:</strong> Open → Under Review → Closed
                </p>
                <p>
                  You can submit up to 5 reports per day. Duplicate reports for the same product are not allowed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}