import winston from 'winston'
import path from 'path'

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

// Create logs directory path
const logsDir = path.join(process.cwd(), 'logs')

// Custom format for console logging
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ''
    return `${timestamp} [${level}]: ${message}${metaStr}`
  })
)

// File format (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Security events log
    new winston.transports.File({
      filename: path.join(logsDir, 'security.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
  ],
})

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }))
}

// Specialized logging functions
export const logAuth = {
  login: (userId: string, ip: string, userAgent: string) => {
    logger.info('User login successful', {
      userId,
      ip,
      userAgent,
      event: 'LOGIN_SUCCESS'
    })
  },

  loginFailed: (identifier: string, ip: string, reason: string) => {
    logger.warn('Login attempt failed', {
      identifier,
      ip,
      reason,
      event: 'LOGIN_FAILED'
    })
  },

  logout: (userId: string, ip: string) => {
    logger.info('User logout', {
      userId,
      ip,
      event: 'LOGOUT'
    })
  },

  sessionExpired: (userId: string, ip: string) => {
    logger.info('Session expired', {
      userId,
      ip,
      event: 'SESSION_EXPIRED'
    })
  }
}

export const logSecurity = {
  rateLimitExceeded: (ip: string, endpoint: string, userId?: string) => {
    logger.warn('Rate limit exceeded', {
      ip,
      endpoint,
      userId,
      event: 'RATE_LIMIT_EXCEEDED'
    })
  },

  suspiciousActivity: (ip: string, activity: string, details: any) => {
    logger.warn('Suspicious activity detected', {
      ip,
      activity,
      details,
      event: 'SUSPICIOUS_ACTIVITY'
    })
  },

  csrfViolation: (ip: string, endpoint: string, userId?: string) => {
    logger.error('CSRF token violation', {
      ip,
      userId,
      endpoint,
      event: 'CSRF_VIOLATION'
    })
  },

  unauthorizedAccess: (ip: string, endpoint: string, userId?: string) => {
    logger.warn('Unauthorized access attempt', {
      ip,
      endpoint,
      userId,
      event: 'UNAUTHORIZED_ACCESS'
    })
  },

  accountSuspended: (userId: string, reason: string) => {
    logger.warn('Account suspended', {
      userId,
      reason,
      event: 'ACCOUNT_SUSPENDED'
    })
  }
}

export const logPayment = {
  paymentInitiated: (userId: string, amount: number, orderId: string) => {
    logger.info('Payment initiated', {
      userId,
      amount,
      orderId,
      event: 'PAYMENT_INITIATED'
    })
  },

  paymentCompleted: (userId: string, amount: number, orderId: string, paymentId: string) => {
    logger.info('Payment completed successfully', {
      userId,
      amount,
      orderId,
      paymentId,
      event: 'PAYMENT_COMPLETED'
    })
  },

  paymentFailed: (userId: string, amount: number, orderId: string, reason: string) => {
    logger.error('Payment failed', {
      userId,
      amount,
      orderId,
      reason,
      event: 'PAYMENT_FAILED'
    })
  },

  refundProcessed: (userId: string, amount: number, reason: string) => {
    logger.info('Refund processed', {
      userId,
      amount,
      reason,
      event: 'REFUND_PROCESSED'
    })
  }
}

export const logAdmin = {
  action: (adminId: string, action: string, targetId?: string, details?: any) => {
    logger.info('Admin action performed', {
      adminId,
      action,
      targetId,
      details,
      event: 'ADMIN_ACTION'
    })
  },

  userModerated: (adminId: string, targetUserId: string, action: string, reason: string) => {
    logger.warn('User moderation action', {
      adminId,
      targetUserId,
      action,
      reason,
      event: 'USER_MODERATED'
    })
  },

  contentRemoved: (adminId: string, contentId: string, type: string, reason: string) => {
    logger.warn('Content removed by admin', {
      adminId,
      contentId,
      type,
      reason,
      event: 'CONTENT_REMOVED'
    })
  }
}

export const logError = {
  api: (endpoint: string, error: Error, userId?: string, ip?: string) => {
    logger.error('API error occurred', {
      endpoint,
      error: error.message,
      stack: error.stack,
      userId,
      ip,
      event: 'API_ERROR'
    })
  },

  database: (operation: string, error: Error, userId?: string) => {
    logger.error('Database error occurred', {
      operation,
      error: error.message,
      stack: error.stack,
      userId,
      event: 'DATABASE_ERROR'
    })
  },

  validation: (endpoint: string, errors: any, userId?: string) => {
    logger.warn('Validation error occurred', {
      endpoint,
      errors,
      userId,
      event: 'VALIDATION_ERROR'
    })
  }
}

// Request logging middleware for Winston
export const requestLogger = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    })
  })
)

// Performance logging
export const logPerformance = {
  slowQuery: (query: string, duration: number, userId?: string) => {
    logger.warn('Slow database query detected', {
      query: query.substring(0, 500), // Truncate long queries
      duration,
      userId,
      event: 'SLOW_QUERY'
    })
  },

  apiResponseTime: (endpoint: string, method: string, duration: number, statusCode: number) => {
    const level = duration > 5000 ? 'warn' : 'info'
    logger.log(level, 'API response time', {
      endpoint,
      method,
      duration,
      statusCode,
      event: 'API_RESPONSE_TIME'
    })
  }
}

// Export default logger for general use
export default logger