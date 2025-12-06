"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  Package,
  ArrowLeft,
  CheckCircle,
  Download,
  Share2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Heart,
  Flag,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  Eye,
  User,
  Star,
  Send
} from "lucide-react"
import VerificationBadge from "@/components/VerificationBadge"

interface Product {
  id: string
  title: string
  description: string
  price: number
  condition: string
  category: string
  subcategory: string
  images: string[]
  city: string
  state: string
  pincode: string
  status: string
  createdAt: string
  seller: {
    id: string
    name: string
    phone: string
    sellerStatus: string
    createdAt: string
    _count?: {
      products: number
    }
  }
}

interface Payment {
  id: string
  amount: number
  type: string
  razorpayOrderId: string
  status: string
  createdAt: string
}

interface RelatedProduct {
  id: string
  title: string
  price: number
  images: string[]
  city: string
  state: string
  createdAt: string
}

export default function ProductDetail() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const productId = params.id as string
  const isSuccess = searchParams.get('success') === 'true'

  const [product, setProduct] = useState<Product | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isBuyerVerified, setIsBuyerVerified] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportScreenshot, setReportScreenshot] = useState<File | null>(null)
  const [submittingReport, setSubmittingReport] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productResponse = await fetch(`/api/products/${productId}`)
        const productData = await productResponse.json()

        if (productResponse.ok) {
          setProduct(productData.product)

          // If success=true, fetch payment details
          if (isSuccess && productData.product.paymentId) {
            const paymentResponse = await fetch(`/api/payments/${productData.product.paymentId}`)
            if (paymentResponse.ok) {
              const paymentData = await paymentResponse.json()
              setPayment(paymentData.payment)
            }
          }

          // Fetch related products
          const relatedResponse = await fetch(`/api/products/list?category=${productData.product.category}&limit=6`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedProducts(relatedData.products.filter((p: any) => p.id !== productId).slice(0, 6))
          }
        } else {
          setError(productData.error || 'Failed to fetch product')
        }

        // Check buyer verification status
        if (isAuthenticated) {
          const verificationResponse = await fetch('/api/buyer/verification-status')
          if (verificationResponse.ok) {
            const verificationData = await verificationResponse.json()
            setIsBuyerVerified(verificationData.isVerified)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId, isSuccess, isAuthenticated])

  const handleDownloadReceipt = () => {
    // Create a simple receipt text
    const receiptText = `
SellX Product Listing Receipt
============================

Product ID: ${product?.id}
Title: ${product?.title}
Price: ₹${product?.price}

Payment Details:
Amount: ₹${payment?.amount}
Order ID: ${payment?.razorpayOrderId}
Status: ${payment?.status}
Date: ${payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : ''}

Seller: ${product?.seller.name}
Phone: ${product?.seller.phone}

Thank you for using SellX!
    `.trim()

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sellx-receipt-${product?.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${product?.title}`,
        text: `I just listed "${product?.title}" on SellX for ₹${product?.price}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  // Show success receipt if payment was successful
  if (isSuccess && payment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your product has been listed successfully</p>
          </div>

          {/* Receipt Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Receipt</h2>
              <p className="text-gray-600">Product ID: {product.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{product.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{product.category} - {product.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium">{product.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{product.city}, {product.state} - {product.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium text-green-600">₹{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium font-mono text-sm">{payment.razorpayOrderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {payment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-medium">
                      {new Date(payment.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            {product.images.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Product</span>
            </button>

            <button
              onClick={() => router.push('/my-listings')}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>View My Listings</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Image navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const openFullscreen = (index: number) => {
    setCurrentImageIndex(index)
    setShowFullscreen(true)
  }

  // Action handlers
  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement favorite API call
  }

  const handleReportFraud = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting')
      return
    }

    setSubmittingReport(true)
    try {
      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('reason', reportReason)
      if (reportDescription.trim()) {
        formData.append('description', reportDescription.trim())
      }
      if (reportScreenshot) {
        formData.append('screenshot', reportScreenshot)
      }

      const response = await fetch('/api/fraud-reports', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Report submitted successfully! Report ID: ${data.reportId}`)
        setShowReportModal(false)
        setReportReason('')
        setReportDescription('')
        setReportScreenshot(null)
      } else {
        alert(data.error || 'Failed to submit report')
      }
    } catch (error) {
      console.error('Report submission error:', error)
      alert('Failed to submit report')
    } finally {
      setSubmittingReport(false)
    }
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Screenshot must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      setReportScreenshot(file)
    }
  }

  const handleChat = () => {
    // TODO: Implement chat functionality
    alert('Chat functionality coming soon!')
  }

  const handleMakeOffer = () => {
    // TODO: Implement make offer functionality
    alert('Make offer functionality coming soon!')
  }

  // Regular product view (for buyers or when not showing receipt)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button onClick={() => router.push('/')} className="hover:text-blue-600 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </button>
            <span>/</span>
            <button onClick={() => router.push('/')} className="hover:text-blue-600">
              {product.category}
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openFullscreen(currentImageIndex)}
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 rounded-full ${isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                  >
                    <Flag className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Package className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium">{product.category} - {product.subcategory}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Condition: <span className="font-medium">{product.condition}</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{product.city}, {product.state} - {product.pincode}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Posted {new Date(product.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isBuyerVerified ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Eye className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Verification Required</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Complete buyer verification to view seller contact information and start chatting.
                  </p>
                  <button
                    onClick={() => router.push('/verify-buyer')}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Verify as Buyer
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{showPhone ? product.seller.phone : 'Show Phone Number'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleChat}
                      className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={handleMakeOffer}
                      className="bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Make Offer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Category
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Subcategory
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.subcategory}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Condition
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.condition}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Location
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.city}, {product.state} - {product.pincode}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Posted Date
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Product ID
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {product.id}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Status
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'SOLD'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Seller Information Card */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Seller Information</h2>

          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {product.seller.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{product.seller.name}</h3>
                {product.seller.sellerStatus === 'APPROVED' && (
                  <VerificationBadge isVerified={true} showText={true} />
                )}
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>Member since {new Date(product.seller.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long'
                  })}</span>
                </div>

                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  <span>{product.seller._count?.products || 0} active listings</span>
                </div>

                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Response rate: 95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => router.push(`/product/${relatedProduct.id}`)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 text-sm">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{relatedProduct.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {relatedProduct.city}, {relatedProduct.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {product.images.length}
          </div>
        </div>
      )}

      {/* Report Fraud Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Fraud</h3>

            <div className="space-y-4">
              {/* Reason Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for reporting <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a reason</option>
                  <option value="fake_product">Fake product</option>
                  <option value="fraud_seller">Fraud seller</option>
                  <option value="wrong_information">Wrong information</option>
                  <option value="overpriced_product">Overpriced product</option>
                  <option value="scam_misleading">Scam/Misleading</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please provide additional details about why you're reporting this listing..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">{reportDescription.length}/1000 characters</p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshot (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    {reportScreenshot ? (
                      <div className="space-y-2">
                        <div className="text-green-600 font-medium">Screenshot selected</div>
                        <div className="text-sm text-gray-600">{reportScreenshot.name}</div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setReportScreenshot(null)
                          }}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-gray-400">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                          Click to upload screenshot
                        </div>
                        <div className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowReportModal(false)
                  setReportReason('')
                  setReportDescription('')
                  setReportScreenshot(null)
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReportFraud}
                disabled={submittingReport || !reportReason}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}