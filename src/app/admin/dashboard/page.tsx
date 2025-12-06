"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  Store,
  Package,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Stats {
  totalBuyers: number
  verifiedBuyers: number
  totalSellers: number
  pendingSellers: number
  approvedSellers: number
  rejectedSellers: number
  totalProducts: number
  activeProducts: number
  suspendedProducts: number
  totalRevenue: number
  openFraudReports: number
  openTickets: number
  inProgressTickets: number
  todaySignups: number
  todayListings: number
}

interface ActivityItem {
  id: string
  type: 'product' | 'seller' | 'fraud' | 'ticket'
  title: string
  description: string
  timestamp: string
  status?: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<Stats | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/home')
      return
    }

    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchDashboardData()
    }
  }, [isAuthenticated, user, dateRange])

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)

      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      const statsData = await statsResponse.json()
      setStats(statsData.stats)

      // Fetch analytics
      const analyticsResponse = await fetch(`/api/admin/analytics?range=${dateRange}`)
      const analyticsData = await analyticsResponse.json()
      setAnalytics(analyticsData)

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/activity')
      const activityData = await activityResponse.json()
      setRecentActivity(activityData.activity)

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleExportCSV = () => {
    // Create CSV content
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Buyers', stats?.totalBuyers || 0],
      ['Verified Buyers', stats?.verifiedBuyers || 0],
      ['Total Sellers', stats?.totalSellers || 0],
      ['Pending Sellers', stats?.pendingSellers || 0],
      ['Approved Sellers', stats?.approvedSellers || 0],
      ['Rejected Sellers', stats?.rejectedSellers || 0],
      ['Total Products', stats?.totalProducts || 0],
      ['Active Products', stats?.activeProducts || 0],
      ['Suspended Products', stats?.suspendedProducts || 0],
      ['Total Revenue', `₹${stats?.totalRevenue || 0}`],
      ['Open Fraud Reports', stats?.openFraudReports || 0],
      ['Open Tickets', stats?.openTickets || 0],
      ['In Progress Tickets', stats?.inProgressTickets || 0],
      ['Today\'s Signups', stats?.todaySignups || 0],
      ['Today\'s Listings', stats?.todayListings || 0]
    ]

    const csvString = csvContent.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sellx-admin-stats-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4 text-blue-600" />
      case 'seller': return <Store className="w-4 h-4 text-green-600" />
      case 'fraud': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'ticket': return <MessageSquare className="w-4 h-4 text-orange-600" />
      default: return <Eye className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null

    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'REJECTED': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'OPEN': { color: 'bg-blue-100 text-blue-800', icon: Eye },
      'IN_PROGRESS': { color: 'bg-orange-100 text-orange-800', icon: RefreshCw }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (user?.role !== 'ADMIN') {
    router.push('/home')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage your SellX platform</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Date Range Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Buyers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Buyers</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalBuyers || 0}</p>
                <p className="text-sm text-green-600">
                  {stats?.verifiedBuyers || 0} verified
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Sellers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sellers</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalSellers || 0}</p>
                <div className="text-sm space-y-1">
                  <p className="text-yellow-600">{stats?.pendingSellers || 0} pending</p>
                  <p className="text-green-600">{stats?.approvedSellers || 0} approved</p>
                  <p className="text-red-600">{stats?.rejectedSellers || 0} rejected</p>
                </div>
              </div>
              <Store className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                <div className="text-sm space-y-1">
                  <p className="text-green-600">{stats?.activeProducts || 0} active</p>
                  <p className="text-red-600">{stats?.suspendedProducts || 0} suspended</p>
                </div>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats?.totalRevenue || 0}</p>
                <p className="text-sm text-gray-600">From listing fees</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Fraud Reports */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.openFraudReports || 0}</p>
                <p className="text-sm text-red-600">Open reports</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{(stats?.openTickets || 0) + (stats?.inProgressTickets || 0)}</p>
                <div className="text-sm space-y-1">
                  <p className="text-blue-600">{stats?.openTickets || 0} open</p>
                  <p className="text-orange-600">{stats?.inProgressTickets || 0} in progress</p>
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          {/* Today's Signups */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Signups</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.todaySignups || 0}</p>
                <p className="text-sm text-gray-600">New users</p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          {/* Today's Listings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Listings</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.todayListings || 0}</p>
                <p className="text-sm text-gray-600">New products</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Products by Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.categories || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.userDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics?.userDistribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Active Users */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.dailyActive || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/sellers')}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Review Seller Applications</span>
              </button>

              <button
                onClick={() => router.push('/admin/fraud-reports')}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>View Fraud Reports</span>
              </button>

              <button
                onClick={() => router.push('/admin/support')}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Pending Tickets</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}