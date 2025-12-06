"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  AlertTriangle,
  FileText,
  Ban,
  Trash2,
  Mail
} from "lucide-react"

interface BuyerDetail {
  id: string
  phone: string
  name: string | null
  isVerified: boolean
  buyerIdUrl: string | null
  isSuspended: boolean
  createdAt: string
  fraudReports: Array<{
    id: string
    reason: string
    status: string
    createdAt: string
    product: {
      title: string
    }
  }>
  supportTickets: Array<{
    id: string
    category: string
    description: string
    status: string
    createdAt: string
  }>
  _count: {
    chats: number
  }
}

export default function BuyerDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [buyer, setBuyer] = useState<BuyerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchBuyerDetail()
    }
  }, [id])

  const fetchBuyerDetail = async () => {
    try {
      const response = await fetch(`/api/admin/users/buyers/${id}`)
      const data = await response.json()

      if (response.ok) {
        setBuyer(data.buyer)
      }
    } catch (error) {
      console.error('Failed to fetch buyer detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: id, userType: 'buyer' })
      })

      if (response.ok) {
        await fetchBuyerDetail() // Refresh data
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buyer details...</p>
        </div>
      </div>
    )
  }

  if (!buyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Buyer Not Found</h2>
          <p className="text-gray-600 mb-4">The requested buyer could not be found.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Buyer Details</h1>
                <p className="text-gray-600 mt-1">Manage buyer account and view activity</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAction(buyer.isSuspended ? 'unsuspend' : 'suspend')}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  buyer.isSuspended
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                } disabled:opacity-50`}
              >
                {buyer.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
              </button>

              <button
                onClick={() => handleAction('delete')}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{buyer.phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="flex items-center mt-1">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{buyer.name || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {new Date(buyer.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <div className="flex items-center mt-1">
                      {buyer.isSuspended ? (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-red-700">Suspended</span>
                        </>
                      ) : buyer.isVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-green-700">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-yellow-700">Unverified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Document */}
            {buyer.buyerIdUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Government ID</h2>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">ID Document</p>
                        <p className="text-sm text-gray-600">Government issued identification</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(buyer.buyerIdUrl!, '_blank')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Document
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{buyer._count.chats}</div>
                  <div className="text-sm text-blue-800">Chats Initiated</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{buyer.fraudReports.length}</div>
                  <div className="text-sm text-orange-800">Fraud Reports</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{buyer.supportTickets.length}</div>
                  <div className="text-sm text-purple-800">Support Tickets</div>
                </div>
              </div>
            </div>

            {/* Fraud Reports */}
            {buyer.fraudReports.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fraud Reports Filed</h2>
                <div className="space-y-4">
                  {buyer.fraudReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{report.product.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'OPEN'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{report.reason}</p>
                      <p className="text-xs text-gray-500">
                        Reported on {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Tickets */}
            {buyer.supportTickets.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Support Tickets</h2>
                <div className="space-y-4">
                  {buyer.supportTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{ticket.category}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'OPEN'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                      <p className="text-xs text-gray-500">
                        Created on {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAction(buyer.isSuspended ? 'unsuspend' : 'suspend')}
                  disabled={actionLoading}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    buyer.isSuspended
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  } disabled:opacity-50`}
                >
                  {buyer.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                </button>

                <button
                  onClick={() => handleAction('delete')}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">User ID:</span>
                  <span className="text-blue-900 font-mono">{buyer.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Phone:</span>
                  <span className="text-blue-900">{buyer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Verified:</span>
                  <span className={`font-medium ${buyer.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {buyer.isVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Suspended:</span>
                  <span className={`font-medium ${buyer.isSuspended ? 'text-red-600' : 'text-green-600'}`}>
                    {buyer.isSuspended ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}