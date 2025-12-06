"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  FileText,
  ArrowLeft,
  Plus,
  Eye,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"

interface SupportTicket {
  id: string
  ticketNumber: string
  category: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
  adminReply?: string
  replies?: any[]
}

export default function SupportTickets() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const newTicketNumber = searchParams.get('ticket')

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (success === 'true' && newTicketNumber) {
      setShowSuccessMessage(true)
      // Remove success params from URL after showing message
      setTimeout(() => {
        router.replace('/support/tickets', undefined)
      }, 5000)
    }
  }, [success, newTicketNumber, router])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/support/my-tickets')
        const data = await response.json()

        if (response.ok) {
          setTickets(data.tickets)
        } else {
          setError(data.error || 'Failed to fetch tickets')
        }
      } catch (error) {
        console.error('Failed to fetch tickets:', error)
        setError('Failed to fetch tickets')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchTickets()
    }
  }, [isAuthenticated])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Open
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            In Progress
          </span>
        )
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    return {
      all: tickets.length,
      OPEN: tickets.filter(t => t.status === 'OPEN').length,
      IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length
    }
  }

  const statusCounts = getStatusCounts()

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Support ticket created successfully!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Ticket #{newTicketNumber} has been submitted. Our team will respond within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

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
              <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
              <p className="text-gray-600 mt-2">Track and manage your support requests</p>
            </div>
            <button
              onClick={() => router.push('/support/new-ticket')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="OPEN">Open ({statusCounts.OPEN})</option>
                <option value="IN_PROGRESS">In Progress ({statusCounts.IN_PROGRESS})</option>
                <option value="RESOLVED">Resolved ({statusCounts.RESOLVED})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tickets.length === 0 ? 'No support tickets found' : 'No tickets match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {tickets.length === 0
                ? "You haven't submitted any support tickets yet."
                : "Try adjusting your search or filter criteria."}
            </p>
            <button
              onClick={() => router.push('/support/new-ticket')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/support/tickets/${ticket.id}`)}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {ticket.ticketNumber}
                        </h3>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Category:</span> {ticket.category}
                      </p>
                      <p className="text-gray-700 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Created {formatDate(ticket.createdAt)}</span>
                      </div>
                      {ticket.adminReply && (
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>Has response</span>
                        </div>
                      )}
                    </div>

                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Response Time:</strong> Our support team typically responds within 24 hours.
                </p>
                <p>
                  <strong>Status Updates:</strong> OPEN → IN_PROGRESS → RESOLVED
                </p>
                <p>
                  <strong>Follow-up:</strong> You can add more information to any ticket by clicking "View Details".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}