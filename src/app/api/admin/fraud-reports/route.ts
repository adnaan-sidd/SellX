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
    const reason = searchParams.get('reason') || 'all'

    // Build where clause
    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { product: { title: { contains: search, mode: 'insensitive' } } },
        { reporter: { name: { contains: search, mode: 'insensitive' } } },
        { reporter: { phone: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Status filter
    if (status !== 'all') {
      where.status = status
    }

    // Reason filter
    if (reason !== 'all') {
      where.reason = reason
    }

    const reports = await prisma.fraudReport.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Admin fraud reports fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}