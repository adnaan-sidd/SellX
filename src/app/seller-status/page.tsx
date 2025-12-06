"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  FileText,
  AlertCircle,
  ArrowLeft
} from "lucide-react"

interface SellerStatus {
  role: string
  sellerStatus: string
  sellerDetails: {
    name: string
    email: string
    address: string
    city: string
    state: string
    pincode: string
  } | null
}

export default function SellerStatus() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sellerData, setSellerData] = useState<SellerStatus | null>(null)

  useEffect(() => {
    const fetchSellerStatus = async () => {
      try {
        const response = await fetch('/api/seller/status')
        const data = await response.json()
        
        if (response.ok) {
          setSellerData(data)
        }
      } catch (error) {
        console.error('Failed to fetch seller status:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchSellerStatus()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading seller status...</p>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    if (!sellerData || sellerData.role !== 'SELLER') {
      return {
        status: 'NOT_APPLIED',
        icon: FileText,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        title: 'No Application Found',
        description: 'You haven\'t applied to become a seller yet.'
      }
    }

    switch (sellerData.sellerStatus) {
      case 'PENDING':
        return {
          status: 'PENDING',
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'Application Under Review',
          description: 'Your seller application is being reviewed by our team. You\'ll be notified within 24 hours.'
        }
      case 'APPROVED':
        return {
          status: 'APPROVED',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'Seller Application Approved!',
          description: 'Congratulations! You can now start posting products and selling on SellX.'
        }
      case 'REJECTED':
        return {
          status: 'REJECTED',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'Application Rejected',
          description: 'Your seller application was not approved. Please review the feedback and reapply.'
        }
      default:
        return {
          status: 'UNKNOWN',
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          title: 'Unknown Status',
          description: 'There was an issue with your seller application. Please contact support.'
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  const handleAction = () => {
    if (statusInfo.status === 'APPROVED') {
      router.push('/post-product')
    } else if (statusInfo.status === 'NOT_APPLIED') {
      router.push('/become-seller')
    } else if (statusInfo.status === 'REJECTED') {
      router.push('/become-seller')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <StatusIcon className={`w-10 h-10 ${statusInfo.color}`} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusInfo.title}</h1>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>

          {sellerData?.sellerDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Application Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-600">{sellerData.sellerDetails.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{sellerData.sellerDetails.email}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="text-gray-600">
                    {sellerData.sellerDetails.address}, {sellerData.sellerDetails.city}, {sellerData.sellerDetails.state} - {sellerData.sellerDetails.pincode}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {statusInfo.status === 'APPROVED' && (
              <button
                onClick={() => router.push('/home')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </button>
            )}
            
            {(statusInfo.status === 'NOT_APPLIED' || statusInfo.status === 'REJECTED') && (
              <button
                onClick={handleAction}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {statusInfo.status === 'NOT_APPLIED' ? 'Apply to Become Seller' : 'Reapply as Seller'}
              </button>
            )}

            {statusInfo.status === 'PENDING' && (
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Status</span>
              </button>
            )}

            {statusInfo.status === 'APPROVED' && (
              <button
                onClick={handleAction}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Post Your First Product
              </button>
            )}
          </div>

          {statusInfo.status === 'PENDING' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our team will verify your documents within 24 hours</li>
                <li>• You'll receive email updates on your application status</li>
                <li>• Once approved, you can start posting products immediately</li>
                <li>• If rejected, you'll get specific feedback to improve your application</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}