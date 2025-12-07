"use client"

import { signOut } from "next-auth/react"
import {
  User,
  MapPin,
  Calendar,
  Edit,
  Shield,
  CheckCircle,
  Star,
  Package,
  MessageSquare,
  AlertTriangle,
  TrendingUp
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  phone: string
  email?: string
  profilePhoto?: string
  city?: string
  state?: string
  bio?: string
  role: string
  isVerified: boolean
  buyerIdUrl?: string
  sellerStatus?: string
  createdAt: string
  _count?: {
    products: number
    chats: number
    fraudReports: number
  }
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalChats: 0,
    totalReports: 0
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProfileCompletion = () => {
    if (!profile) return 0

    let completed = 0
    let total = 6

    if (profile.name) completed++
    if (profile.email) completed++
    if (profile.profilePhoto) completed++
    if (profile.city && profile.state) completed++
    if (profile.bio) completed++
    if (profile.isVerified) completed++

    return Math.round((completed / total) * 100)
  }

  const getVerificationBadge = () => {
    if (!profile) return null

    if (profile.role === 'SELLER' && profile.sellerStatus === 'APPROVED') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Verified Seller
        </span>
      )
    }

    if (profile.role === 'BUYER' && profile.isVerified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Shield className="w-4 h-4 mr-1" />
          Verified Buyer
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <AlertTriangle className="w-4 h-4 mr-1" />
        Unverified
      </span>
    )
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  const completionPercentage = getProfileCompletion()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600 mt-1">{profile.phone}</p>
                  {profile.email && (
                    <p className="text-gray-600">{profile.email}</p>
                  )}
                </div>

                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {getVerificationBadge()}

                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>

                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Location and Join Date */}
              <div className="mt-4 flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                {profile.city && profile.state && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{profile.city}, {profile.state}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long'
                  })}</span>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-gray-700 max-w-2xl">{profile.bio}</p>
              )}

              {/* Profile Completion */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Products Listed */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products Listed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
            </div>
          </div>

          {/* Total Chats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats}</p>
              </div>
            </div>
          </div>

          {/* Reports Filed */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reports Filed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.role === 'SELLER' && profile.sellerStatus === 'APPROVED' && (
              <button
                onClick={() => router.push('/post-product')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Post New Product</p>
                  <p className="text-sm text-gray-600">List an item for sale</p>
                </div>
              </button>
            )}

            <button
              onClick={() => router.push('/my-listings')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Listings</p>
                <p className="text-sm text-gray-600">Manage your products</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/my-favorites')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Star className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Favorites</p>
                <p className="text-sm text-gray-600">Saved products</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/chats')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Chats</p>
                <p className="text-sm text-gray-600">Messages & inquiries</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/my-reports')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Reports</p>
                <p className="text-sm text-gray-600">Fraud reports filed</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/settings')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Account Settings</p>
                <p className="text-sm text-gray-600">Privacy & preferences</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}