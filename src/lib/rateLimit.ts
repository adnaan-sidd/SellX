import { NextRequest } from 'next/server'

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configurations
export const RATE_LIMITS = {
  OTP_REQUESTS: { maxRequests: 3, windowMs: 10 * 60 * 1000 }, // 3 requests per 10 minutes
  FRAUD_REPORTS: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5 reports per day
  SUPPORT_TICKETS: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10 tickets per day
  API_CALLS: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
} as const

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function getRateLimitKey(
  identifier: string,
  type: keyof typeof RATE_LIMITS,
  userId?: string
): string {
  // Use user ID if available, otherwise use identifier (IP, etc.)
  const key = userId || identifier
  return `${type}:${key}`
}

export function checkRateLimit(
  key: string,
  type: keyof typeof RATE_LIMITS
): RateLimitResult {
  const config = RATE_LIMITS[type]
  const now = Date.now()

  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetTime) {
    // First request or window expired
    const resetTime = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetTime })

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime
    }
  }

  if (existing.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime,
      retryAfter: Math.ceil((existing.resetTime - now) / 1000)
    }
  }

  // Increment counter
  existing.count++
  rateLimitStore.set(key, existing)

  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime
  }
}

export function getClientIP(request: NextRequest): string {
  // Try different headers to get the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIP) return realIP
  if (clientIP) return clientIP

  // Fallback to a default (not recommended for production)
  return 'unknown'
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Clean up every minute

// Middleware function for API routes
export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<Response>,
  type: keyof typeof RATE_LIMITS,
  useUserId: boolean = false
) {
  return async (request: NextRequest, context?: any) => {
    try {
      const clientIP = getClientIP(request)
      let userId: string | undefined

      // Try to get user ID if needed (this is a simplified version)
      if (useUserId) {
        // In a real implementation, you'd get this from the session
        // For now, we'll use IP-based limiting
      }

      const key = getRateLimitKey(clientIP, type, userId)
      const result = checkRateLimit(key, type)

      if (!result.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            retryAfter: result.retryAfter,
            code: 'RATE_LIMIT_EXCEEDED'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': result.retryAfter?.toString() || '60',
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetTime.toString()
            }
          }
        )
      }

      // Add rate limit headers to response
      const response = await handler(request, context)

      if (response instanceof Response) {
        const newResponse = new Response(response.body, response)
        newResponse.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        newResponse.headers.set('X-RateLimit-Reset', result.resetTime.toString())
        return newResponse
      }

      return response
    } catch (error) {
      console.error('Rate limiting error:', error)
      return new Response(
        JSON.stringify({ error: 'Internal server error', code: 'RATE_LIMIT_ERROR' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}