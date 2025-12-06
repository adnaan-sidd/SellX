import * as Sentry from '@sentry/nextjs'

// Initialize Sentry
export const initSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV || 'development',
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          console.log('Sentry event (dev):', event)
          return null
        }

        // Sanitize sensitive data
        if (event.request?.data && typeof event.request.data === 'object') {
          const sanitizedData = { ...event.request.data }
          // Remove sensitive fields from request data
          delete (sanitizedData as any).password
          delete (sanitizedData as any).otp
          delete (sanitizedData as any).token
          event.request.data = sanitizedData
        }

        return event
      },
    })
  }
}

// Custom error reporting
export const reportError = (
  error: Error,
  context?: {
    userId?: string
    action?: string
    metadata?: Record<string, any>
  }
) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (context?.userId) {
        scope.setUser({ id: context.userId })
      }
      if (context?.action) {
        scope.setTag('action', context.action)
      }
      if (context?.metadata) {
        Object.entries(context.metadata).forEach(([key, value]) => {
          scope.setTag(key, String(value))
        })
      }

      Sentry.captureException(error)
    })
  } else {
    console.error('Error reported:', error, context)
  }
}

// User feedback
export const captureUserFeedback = (
  message: string,
  userId?: string,
  metadata?: Record<string, any>
) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (userId) {
        scope.setUser({ id: userId })
      }
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          scope.setTag(key, String(value))
        })
      }

      Sentry.captureMessage(`User Feedback: ${message}`, 'info')
    })
  }
}

// Simple API monitoring wrapper
export const monitorApiCall = async <T>(
  apiCall: () => Promise<T>,
  operation: string,
  userId?: string
): Promise<T> => {
  try {
    const result = await apiCall()
    return result
  } catch (error) {
    reportError(error as Error, {
      userId,
      action: operation,
      metadata: { type: 'api_error' }
    })
    throw error
  }
}

// Simple database query monitoring
export const monitorDatabaseQuery = async <T>(
  query: () => Promise<T>,
  operation: string,
  table?: string
): Promise<T> => {
  try {
    const startTime = Date.now()
    const result = await query()
    const duration = Date.now() - startTime

    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow query detected: ${operation} took ${duration}ms`)
    }

    return result
  } catch (error) {
    reportError(error as Error, {
      action: operation,
      metadata: {
        type: 'database_error',
        table: table || 'unknown'
      }
    })
    throw error
  }
}

// Export for use in API routes
export { Sentry }