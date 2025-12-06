"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Plus
} from "lucide-react"

interface SupportTicket {
  id: string
  ticketNumber: string
  email: string
  category: string
  description: string
  screenshot: string | null
  status: string
  adminReply: string | null
  replies: any[] | null
  createdAt: string
  updatedAt: string
}

interface Reply {
  id: string
  content: string
  isAdmin: boolean
  createdAt: string
}

export default function TicketDetail() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newReply, setNewReply] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/support/tickets/${ticketId}`)
        const data = await response.json()

        if (response.ok) {
          setTicket(data.ticket)
        } else {
          setError(data.error || 'Failed to fetch ticket')
        }
      } catch (error) {
        console.error('Failed to fetch ticket:', error)
        setError('Failed to fetch ticket')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && ticketId) {
      fetchTicket()
    }
  }, [isAuthenticated, ticketId])

  const handleAddReply = async () => {
    if (!newReply.trim()) return

    setSubmittingReply(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newReply.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setNewReply('')
        // Refresh ticket data
        const ticketResponse = await fetch(`/api/support/tickets/${ticketId}`)
        if (ticketResponse.ok) {
          const ticketData = await ticketResponse.json()
          setTicket(ticketData.ticket)
        }
      } else {
        alert(data.error || 'Failed to add reply')
      }
    } catch (error) {
      console.error('Failed to add reply:', error)
      alert('Failed to add reply')
    } finally {
      setSubmittingReply(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-2" />
            Open
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            In Progress
          </span>
        )
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resolved
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusTimeline = () => {
    const timeline = [
      { status: 'OPEN', label: 'Ticket Created', date: ticket?.createdAt, completed: true },
      { status: 'IN_PROGRESS', label: 'In Progress', date: ticket?.status !== 'OPEN' ? ticket?.updatedAt : null, completed: ticket?.status === 'IN_PROGRESS' || ticket?.status === 'RESOLVED' },
      { status: 'RESOLVED', label: 'Resolved', date: ticket?.status === 'RESOLVED' ? ticket?.updatedAt : null, completed: ticket?.status === 'RESOLVED' }
    ]
    return timeline
  }

  if (!isAuthenticated) {
    router.push('/signup')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading ticket...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Tickets</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{ticket.ticketNumber}</h1>
              <p className="text-gray-600 mt-1">{ticket.category}</p>
            </div>
            {getStatusBadge(ticket.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
              </div>

              {/* Screenshot */}
              {ticket.screenshot && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Screenshot</h3>
                  <img
                    src={ticket.screenshot}
                    alt="Issue screenshot"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}

              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Submitted on {formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Admin Reply */}
            {ticket.adminReply && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-blue-900">Support Team</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Admin Reply
                      </span>
                    </div>
                    <p className="text-blue-800 leading-relaxed">{ticket.adminReply}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      {formatDate(ticket.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Replies */}
            {ticket.replies && ticket.replies.length > 0 && (
              <div className="space-y-4">
                {ticket.replies.map((reply: Reply) => (
                  <div key={reply.id} className={`border rounded-lg p-6 ${reply.isAdmin ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${reply.isAdmin ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{reply.isAdmin ? 'Support Team' : 'You'}</span>
                          {reply.isAdmin && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              Admin Reply
                            </span>
                          )}
                        </div>
                        <p className={`leading-relaxed ${reply.isAdmin ? 'text-blue-800' : 'text-gray-800'}`}>
                          {reply.content}
                        </p>
                        <div className={`mt-2 text-xs ${reply.isAdmin ? 'text-blue-600' : 'text-gray-600'}`}>
                          {formatDate(reply.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Reply */}
            {ticket.status !== 'RESOLVED' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add More Information</h3>
                <div className="space-y-4">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Provide additional details or respond to support..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {newReply.length}/1000 characters
                    </span>
                    <button
                      onClick={handleAddReply}
                      disabled={submittingReply || !newReply.trim()}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReply ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {getStatusTimeline().map((step, index) => (
                  <div key={step.status} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Ticket ID:</span>
                  <p className="font-mono text-gray-900">{ticket.ticketNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Category:</span>
                  <p className="text-gray-900">{ticket.category}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Email:</span>
                  <p className="text-gray-900">{ticket.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Last Updated:</span>
                  <p className="text-gray-900">{formatDate(ticket.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/support/new-ticket')}
                  className="w-full flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Ticket</span>
                </button>
                <button
                  onClick={() => router.push('/support/tickets')}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  <span>View All Tickets</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}