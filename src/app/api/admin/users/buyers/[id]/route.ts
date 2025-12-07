import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: buyerId } = await params

    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      include: {
        fraudReports: {
          include: {
            product: {
              select: { title: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        supportTickets: {
          orderBy: { createdAt: 'desc' }
        },
        chatsAsBuyer: {
          select: { id: true }
        },
        _count: {
          select: {
            chatsAsBuyer: true
          }
        }
      }
    })

    if (!buyer || buyer.role !== 'BUYER') {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
    }

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error('Admin buyer detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}