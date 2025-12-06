import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({
        isAuthenticated: false,
        isVerified: false,
        needsVerification: false
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        isVerified: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({
        isAuthenticated: true,
        isVerified: false,
        needsVerification: false
      })
    }

    return NextResponse.json({
      isAuthenticated: true,
      isVerified: user.isVerified,
      needsVerification: !user.isVerified && user.role === 'BUYER'
    })
  } catch (error) {
    console.error('Buyer verification status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}