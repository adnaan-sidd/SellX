import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    // Build where clause
    const where: any = {
      role: 'BUYER'
    }

    // Search filter
    if (search) {
      where.OR = [
        { phone: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Status filter
    if (status === 'verified') {
      where.isVerified = true
    } else if (status === 'unverified') {
      where.isVerified = false
    } else if (status === 'suspended') {
      where.isSuspended = true
    }

    const buyers = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            fraudReports: true,
            supportTickets: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ buyers })
  } catch (error) {
    console.error('Admin buyers fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}