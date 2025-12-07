import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')

    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        seller: {
          select: {
            name: true,
            isVerified: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        subcategory: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({
      products,
      success: true
    })
  } catch (error) {
    console.error('Failed to fetch recent products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent products' },
      { status: 500 }
    )
  }
}