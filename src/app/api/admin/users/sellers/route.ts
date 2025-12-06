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
      role: 'SELLER'
    }

    // Search filter
    if (search) {
      where.OR = [
        { phone: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { sellerDetails: { path: 'email', string_contains: search } }
      ]
    }

    // Status filter
    if (status === 'pending') {
      where.sellerStatus = 'PENDING'
    } else if (status === 'approved') {
      where.sellerStatus = 'APPROVED'
    } else if (status === 'rejected') {
      where.sellerStatus = 'REJECTED'
    } else if (status === 'suspended') {
      where.isSuspended = true
    }

    const sellers = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ sellers })
  } catch (error) {
    console.error('Admin sellers fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}