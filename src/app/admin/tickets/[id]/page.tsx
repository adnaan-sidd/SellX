"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  MessageSquare,
  Send,
  Paperclip,
  FileText,
  Calendar,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  X,
  Download
} from "lucide-react"

interface TicketMessage {
  id: string
  message: string
  isFromAdmin: boolean
  createdAt: string
  adminNotes?: string
  attachments?: string[]
}

interface SupportTicket {
  id: string
  ticketNumber: string
  category: string
  status: string
  priority: string
  description: string
  screenshot?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    phone: string
  }
  messages: TicketMessage[]
}

const CANNED_RESPONSES = {
  'Account Issues': [
    {
      title: 'Account Verification Required',
      message: 'To resolve your account issue, we need you to verify your identity. Please provide a government-issued ID and a selfie for verification.'
    },
    {
      title: 'Password Reset Instructions',
      message: 'You can reset your password by clicking "Forgot Password" on the login page. If you\'re still having issues, please try clearing your browser cache.'
    }
  ],
  'Payment Problems': [
    {
      title: 'Payment Processing Delay',
      message: 'Your payment is being processed and may take 24-48 hours to reflect in your account. Please check back later or contact your bank.'
    },
    {
      title: 'Refund Processing',
      message: 'Your refund request has been received and is being processed. Refunds typically take 5-7 business days to appear in your account.'
    }
  ],
  'Product Listing': [
    {
      title: 'Listing Approval Process',
      message: 'Your product listing is under review. Our team will approve it within 24 hours. You\'ll receive a notification once it\'s live.'
    },
    {
      title: 'Listing Guidelines',
      message: 'Please ensure your listing follows our guidelines: clear photos, accurate description, and competitive pricing. Check our seller guidelines for more details.'
    }
  ],
  'Technical Issues': [
    {
      title: 'Browser Compatibility',
      message: 'Please try using a different browser (Chrome, Firefox, or Safari) or clear your browser cache. Also ensure you have the latest browser version.'
    },
    {
      title: 'Mobile App Issues',
      message: 'We\'re aware of the mobile app issue and our development team is working on a fix. Please use the web version in the meantime.'
    }
  ]
}

export default function AdminTicketDetail() {
  const { id } = useParams()
  const router = useRouter()

  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")
  const [sendingReply, setSendingReply] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showCannedResponses, setShowCannedResponses] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTicketDetail()
    }
  }, [id])

  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status)
      setSelectedPriority(ticket.priority)
    }
  }, [ticket])

  const fetchTicketDetail = async () => {
    try {
      const response = await fetch(`/api/admin/tickets/${id}`)
      const data = await response.json()

      if (response.ok) {
        setTicket(data.ticket)
      }
    } catch (error) {
      console.error('Failed to fetch ticket detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return

    setSendingReply(true)

    try {
      const response = await fetch('/api/admin/tickets/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: id,
          message: replyMessage,
          adminNotes: adminNotes || undefined
        })
      })

      if (response.ok) {
        setReplyMessage("")
        setAdminNotes("")
        await fetchTicketDetail() // Refresh the conversation
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setSendingReply(false)
    }
  }

  const handleUpdateStatus = async () => {
    setUpdatingStatus(true)

    try {
      const response = await fetch('/api/admin/tickets/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: id,
          status: selectedStatus,
          priority: selectedPriority
        })
      })

      if (response.ok) {
        await fetchTicketDetail() // Refresh the ticket data
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCloseTicket = async () => {
    if (!confirm('Are you sure you want to close this ticket?')) return

    setUpdatingStatus(true)

    try {
      const response = await fetch('/api/admin/tickets/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: id })
      })

      if (response.ok) {
        await fetchTicketDetail()
      }
    } catch (error) {
      console.error('Failed to close ticket:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const insertCannedResponse = (response: { title: string; message: string }) => {
    setReplyMessage(response.message)
    setShowCannedResponses(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Open
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
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

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || colors.Medium}`}>
        {priority}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">The requested ticket could not be found.</p>
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

  const availableCannedResponses = CANNED_RESPONSES[ticket.category as keyof typeof CANNED_RESPONSES] || []

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
                <h1 className="text-3xl font-bold text-gray-900">Ticket #{ticket.ticketNumber}</h1>
                <p className="text-gray-600 mt-1">Support ticket details and conversation</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ticket Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ticket Number:</span>
                    <span className="font-mono font-medium">#{ticket.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{ticket.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium">{ticket.user.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{ticket.user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Original Description */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Original Description</h3>
                <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
              </div>

              {/* Screenshot */}
              {ticket.screenshot && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Screenshot</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={ticket.screenshot}
                      alt="Ticket screenshot"
                      className="w-full rounded-lg cursor-pointer"
                      onClick={() => window.open(ticket.screenshot, '_blank')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Conversation Thread */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversation</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ticket.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg rounded-lg p-4 ${
                      message.isFromAdmin
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">
                          {message.isFromAdmin ? 'Support Team' : ticket.user.name || 'User'}
                        </span>
                        <span className="text-xs opacity-75">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-xs underline"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span>Attachment {index + 1}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority Update */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || (selectedStatus === ticket.status && selectedPriority === ticket.priority)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {updatingStatus ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Update</span>
                </button>
              </div>
            </div>

            {/* Reply Panel */}
            {ticket.status !== 'RESOLVED' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Reply</h3>
                <div className="space-y-4">
                  {/* Canned Responses */}
                  {availableCannedResponses.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowCannedResponses(!showCannedResponses)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        {showCannedResponses ? 'Hide' : 'Show'} Canned Responses
                      </button>

                      {showCannedResponses && (
                        <div className="mt-2 space-y-2">
                          {availableCannedResponses.map((response, index) => (
                            <button
                              key={index}
                              onClick={() => insertCannedResponse(response)}
                              className="w-full text-left p-2 border border-gray-200 rounded hover:bg-gray-50 text-sm"
                            >
                              <div className="font-medium">{response.title}</div>
                              <div className="text-gray-600 truncate">{response.message.substring(0, 50)}...</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply Message
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your reply here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes (Not visible to user)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add internal notes..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {sendingReply ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Send Reply</span>
                    </button>

                    <button
                      onClick={handleCloseTicket}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Close Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Ticket Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Ticket Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Messages:</span>
                  <span className="text-blue-900 font-medium">{ticket.messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Response Time:</span>
                  <span className="text-blue-900 font-medium">
                    {ticket.messages.length > 1
                      ? `${Math.round((new Date(ticket.messages[1].createdAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60))} min`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Age:</span>
                  <span className="text-blue-900 font-medium">
                    {Math.round((new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60))} hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}