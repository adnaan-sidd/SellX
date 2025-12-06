import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logAuth } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user?.id) {
      // Log the logout event
      const clientIP = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      request.headers.get('x-client-ip') ||
                      'unknown'

      logAuth.logout(session.user.id, clientIP)
    }

    // Create response that clears the session
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear the session cookie
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/'
    })

    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed', code: 'LOGOUT_ERROR' },
      { status: 500 }
    )
  }
}