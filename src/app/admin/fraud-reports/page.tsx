"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  MoreHorizontal,
  FileText,
  User,
  Calendar,
  Image as ImageIcon,
  X
} from "lucide-react"

interface FraudReport {
  id: string
  reason: string
  description?: string
  screenshot?: string
  status: string
  createdAt: string
  reporter: {
    id: string
    name: string | null
    phone: string
  }
  product: {
    id: string
    title: string
    images: string[]
  }
}

export default function AdminFraudReports() {
  const router = useRouter()
  const [reports, setReports] = useState<FraudReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reasonFilter, setReasonFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<FraudReport | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [searchQuery, statusFilter, reasonFilter])

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        reason: reasonFilter
      })

      const response = await fetch(`/api/admin/fraud-reports?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, reportId: string, notes?: string) => {
    setActionLoading(reportId)

    try {
      const response = await fetch('/api/admin/fraud-reports/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reportId, notes })
      })

      if (response.ok) {
        await fetchReports() // Refresh the list
        setShowModal(false)
        setSelectedReport(null)
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Report ID', 'Product', 'Reporter', 'Reason', 'Status', 'Date'],
      ...reports.map(report => [
        report.id,
        report.product.title,
        report.reporter.name || report.reporter.phone,
        report.reason,
        report.status,
        new Date(report.createdAt).toLocaleDateString()
      ])
    ]

    const csvString = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fraud-reports-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Open
          </span>
        )
      case 'CLOSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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

  const getReasonBadge = (reason: string) => {
    const colors = {
      'Fake Product': 'bg-red-100 text-red-800',
      'Scam': 'bg-orange-100 text-orange-800',
      'Inappropriate Content': 'bg-purple-100 text-purple-800',
      'Counterfeit': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[reason as keyof typeof colors] || colors.Other}`}>
        {reason}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fraud reports...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Fraud Reports</h1>
              <p className="text-gray-600 mt-1">Review and manage fraud reports</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Reason Filter */}
            <div>
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reasons</option>
                <option value="Fake Product">Fake Product</option>
                <option value="Scam">Scam</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Counterfeit">Counterfeit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {report.product.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={report.product.images[0]}
                              alt={report.product.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {report.product.title}
                          </div>
                          <div className="text-sm text-gray-500">ID: {report.product.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.reporter.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{report.reporter.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getReasonBadge(report.reason)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedReport(report)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No fraud reports found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all' || reasonFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No fraud reports have been submitted yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Fraud Report Details</h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedReport(null)
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Report ID:</span>
                        <span className="font-mono text-sm">{selectedReport.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reason:</span>
                        {getReasonBadge(selectedReport.reason)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(selectedReport.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedReport.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reporter Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporter Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{selectedReport.reporter.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{selectedReport.reporter.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedReport.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
                    </div>
                  )}
                </div>

                {/* Product Information & Actions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reported Product</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {selectedReport.product.images.length > 0 ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={selectedReport.product.images[0]}
                              alt={selectedReport.product.title}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{selectedReport.product.title}</h4>
                          <p className="text-sm text-gray-600">ID: {selectedReport.product.id}</p>
                          <button
                            onClick={() => router.push(`/admin/products/${selectedReport.product.id}`)}
                            className="text-blue-600 hover:text-blue-900 text-sm mt-1"
                          >
                            View Product →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Screenshot */}
                  {selectedReport.screenshot && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Screenshot</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <img
                          src={selectedReport.screenshot}
                          alt="Fraud report screenshot"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {selectedReport.status === 'OPEN' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAction('suspend_product', selectedReport.id)}
                          disabled={actionLoading === selectedReport.id}
                          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                        >
                          Suspend Product
                        </button>

                        <button
                          onClick={() => handleAction('suspend_seller', selectedReport.id)}
                          disabled={actionLoading === selectedReport.id}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          Suspend Seller
                        </button>

                        <button
                          onClick={() => handleAction('close_no_action', selectedReport.id)}
                          disabled={actionLoading === selectedReport.id}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Close Report (No Action)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}