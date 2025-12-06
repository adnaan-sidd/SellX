import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Define types for route requirements
interface RouteRequirements {
  requiresAuth?: boolean
  requiresSeller?: boolean
  requiresBuyer?: boolean
  requiresAdmin?: boolean
  methods?: string[]
}

// Define protected routes and their requirements
const protectedRoutes: Record<string, RouteRequirements> = {
  // Routes that require authentication
  '/api/products/create': { requiresAuth: true },
  '/api/products/my-listings': { requiresAuth: true },
  '/api/products/[id]': { requiresAuth: true, methods: ['DELETE', 'PATCH', 'PUT'] },
  '/api/favorites': { requiresAuth: true },
  '/api/favorites/toggle': { requiresAuth: true },
  '/api/profile': { requiresAuth: true },
  '/api/profile/update': { requiresAuth: true },
  '/api/profile/upload-photo': { requiresAuth: true },
  '/api/profile/delete-account': { requiresAuth: true },
  '/api/settings': { requiresAuth: true },
  '/api/fraud-reports': { requiresAuth: true },
  '/api/fraud-reports/my-reports': { requiresAuth: true },
  '/api/support/create-ticket': { requiresAuth: true },
  '/api/support/my-tickets': { requiresAuth: true },
  '/api/payments/[id]': { requiresAuth: true },

  // Routes that require seller verification
  '/post-product': { requiresAuth: true, requiresSeller: true },
  '/api/post-product': { requiresAuth: true, requiresSeller: true },

  // Routes that require buyer verification
  '/chat': { requiresAuth: true, requiresBuyer: true },
  '/api/chat': { requiresAuth: true, requiresBuyer: true },

  // Admin routes
  '/admin': { requiresAuth: true, requiresAdmin: true },
  '/api/admin': { requiresAuth: true, requiresAdmin: true },
}

// Public routes that don't need authentication
const publicRoutes = [
  '/',
  '/about-us',
  '/contact-us',
  '/terms-and-conditions',
  '/privacy-policy',
  '/safety-center',
  '/refund-policy',
  '/help-center',
  '/faqs',
  '/how-to-buy',
  '/how-to-sell',
  '/safety-tips',
  '/careers',
  '/blog',
  '/signup',
  '/signin',
  '/verify-otp',
  '/api/auth',
  '/api/products/list',
  '/api/location/pincode',
  '/api/contact/submit',
  '/api/newsletter/subscribe',
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/api/payment/create-order',
  '/api/payment/verify',
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )
}

function getRouteRequirements(pathname: string, method: string) {
  // Check for dynamic routes
  for (const [route, requirements] of Object.entries(protectedRoutes)) {
    if (route.includes('[id]')) {
      const pattern = route.replace('[id]', '[^/]+')
      if (new RegExp(`^${pattern}$`).test(pathname)) {
        // Check if method is restricted
        if (requirements.methods && !requirements.methods.includes(method)) {
          return null // Method not protected
        }
        return requirements
      }
    } else if (pathname === route || pathname.startsWith(route + '/')) {
      return requirements
    }
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // Skip middleware for static files, Next.js internals, and API routes that don't need protection
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    return NextResponse.next()
  }

  // Check if route is public
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Get route requirements
  const requirements = getRouteRequirements(pathname, method)

  if (!requirements) {
    // Route doesn't have specific requirements, allow access
    return NextResponse.next()
  }

  try {
    // Get session
    const session = await getServerSession(authOptions)

    // Check authentication requirement
    if (requirements.requiresAuth && !session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }

    // If user is authenticated, check additional requirements
    if (session?.user?.id) {
      // Check if user is suspended
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isSuspended: true, role: true, sellerStatus: true, isVerified: true }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 401 }
        )
      }

      // Check if user is suspended
      if (user.isSuspended) {
        return NextResponse.json(
          { error: 'Account suspended. Contact support for assistance.', code: 'ACCOUNT_SUSPENDED' },
          { status: 403 }
        )
      }

      // Check seller verification requirement
      if (requirements.requiresSeller) {
        if (user.role !== 'SELLER' || user.sellerStatus !== 'APPROVED') {
          return NextResponse.json(
            { error: 'Seller verification required', code: 'SELLER_REQUIRED' },
            { status: 403 }
          )
        }
      }

      // Check buyer verification requirement
      if (requirements.requiresBuyer) {
        if (!user.isVerified) {
          return NextResponse.json(
            { error: 'Buyer verification required', code: 'BUYER_REQUIRED' },
            { status: 403 }
          )
        }
      }

      // Check admin requirement
      if (requirements.requiresAdmin) {
        if (user.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Admin access required', code: 'ADMIN_REQUIRED' },
            { status: 403 }
          )
        }
      }
    }

    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'MIDDLEWARE_ERROR' },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}