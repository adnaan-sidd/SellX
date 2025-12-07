// Message encryption/decryption utilities
export const encryptMessage = (message: string, key: string = 'sellx-chat-key'): string => {
  // Simple XOR encryption for demonstration
  // In production, use proper encryption like AES
  let encrypted = ''
  for (let i = 0; i < message.length; i++) {
    encrypted += String.fromCharCode(message.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(encrypted) // Base64 encode
}

export const decryptMessage = (encryptedMessage: string, key: string = 'sellx-chat-key'): string => {
  try {
    const decoded = atob(encryptedMessage) // Base64 decode
    let decrypted = ''
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt message:', error)
    return encryptedMessage
  }
}

// Rate limiting for spam prevention
const messageRateLimit = new Map<string, { count: number; resetTime: number }>()

export const checkRateLimit = (userId: string, maxMessages: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now()
  const userLimit = messageRateLimit.get(userId)

  if (!userLimit || now > userLimit.resetTime) {
    messageRateLimit.set(userId, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userLimit.count >= maxMessages) {
    return false
  }

  userLimit.count++
  return true
}

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now()
  for (const [userId, limit] of messageRateLimit.entries()) {
    if (now > limit.resetTime) {
      messageRateLimit.delete(userId)
    }
  }
}, 60000) // Clean up every minute