import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    // Category filter
    if (category) {
      where.category = {
        name: {
          equals: category,
          mode: 'insensitive'
        }
      }
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Location filter
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } }
      ]
    }

    // Search filter
    if (search) {
      const searchFilter = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }

      if (where.OR) {
        where.AND = [searchFilter]
      } else {
        where.OR = searchFilter.OR
      }
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get total count
    const totalCount = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        subcategory: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Transform products for frontend
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      city: product.city,
      state: product.state,
      createdAt: product.createdAt.toISOString(),
      status: product.status,
      seller: {
        id: product.seller.id,
        name: product.seller.name,
        phone: product.seller.phone
      },
      category: product.category.name,
      subcategory: product.subcategory?.name
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Products list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}