import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Security headers configuration
export const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (formerly Feature-Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://js.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.amazonaws.com",
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://api.razorpay.com https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '),

  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Prevent caching of sensitive content
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// CORS configuration for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS || 'https://sellx.com'
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400' // 24 hours
}

// Handle CORS preflight requests
export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  return null
}

// CSRF token generation and validation
const CSRF_TOKENS = new Map<string, { token: string; expires: number }>()

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomUUID()
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour

  CSRF_TOKENS.set(sessionId, { token, expires })

  // Clean up expired tokens
  for (const [key, value] of CSRF_TOKENS.entries()) {
    if (Date.now() > value.expires) {
      CSRF_TOKENS.delete(key)
    }
  }

  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = CSRF_TOKENS.get(sessionId)

  if (!stored || stored.token !== token || Date.now() > stored.expires) {
    return false
  }

  // Token is single-use, remove after validation
  CSRF_TOKENS.delete(sessionId)
  return true
}

// Input sanitization functions
export function sanitizeHtml(input: string): string {
  // Remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:(?!image\/)/gi, '') // Allow data: for images only
    .trim()
}

export function sanitizeFilename(filename: string): string {
  // Remove path traversal and dangerous characters
  return filename
    .replace(/(\.\.[\/\\])+/g, '') // Remove ../
    .replace(/[\/\\:*?"<>|]/g, '_') // Replace dangerous chars with underscore
    .substring(0, 255) // Limit length
    .trim()
}

// SQL injection prevention (additional layer beyond Prisma)
export function sanitizeSqlInput(input: string): string {
  // Basic sanitization - Prisma already handles this, but this is an extra layer
  return input
    .replace(/['";\\]/g, '') // Remove quotes and semicolons
    .substring(0, 1000) // Limit length
}

// Validate file uploads
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File must be a valid image (JPEG, PNG, WebP, GIF)' }
  }

  // Check filename
  const sanitizedName = sanitizeFilename(file.name)
  if (sanitizedName !== file.name) {
    return { valid: false, error: 'Invalid filename' }
  }

  return { valid: true }
}

// Session security
export const sessionConfig = {
  cookieName: 'sellx-session',
  password: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  }
}

// Password security
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}