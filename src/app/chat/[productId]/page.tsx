"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { io, Socket } from 'socket.io-client'
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  MoreVertical,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  MessageCircle,
  Check,
  CheckCheck,
  Ban,
  AlertTriangle
} from "lucide-react"

interface Message {
  id: string
  senderId: string
  message: string
  imageUrl?: string
  timestamp: string
  isRead: boolean
}

interface Chat {
  id: string
  buyerId: string
  sellerId: string
  productId: string
  messages: Message[]
  lastMessage?: string
  buyerUnread: number
  sellerUnread: number
  buyerBlocked: boolean
  sellerBlocked: boolean
  product: {
    title: string
    images: string[]
    price: number
    city: string
    state: string
  }
  buyer: {
    id: string
    name: string
  }
  seller: {
    id: string
    name: string
    phone: string
  }
}

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.productId as string

  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockedByMe, setBlockedByMe] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signup')
      return
    }

    // Check buyer verification
    const checkVerification = async () => {
      try {
        const response = await fetch('/api/buyer/verification-status')
        const data = await response.json()

        if (!data.isVerified) {
          router.push('/verify-buyer')
          return
        }

        initializeChat()
      } catch (error) {
        console.error('Verification check error:', error)
        setError('Failed to verify buyer status')
      }
    }

    checkVerification()
  }, [isAuthenticated, productId, router])

  const initializeChat = async () => {
    try {
      // Try to find existing chat or create new one
      const chatResponse = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const chatData = await chatResponse.json()

      if (chatResponse.ok) {
        setChat(chatData.chat)
        setMessages(chatData.messages || [])
        setIsBlocked(chatData.isBlocked)
        setBlockedByMe(chatData.blockedByMe)

        // Initialize Socket.io connection
        initializeSocket(chatData.chat.id)
      } else {
        setError(chatData.error || 'Failed to load chat')
      }
    } catch (error) {
      console.error('Initialize chat error:', error)
      setError('Failed to initialize chat')
    } finally {
      setLoading(false)
    }
  }

  const initializeSocket = (chatId: string) => {
    const socketConnection = io(process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SOCKET_URL || ''
      : 'http://localhost:3001'
    )

    socketConnection.on('connect', () => {
      console.log('Connected to chat server')

      // Authenticate with server
      socketConnection.emit('authenticate', {
        userId: user?.id,
        token: 'authenticated' // In production, use proper JWT token
      })

      // Join chat room
      socketConnection.emit('join-chat', {
        chatId,
        userId: user?.id
      })
    })

    socketConnection.on('authenticated', (data) => {
      if (!data.success) {
        console.error('Socket authentication failed')
      }
    })

    socketConnection.on('joined-chat', (data) => {
      console.log('Joined chat room:', data.chatId)
    })

    socketConnection.on('receive-message', (message: Message) => {
      setMessages(prev => [...prev, message])
      // Mark as read if we're viewing the chat
      socketConnection.emit('mark-read', { chatId, userId: user?.id })
    })

    socketConnection.on('user-typing', (data) => {
      if (data.userId !== user?.id) {
        setOtherUserTyping(data.isTyping)
      }
    })

    socketConnection.on('user-blocked', (data) => {
      if (data.chatId === chatId) {
        setIsBlocked(true)
        setError('This user has blocked you')
      }
    })

    socketConnection.on('error', (error) => {
      console.error('Socket error:', error)
      setError(error.message || 'Connection error')
    })

    setSocket(socketConnection)

    return () => {
      socketConnection.disconnect()
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !chat || sending || isBlocked) return

    setSending(true)
    const messageToSend = newMessage.trim()
    setNewMessage('')

    try {
      socket.emit('send-message', {
        chatId: chat.id,
        message: messageToSend,
        userId: user?.id
      })

      // Optimistically add message to UI
      const tempMessage: Message = {
        id: `temp_${Date.now()}`,
        senderId: user?.id || '',
        message: messageToSend,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      setMessages(prev => [...prev, tempMessage])

    } catch (error) {
      console.error('Send message error:', error)
      setError('Failed to send message')
      setNewMessage(messageToSend) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !socket || !chat || isBlocked) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setSending(true)

    try {
      // Upload image to S3 first
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'chat-image')

      const uploadResponse = await fetch('/api/upload/chat-image', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      // Send message with image
      socket.emit('send-message', {
        chatId: chat.id,
        message: '',
        imageUrl,
        userId: user?.id
      })

      // Optimistically add message to UI
      const tempMessage: Message = {
        id: `temp_${Date.now()}`,
        senderId: user?.id || '',
        message: '',
        imageUrl,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      setMessages(prev => [...prev, tempMessage])

    } catch (error) {
      console.error('Image upload error:', error)
      setError('Failed to send image')
    } finally {
      setSending(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleTyping = (typing: boolean) => {
    if (socket && chat) {
      socket.emit('typing', {
        chatId: chat.id,
        userId: user?.id,
        isTyping: typing
      })
    }
  }

  const handleBlockUser = async () => {
    if (!socket || !chat) return

    try {
      socket.emit('block-user', {
        chatId: chat.id,
        userId: user?.id
      })
      setBlockedByMe(true)
    } catch (error) {
      console.error('Block user error:', error)
      setError('Failed to block user')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isMyMessage = (senderId: string) => senderId === user?.id
  const otherUser = chat ? (chat.buyerId === user?.id ? chat.seller : chat.buyer) : null

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (error && !chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chat Unavailable</h2>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {chat && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{otherUser?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {otherUserTyping ? 'Typing...' : 'Online'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {chat && !blockedByMe && (
              <div className="relative">
                <button
                  onClick={handleBlockUser}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600"
                  title="Block user"
                >
                  <Ban className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Product Info Card */}
        {chat && (
          <div className="bg-white border-b p-4">
            <div className="flex items-center space-x-4">
              <img
                src={chat.product.images[0] || '/placeholder-product.jpg'}
                alt={chat.product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 line-clamp-1">
                  {chat.product.title}
                </h4>
                <p className="text-lg font-bold text-gray-900">
                  ₹{chat.product.price.toLocaleString()}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{chat.product.city}, {chat.product.state}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Verified Seller</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isMyMessage(message.senderId) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isMyMessage(message.senderId)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border'
                }`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Shared image"
                    className="rounded-lg mb-2 max-w-full h-auto"
                  />
                )}
                {message.message && (
                  <p className="text-sm">{message.message}</p>
                )}
                <div className={`flex items-center mt-1 text-xs ${
                  isMyMessage(message.senderId) ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {isMyMessage(message.senderId) && (
                    <span className="ml-2">
                      {message.isRead ? (
                        <CheckCheck className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-white border px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          {isBlocked ? (
            <div className="text-center py-4">
              <Ban className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                {blockedByMe ? 'You have blocked this user' : 'This user has blocked you'}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={sending}
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping(true)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                onBlur={() => handleTyping(false)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sending}
                maxLength={1000}
              />

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}