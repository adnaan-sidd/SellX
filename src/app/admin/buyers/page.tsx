"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"

interface Buyer {
  id: string
  phone: string
  name: string | null
  isVerified: boolean
  buyerIdUrl: string | null
  isSuspended: boolean
  createdAt: string
  _count?: {
    fraudReports: number
    supportTickets: number
  }
}

export default function AdminBuyers() {
  const router = useRouter()
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchBuyers()
  }, [searchQuery, statusFilter])

  const fetchBuyers = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter
      })

      const response = await fetch(`/api/admin/users/buyers?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBuyers(data.buyers)
      }
    } catch (error) {
      console.error('Failed to fetch buyers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, buyerId: string) => {
    setActionLoading(buyerId)

    try {
      const response = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: buyerId, userType: 'buyer' })
      })

      if (response.ok) {
        await fetchBuyers() // Refresh the list
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedBuyers.length === 0) return

    setActionLoading('bulk')

    try {
      const response = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: selectedBuyers, userType: 'buyer' })
      })

      if (response.ok) {
        setSelectedBuyers([])
        await fetchBuyers()
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Phone', 'Name', 'Verified', 'Suspended', 'Join Date', 'Fraud Reports', 'Support Tickets'],
      ...buyers.map(buyer => [
        buyer.phone,
        buyer.name || '',
        buyer.isVerified ? 'Yes' : 'No',
        buyer.isSuspended ? 'Yes' : 'No',
        new Date(buyer.createdAt).toLocaleDateString(),
        buyer._count?.fraudReports || 0,
        buyer._count?.supportTickets || 0
      ])
    ]

    const csvString = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `buyers-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (buyer: Buyer) => {
    if (buyer.isSuspended) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Suspended
        </span>
      )
    }

    if (buyer.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Unverified
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buyers...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Buyer Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor buyer accounts</p>
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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Buyers</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBuyers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedBuyers.length} buyer{selectedBuyers.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('suspend')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => handleBulkAction('unsuspend')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Unsuspend
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading === 'bulk'}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedBuyers.length === buyers.length && buyers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBuyers(buyers.map(b => b.id))
                        } else {
                          setSelectedBuyers([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBuyers.includes(buyer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBuyers(prev => [...prev, buyer.id])
                          } else {
                            setSelectedBuyers(prev => prev.filter(id => id !== buyer.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {buyer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {buyer.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(buyer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(buyer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>Fraud: {buyer._count?.fraudReports || 0}</div>
                        <div>Tickets: {buyer._count?.supportTickets || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/buyers/${buyer.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {buyer.buyerIdUrl && (
                          <button
                            onClick={() => window.open(buyer.buyerIdUrl!, '_blank')}
                            className="text-green-600 hover:text-green-900"
                            title="View ID"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleAction(buyer.isSuspended ? 'unsuspend' : 'suspend', buyer.id)}
                          disabled={actionLoading === buyer.id}
                          className={buyer.isSuspended ? "text-green-600 hover:text-green-900" : "text-yellow-600 hover:text-yellow-900"}
                          title={buyer.isSuspended ? "Unsuspend" : "Suspend"}
                        >
                          {buyer.isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleAction('delete', buyer.id)}
                          disabled={actionLoading === buyer.id}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {buyers.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No buyers found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No buyers have registered yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}