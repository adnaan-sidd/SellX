const { createServer } = require('http')
const { Server } = require('socket.io')
const { PrismaClient } = require('@prisma/client')
const { encryptMessage, decryptMessage, checkRateLimit } = require('./src/app/api/socket/route')

const prisma = new PrismaClient()

const server = createServer()
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Store online users and their socket IDs
const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // Authenticate user
  socket.on('authenticate', async (data) => {
    try {
      const { userId, token } = data

      // In production, verify the token properly
      // For now, we'll trust the userId from the client
      socket.userId = userId
      onlineUsers.set(userId, socket.id)

      socket.emit('authenticated', { success: true })
      console.log(`User ${userId} authenticated with socket ${socket.id}`)
    } catch (error) {
      console.error('Authentication error:', error)
      socket.emit('authenticated', { success: false, error: 'Authentication failed' })
    }
  })

  // Join a chat room
  socket.on('join-chat', async (data) => {
    try {
      const { chatId, userId } = data

      // Verify user has access to this chat
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: {
          buyerId: true,
          sellerId: true,
          buyerBlocked: true,
          sellerBlocked: true
        }
      })

      if (!chat) {
        socket.emit('error', { message: 'Chat not found' })
        return
      }

      // Check if user is part of this chat
      if (chat.buyerId !== userId && chat.sellerId !== userId) {
        socket.emit('error', { message: 'Unauthorized access to chat' })
        return
      }

      // Check if user is blocked
      const isBuyer = chat.buyerId === userId
      const isBlocked = isBuyer ? chat.sellerBlocked : chat.buyerBlocked

      if (isBlocked) {
        socket.emit('error', { message: 'You have been blocked from this chat' })
        return
      }

      socket.join(chatId)
      console.log(`User ${userId} joined chat ${chatId}`)

      // Mark messages as read for this user
      await updateReadReceipts(chatId, userId)

      socket.emit('joined-chat', { chatId })
    } catch (error) {
      console.error('Join chat error:', error)
      socket.emit('error', { message: 'Failed to join chat' })
    }
  })

  // Send a message
  socket.on('send-message', async (data) => {
    try {
      const { chatId, message, imageUrl, userId } = data

      // Rate limiting check
      if (!checkRateLimit(userId)) {
        socket.emit('error', { message: 'Too many messages. Please wait before sending another message.' })
        return
      }

      // Verify user has access to this chat
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: {
          buyerId: true,
          sellerId: true,
          buyerBlocked: true,
          sellerBlocked: true,
          messages: true
        }
      })

      if (!chat) {
        socket.emit('error', { message: 'Chat not found' })
        return
      }

      // Check if user is part of this chat
      if (chat.buyerId !== userId && chat.sellerId !== userId) {
        socket.emit('error', { message: 'Unauthorized access to chat' })
        return
      }

      // Check if user is blocked
      const isBuyer = chat.buyerId === userId
      const isBlocked = isBuyer ? chat.sellerBlocked : chat.buyerBlocked

      if (isBlocked) {
        socket.emit('error', { message: 'You have been blocked from this chat' })
        return
      }

      // Encrypt the message
      const encryptedMessage = encryptMessage(message)

      // Create message object
      const messageObj = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: userId,
        message: encryptedMessage,
        imageUrl: imageUrl || null,
        timestamp: new Date().toISOString(),
        isRead: false
      }

      // Update chat with new message
      const existingMessages = chat.messages ? JSON.parse(chat.messages) : []
      const updatedMessages = [...existingMessages, messageObj]

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          messages: JSON.stringify(updatedMessages),
          lastMessage: message.substring(0, 100), // Truncate for preview
          lastActivity: new Date(),
          // Increment unread count for the other user
          buyerUnread: isBuyer ? 0 : { increment: 1 },
          sellerUnread: isBuyer ? { increment: 1 } : 0
        }
      })

      // Send message to all users in the chat room
      io.to(chatId).emit('receive-message', {
        ...messageObj,
        message: message // Send decrypted message to clients
      })

      // Send notification to offline users
      const otherUserId = isBuyer ? chat.sellerId : chat.buyerId
      const otherUserSocketId = onlineUsers.get(otherUserId)

      if (!otherUserSocketId) {
        // User is offline, could send push notification here
        console.log(`User ${otherUserId} is offline, message saved for later delivery`)
      }

    } catch (error) {
      console.error('Send message error:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // Mark messages as read
  socket.on('mark-read', async (data) => {
    try {
      const { chatId, userId } = data
      await updateReadReceipts(chatId, userId)
    } catch (error) {
      console.error('Mark read error:', error)
    }
  })

  // Typing indicator
  socket.on('typing', (data) => {
    const { chatId, userId, isTyping } = data
    socket.to(chatId).emit('user-typing', { userId, isTyping })
  })

  // Block user
  socket.on('block-user', async (data) => {
    try {
      const { chatId, userId } = data

      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { buyerId: true, sellerId: true }
      })

      if (!chat) {
        socket.emit('error', { message: 'Chat not found' })
        return
      }

      const isBuyer = chat.buyerId === userId
      const updateData = isBuyer
        ? { buyerBlocked: true }
        : { sellerBlocked: true }

      await prisma.chat.update({
        where: { id: chatId },
        data: updateData
      })

      // Notify the other user
      const otherUserId = isBuyer ? chat.sellerId : chat.buyerId
      const otherUserSocketId = onlineUsers.get(otherUserId)

      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit('user-blocked', { chatId, blockedBy: userId })
      }

      socket.emit('user-blocked-success', { chatId })
    } catch (error) {
      console.error('Block user error:', error)
      socket.emit('error', { message: 'Failed to block user' })
    }
  })

  socket.on('disconnect', () => {
    // Remove user from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }
    console.log('User disconnected:', socket.id)
  })
})

// Helper function to update read receipts
async function updateReadReceipts(chatId, userId) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        buyerId: true,
        sellerId: true,
        messages: true,
        buyerUnread: true,
        sellerUnread: true
      }
    })

    if (!chat) return

    // Update messages to mark as read for this user
    const messages = chat.messages ? JSON.parse(chat.messages) : []
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isRead: msg.senderId !== userId ? true : msg.isRead
    }))

    // Reset unread count for this user
    const isBuyer = chat.buyerId === userId
    const updateData = isBuyer
      ? { buyerUnread: 0, messages: JSON.stringify(updatedMessages) }
      : { sellerUnread: 0, messages: JSON.stringify(updatedMessages) }

    await prisma.chat.update({
      where: { id: chatId },
      data: updateData
    })
  } catch (error) {
    console.error('Update read receipts error:', error)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    console.log('Socket.io server closed')
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  server.close(() => {
    console.log('Socket.io server closed')
    process.exit(0)
  })
})

const PORT = process.env.SOCKET_PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`)
})