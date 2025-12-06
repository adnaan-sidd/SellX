import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAuth } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No active session', code: 'NO_SESSION' },
        { status: 401 }
      )
    }

    // Verify user still exists and is not suspended
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        isSuspended: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 401 }
      )
    }

    if (user.isSuspended) {
      return NextResponse.json(
        { error: 'Account suspended', code: 'ACCOUNT_SUSPENDED' },
        { status: 403 }
      )
    }

    // Log successful token refresh
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    request.headers.get('x-client-ip') ||
                    'unknown'

    logAuth.login(session.user.id, clientIP, request.headers.get('user-agent') || 'unknown')

    // Return success - NextAuth will handle the actual token refresh
    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Token refresh failed', code: 'REFRESH_ERROR' },
      { status: 500 }
    )
  }
}