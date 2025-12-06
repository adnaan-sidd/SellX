"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Camera,
  Building,
  Ban,
  Package,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Save,
  X
} from "lucide-react"

interface SellerDetail {
  id: string
  phone: string
  name: string | null
  sellerStatus: string
  sellerDetails: any
  isSuspended: boolean
  createdAt: string
  products: Array<{
    id: string
    title: string
    status: string
    createdAt: string
  }>
  _count: {
    products: number
  }
}

export default function SellerDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [seller, setSeller] = useState<SellerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (id) {
      fetchSellerDetail()
    }
  }, [id])

  const fetchSellerDetail = async () => {
    try {
      const response = await fetch(`/api/admin/users/sellers/${id}`)
      const data = await response.json()

      if (response.ok) {
        setSeller(data.seller)
      }
    } catch (error) {
      console.error('Failed to fetch seller detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/users/approve-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: id })
      })

      if (response.ok) {
        await fetchSellerDetail() // Refresh data
      }
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return

    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/users/reject-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: id, reason: rejectReason })
      })

      if (response.ok) {
        setShowRejectForm(false)
        setRejectReason("")
        await fetchSellerDetail() // Refresh data
      }
    } catch (error) {
      console.error('Rejection failed:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    setActionLoading(true)

    try {
      const response = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: id, userType: 'seller' })
      })

      if (response.ok) {
        await fetchSellerDetail() // Refresh data
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
          <p className="text-gray-600">Loading seller details...</p>
        </div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Seller Not Found</h2>
          <p className="text-gray-600 mb-4">The requested seller could not be found.</p>
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

  const activeProducts = seller.products.filter(p => p.status === 'ACTIVE').length
  const totalProducts = seller.products.length

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
                <h1 className="text-3xl font-bold text-gray-900">Seller Details</h1>
                <p className="text-gray-600 mt-1">Review and manage seller application</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {seller.sellerStatus === 'PENDING' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    Approve Seller
                  </button>

                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    Reject Seller
                  </button>
                </>
              )}

              <button
                onClick={() => handleAction(seller.isSuspended ? 'unsuspend' : 'suspend')}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  seller.isSuspended
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                } disabled:opacity-50`}
              >
                {seller.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="flex items-center mt-1">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{seller.name || 'Not provided'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{seller.phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{seller.sellerDetails?.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Application Date</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {new Date(seller.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Seller Status</label>
                    <div className="flex items-center mt-1">
                      {seller.isSuspended ? (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-red-700">Suspended</span>
                        </>
                      ) : seller.sellerStatus === 'APPROVED' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-green-700">Approved</span>
                        </>
                      ) : seller.sellerStatus === 'PENDING' ? (
                        <>
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-yellow-700">Pending Review</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-red-700">Rejected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            {seller.sellerDetails && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <p className="text-gray-900">{seller.sellerDetails.name || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Type</label>
                      <p className="text-gray-900">{seller.sellerDetails.businessType || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{seller.sellerDetails.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Documents */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Government ID */}
                {seller.sellerDetails?.govIdUrl && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Government ID</p>
                          <p className="text-sm text-gray-600">ID proof document</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(seller.sellerDetails.govIdUrl, '_blank')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                )}

                {/* Selfie */}
                {seller.sellerDetails?.selfieUrl && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Camera className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Selfie</p>
                          <p className="text-sm text-gray-600">Identity verification</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(seller.sellerDetails.selfieUrl, '_blank')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
                  <div className="text-sm text-blue-800">Total Listings</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
                  <div className="text-sm text-green-800">Active Listings</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}%
                  </div>
                  <div className="text-sm text-purple-800">Active Rate</div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            {seller.products.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Products</h2>
                <div className="space-y-3">
                  {seller.products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600">
                          Listed on {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'SUSPENDED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Review Actions */}
            {seller.sellerStatus === 'PENDING' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Review Application</h3>

                {!showRejectForm ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      ✓ Approve Seller
                    </button>

                    <button
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      ✗ Reject Seller
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-yellow-900">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      rows={4}
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={handleReject}
                        disabled={actionLoading || !rejectReason.trim()}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        Confirm Rejection
                      </button>

                      <button
                        onClick={() => {
                          setShowRejectForm(false)
                          setRejectReason("")
                        }}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAction(seller.isSuspended ? 'unsuspend' : 'suspend')}
                  disabled={actionLoading}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    seller.isSuspended
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  } disabled:opacity-50`}
                >
                  {seller.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
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

            {/* Account Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Account Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">User ID:</span>
                  <span className="text-blue-900 font-mono">{seller.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Status:</span>
                  <span className={`font-medium ${
                    seller.isSuspended ? 'text-red-600' :
                    seller.sellerStatus === 'APPROVED' ? 'text-green-600' :
                    seller.sellerStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {seller.isSuspended ? 'Suspended' : seller.sellerStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Products:</span>
                  <span className="text-blue-900 font-medium">{totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Active Products:</span>
                  <span className="text-blue-900 font-medium">{activeProducts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}