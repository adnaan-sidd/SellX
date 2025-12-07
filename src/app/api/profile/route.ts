import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        profilePhoto: true,
        city: true,
        state: true,
        role: true,
        isVerified: true,
        buyerIdUrl: true,
        sellerStatus: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            chatsAsBuyer: true,
            chatsAsSeller: true,
            fraudReports: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get additional stats
    const activeProducts = await prisma.product.count({
      where: {
        sellerId: session.user.id,
        status: 'ACTIVE'
      }
    })

    const stats = {
      totalProducts: user._count.products,
      activeProducts,
      totalChats: user._count.chatsAsBuyer + user._count.chatsAsSeller,
      totalReports: user._count.fraudReports
    }

    return NextResponse.json({
      profile: {
        ...user,
        _count: undefined // Remove _count from response
      },
      stats
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}