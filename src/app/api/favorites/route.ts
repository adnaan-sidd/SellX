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

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            seller: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data for frontend
    const transformedFavorites = favorites.map(fav => ({
      id: fav.product.id,
      title: fav.product.title,
      price: fav.product.price,
      images: fav.product.images,
      city: fav.product.city,
      state: fav.product.state,
      createdAt: fav.createdAt.toISOString(),
      seller: fav.product.seller
    }))

    return NextResponse.json({ favorites: transformedFavorites })
  } catch (error) {
    console.error('Favorites fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}