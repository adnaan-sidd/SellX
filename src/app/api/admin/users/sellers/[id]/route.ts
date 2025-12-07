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

    const { id: sellerId } = await params

    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!seller || seller.role !== 'SELLER') {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    return NextResponse.json({ seller })
  } catch (error) {
    console.error('Admin seller detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}