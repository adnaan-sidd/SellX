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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-indigo-50 shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Monitor and manage your SellX platform with real-time insights</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Date Range Filter */}
              <div className="flex items-center space-x-3 bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
                <Filter className="w-5 h-5 text-blue-600" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
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
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="font-semibold">Refresh</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Buyers */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 mb-1">Total Buyers</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">{stats?.totalBuyers || 0}</p>
                <p className="text-sm text-green-600 font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {stats?.verifiedBuyers || 0} verified
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Sellers */}
          <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Total Sellers</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">{stats?.totalSellers || 0}</p>
                <div className="text-sm space-y-1">
                  <p className="text-yellow-600 font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {stats?.pendingSellers || 0} pending
                  </p>
                  <p className="text-green-600 font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {stats?.approvedSellers || 0} approved
                  </p>
                  <p className="text-red-600 font-medium flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {stats?.rejectedSellers || 0} rejected
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700 mb-1">Total Products</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">{stats?.totalProducts || 0}</p>
                <div className="text-sm space-y-1">
                  <p className="text-green-600 font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {stats?.activeProducts || 0} active
                  </p>
                  <p className="text-red-600 font-medium flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {stats?.suspendedProducts || 0} suspended
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700 mb-1">Total Revenue</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-1">₹{stats?.totalRevenue || 0}</p>
                <p className="text-sm text-gray-600 font-medium">From listing fees</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Fraud Reports */}
          <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">Fraud Reports</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-1">{stats?.openFraudReports || 0}</p>
                <p className="text-sm text-red-600 font-medium">Open reports</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Support Tickets */}
          <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-orange-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-700 mb-1">Support Tickets</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">{(stats?.openTickets || 0) + (stats?.inProgressTickets || 0)}</p>
                <div className="text-sm space-y-1">
                  <p className="text-blue-600 font-medium flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {stats?.openTickets || 0} open
                  </p>
                  <p className="text-orange-600 font-medium flex items-center">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {stats?.inProgressTickets || 0} in progress
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Today's Signups */}
          <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-indigo-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-700 mb-1">Today's Signups</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent mb-1">{stats?.todaySignups || 0}</p>
                <p className="text-sm text-gray-600 font-medium">New users</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Today's Listings */}
          <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-pink-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-pink-700 mb-1">Today's Listings</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent mb-1">{stats?.todayListings || 0}</p>
                <p className="text-sm text-gray-600 font-medium">New products</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Revenue Trend</h3>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Products by Category */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Products by Category</h3>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.categories || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">User Distribution</h3>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.userDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {analytics?.userDistribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Active Users */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-indigo-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Daily Active Users</h3>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.dailyActive || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8B5CF6"
                    fill="url(#areaGradient)"
                    fillOpacity={0.6}
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">Quick Actions</h3>
              <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-2 rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/admin/sellers')}
                className="w-full group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center space-x-3"
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Review Seller Applications</span>
              </button>

              <button
                onClick={() => router.push('/admin/fraud-reports')}
                className="w-full group bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center space-x-3"
              >
                <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>View Fraud Reports</span>
              </button>

              <button
                onClick={() => router.push('/admin/support')}
                className="w-full group bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-2xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center space-x-3"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Pending Tickets</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">Recent Activity</h3>
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-2 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100">
                  <div className="flex-shrink-0 mt-1 p-2 bg-gray-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{activity.title}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">{activity.description}</p>
                    <p className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full inline-block">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-2xl inline-block mb-4">
                    <Eye className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No recent activity</p>
                  <p className="text-sm text-gray-500 mt-1">Activity will appear here as users interact with the platform</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}