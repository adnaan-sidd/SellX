import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const condition = searchParams.get('condition')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'newest'

    const where: any = {
      status: 'ACTIVE'
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (condition) {
      where.condition = condition
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' }
    }

    const pageSize = limit || 20
    const skip = limit ? 0 : (page - 1) * pageSize

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              phone: true,
              // rating: true // Add later
            }
          }
        },
        orderBy,
        skip,
        take: pageSize
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    console.error('List products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}